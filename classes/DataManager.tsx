// import fs from "fs";
// import dfd from "danfojs-node";
// import * as dfd from "danfojs/src/index";
import DataCalculator from "./DataCalculator";

type Ref = {};

class DataManager {
  private appData: Object | null;
  private primary: Object | null;
  private partner: Object | null;
  private dependents: Object | null;
  private children: Object | null;
  private jointDependents: Object | null;
  private partnerDependents: Object | null;
  private joint: Object | null;

  private assetsRefs;
  private expensesRefs;
  private liabilitiesRefs;
  private incomesRefs;

  private df;
  private DataCalculator;
  private assumptions;
  private calculatedAssumptions;
  private calculatedFutureValues;
  private assumptionsCalculated;

  private calculatedExpenses;
  private calculatedNetWorths;

  private categories = ["incomes", "expenses", "assets", "liabilities"];

  constructor(appData, assumptions = undefined) {
    this.appData = appData;
    this.DataCalculator = new DataCalculator();
    const {
      primary,
      partner,
      dependents,
      children,
      jointDependents,
      partnerDependents,
      joint,
    } = appData;
    this.assumptions = {};
    this.calculatedAssumptions = {};
    this.calculatedFutureValues = {};
    this.assumptionsCalculated = false;

    this.primary = this.verifySinglePersonDataExists(primary);
    this.partner = this.verifySinglePersonDataExists(partner);
    this.dependents = this.verifyGroupDataExists(dependents);
    this.children = this.verifyGroupDataExists(children);
    this.jointDependents = this.verifyGroupDataExists(jointDependents);
    this.partnerDependents = this.verifyGroupDataExists(partnerDependents);
    this.joint = Object.keys(joint).length > 0 ? joint : undefined;
    this.assetsRefs = {};
    this.expensesRefs = {};
    this.incomesRefs = {};
    this.liabilitiesRefs = {};
    this.setupRefs();
    if (assumptions) this.calculateAssumptions(assumptions);

    // this.df = new dfd.DataFrame(this.reshapeAllDataForDataFrame());
  }

  public getTypeArray(type) {
    const key = `${type}Refs`;
    if (Object.keys(this[key]).length === 0) return [];
    return Object.entries(this[key]).reduce(
      (acc, next) => acc.concat(next[1]),
      []
    );
  }

  public getAssumption(field) {
    return this.assumptions?.[field] || this.calculatedAssumptions?.[field];
  }

  private getTaxToBeDeductedFromInvestmentReturns(
    taxOnIncomeGrowth,
    investmentReturnsIncome,
    taxOnFutureCapitalGrowth,
    investmentReturnsExpense
  ) {
    return (
      taxOnIncomeGrowth * investmentReturnsIncome +
      taxOnFutureCapitalGrowth * investmentReturnsExpense
    );
  }
  private getTaxToBeDeductedFromInvestmentReturn = (assumptions) => {
    return this.getTaxToBeDeductedFromInvestmentReturns(
      assumptions["taxation"]["taxOnIncomeGrowth"] / 100,
      assumptions["investmentReturns"]["income"] / 100,
      assumptions["taxation"]["taxOnFutureCapitalGrowth"] / 100,
      assumptions["investmentReturns"]["expenses"] / 100
    );
  };

  public static reshapeAssumptions(assumptions) {
    const reshapedAssumptions = {};
    for (let assumption of assumptions) {
      if (reshapedAssumptions[assumption.for]) {
        reshapedAssumptions[assumption.for] = {
          ...reshapedAssumptions[assumption.for],
          [assumption.type]: assumption.value,
        };
      } else {
        reshapedAssumptions[assumption.for] = {
          [assumption.type]: assumption.value,
        };
      }
    }
    return reshapedAssumptions;
  }

  private reshapeAssumptions(assumptions) {
    const reshapedAssumptions = {};
    for (let assumption of assumptions) {
      if (reshapedAssumptions[assumption.for]) {
        reshapedAssumptions[assumption.for] = {
          ...reshapedAssumptions[assumption.for],
          [assumption.type]: assumption.value,
        };
      } else {
        reshapedAssumptions[assumption.for] = {
          [assumption.type]: assumption.value,
        };
      }
    }
    this.assumptions = reshapedAssumptions;
    return reshapedAssumptions;
  }

  private getMinAge = (primaryAge, partnerAge) =>
    primaryAge < partnerAge ? primaryAge : partnerAge;
  private calculateAge(dateOfBirth) {
    // birthday is a date
    var ageDifMs = Date.now() - dateOfBirth;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  private getMinAgeFromClientData = (clientData) => {
    const primaryDoB = new Date(clientData.primary.dateOfBirth);
    const primaryAge = this.calculateAge(primaryDoB);
    if (!clientData.hasPartner) return primaryAge;
    else {
      const partnerDoB = new Date(clientData.partner.dateOfBirth);
      const partnerAge = this.calculateAge(partnerDoB);
      return this.getMinAge(primaryAge, partnerAge);
    }
  };
  private getNumYearsToSupportChildrenArray = (
    clientData,
    numYearsToSupportChildren
  ) => {
    const { children } = clientData;
    return children.map((child) => [
      child.firstName,
      numYearsToSupportChildren -
        this.calculateAge(new Date(child.dateOfBirth)),
    ]);
  };
  private _calculateAssumptions = (clientData, assumptions) => {
    const clientAge = this.calculateAge(
      new Date(clientData?.primary?.dateOfBirth)
    );
    const taxToBeDeductedFromInvestmentReturns =
      this.getTaxToBeDeductedFromInvestmentReturns(
        assumptions?.taxation?.taxOnIncomeGrowth / 100,
        assumptions?.investmentReturns?.income / 100,
        assumptions?.taxation?.taxOnFutureCapitalGrowth / 100,
        assumptions?.investmentReturns?.expenses / 100
      );

    if (!clientData.hasPartner && !clientData.hasChildren) {
      const yearsUntilRetirementForYoungestPartner =
        assumptions?.other?.retirementAge - clientAge;
      const yearsUntilMortalityPrimary =
        assumptions?.other?.mortalityAge - clientAge;

      this.calculatedAssumptions = {
        ...this.calculatedAssumptions,
        taxToBeDeductedFromInvestmentReturns,
        yearsUntilRetirementForYoungestPartner,
        yearsUntilRetirementPrimary: yearsUntilRetirementForYoungestPartner,
        yearsUntilMortalityPrimary,
        yearsUntilMortalityForYoungestPartner: yearsUntilMortalityPrimary,
      };
    } else if (!clientData.hasPartner && clientData.hasChildren) {
      const yearsUntilRetirementForYoungestPartner =
        assumptions?.other?.retirementAge - clientAge;
      const yearsUntilMortalityPrimary =
        assumptions?.other?.mortalityAge - clientAge;

      this.calculatedAssumptions = {
        ...this.calculatedAssumptions,
        taxToBeDeductedFromInvestmentReturns,
        yearsUntilRetirementForYoungestPartner,
        yearsUntilRetirementPrimary: yearsUntilRetirementForYoungestPartner,
        yearsUntilMortalityPrimary,
        yearsUntilMortalityForYoungestPartner: yearsUntilMortalityPrimary,
        numYearsToSupportChildren: this.getNumYearsToSupportChildrenArray(
          clientData,
          assumptions.other?.maximumAgeToFundChildren
        ),
      };
    } else if (clientData.hasPartner && !clientData.hasChildren) {
      const partnerAge = this.calculateAge(
        new Date(clientData?.partner?.dateOfBirth)
      );
      const yearsUntilRetirementForYoungestPartner =
        assumptions?.other?.retirementAge -
        this.getMinAgeFromClientData(clientData);

      const yearsUntilMortalityPrimary =
        assumptions?.other?.mortalityAge - clientAge;
      const yearsUntilMortalityPartner =
        assumptions?.other?.mortalityAge - partnerAge;

      const yearsUntilRetirementPrimary =
        assumptions?.other?.retirementAge - clientAge;
      const yearsUntilRetirementPartner =
        assumptions?.other?.retirementAge - partnerAge;

      this.calculatedAssumptions = {
        ...this.calculatedAssumptions,
        taxToBeDeductedFromInvestmentReturns,
        yearsUntilRetirementForYoungestPartner,
        yearsUntilRetirementPrimary,
        yearsUntilRetirementPartner,
        yearsUntilMortalityPrimary,
        yearsUntilMortalityPartner,
        yearsUntilMortalityForYoungestPartner: this.getMinNumYears(
          yearsUntilMortalityPrimary,
          yearsUntilMortalityPartner
        ),
      };
    } else if (clientData.hasPartner && clientData.hasChildren) {
      const partnerAge = this.calculateAge(
        new Date(clientData.partner?.dateOfBirth)
      );
      const yearsUntilRetirementForYoungestPartner =
        assumptions?.other?.retirementAge -
        this.getMinAgeFromClientData(clientData);

      const yearsUntilMortalityPrimary =
        assumptions?.other?.mortalityAge - clientAge;
      const yearsUntilMortalityPartner =
        assumptions?.other?.mortalityAge - partnerAge;
      const yearsUntilRetirementPrimary =
        assumptions?.other?.retirementAge - clientAge;
      const yearsUntilRetirementPartner =
        assumptions?.other?.retirementAge - partnerAge;
      this.calculatedAssumptions = {
        ...this.calculatedAssumptions,
        taxToBeDeductedFromInvestmentReturns,
        yearsUntilRetirementForYoungestPartner,
        yearsUntilRetirementPrimary,
        yearsUntilRetirementPartner,
        yearsUntilMortalityPrimary,
        yearsUntilMortalityPartner,
        yearsUntilMortalityForYoungestPartner: this.getMinNumYears(
          yearsUntilMortalityPrimary,
          yearsUntilMortalityPartner
        ),
        numYearsToSupportChildren: this.getNumYearsToSupportChildrenArray(
          clientData,
          assumptions?.other?.maximumAgeToFundChildren
        ),
      };
    }
  };

  public calculateAssumptions(assumptions) {
    //  if (this.calculatedAssumptions) return res(true);
    const reshapedAssumptions = this.reshapeAssumptions(assumptions);
    console.log("--- USING THESE RESHAPED SHITS ---");
    console.log(reshapedAssumptions);
    this._calculateAssumptions(this.appData, reshapedAssumptions);
    this.assumptionsCalculated = true;
    console.log("RESHAPED ASSUMPTIONS");
    console.log(this.assumptions);
    console.log("CALCULATED ASSUMPTIONS");
    console.log(this.calculatedAssumptions);
  }

  public getFutureValue(type, rate, numYears) {
    const sum = this.getAggregateSumForSomeCategory(type);
    return this.DataCalculator.fv(sum, rate, numYears);
  }
  public getFutureValues(type, rate) {
    const sum = this.getAggregateSumForSomeCategory(type);
    const numYears =
      this.calculatedAssumptions?.yearsUntilMortalityForYoungestPartner;
    const results = this.DataCalculator.fvs(sum, rate, numYears);
    this.calculatedFutureValues[type] = results;
    return results;
  }
  public getFutureSalaryValuesByPerson(type) {
    const refsKeyedByType = this.getRefsKeyedByType(type);
    const salaryIncomes = refsKeyedByType?.salaryIncome;
    const rate = this.assumptions?.["growthRate"]?.["CPI"] || 2.0;
    const clientName = this.appData?.primary?.firstName;
    const partnerName = this.appData?.partner?.firstName;
    const yearsUntilRetirementPrimary =
      this.calculatedAssumptions?.yearsUntilRetirementPrimary;

    const yearsUntilRetirementPartner =
      this.calculatedAssumptions?.yearsUntilRetirementPartner;

    const results = {};
    for (let salaryIncome of salaryIncomes) {
      const name = salaryIncome?.person;
      const value = salaryIncome?.value;
      const rateAsPercent = rate / 100;
      const nYears =
        name === clientName
          ? yearsUntilRetirementPrimary
          : name === partnerName
          ? yearsUntilRetirementPartner
          : yearsUntilRetirementPrimary;

      results[name] = this.DataCalculator.fvs(value, rateAsPercent, nYears);
    }
    return results;
  }

  private getMinNumYears(primary, partner) {
    return Math.max(primary || 0, partner || 0);
  }

  public getGraphData(configOptions = {}) {
    if (this === undefined) return undefined;

    const taxToBeDeductedFromInvestmentReturns =
      this?.calculatedAssumptions?.taxToBeDeductedFromInvestmentReturns;
    const numYears =
      this.calculatedAssumptions?.yearsUntilMortalityForYoungestPartner || 50;
    const cpi = this.assumptions?.["growthRate"]?.["CPI"] || 3.55;
    const aggSumForAssets = this.getAggregateSumForSomeCategory("assets");
    const aggSumForLiabilities =
      this.getAggregateSumForSomeCategory("liabilities");
    // const incomes = this.getAggregateSumKeyedByType("incomes");
    const aggSumForExpenses = this.getAggregateSumForSomeCategory("expenses");
    const familyHomeValue = this.getHomeValue();

    // const allIncomes = this.incomesRefs;
    // const _allIncomes = this.

    const { graphData, expenses, netWorths } =
      this.DataCalculator?.getGraphData(
        numYears,
        aggSumForAssets,
        aggSumForLiabilities,
        aggSumForExpenses,
        cpi,
        taxToBeDeductedFromInvestmentReturns,
        familyHomeValue,
        configOptions
      );

    this.calculatedExpenses = expenses;
    this.calculatedNetWorths = netWorths;

    return graphData;
  }

  public getSummaryGraphData = (configOptions = {}) => {
    if (
      this.calculatedExpenses === undefined ||
      this.calculatedNetWorths === undefined
    ) {
      this.getGraphData(configOptions);
    }
    return {
      expenses: this.calculatedExpenses,
      netWorths: this.calculatedNetWorths,
    };
  };

  private getHomeValue() {
    const familyHomeObject = Object.entries(this.assetsRefs)
      .flatMap(([name, assets]) => assets)
      .filter((asset) => asset.type === "familyHome");

    return familyHomeObject[0]?.value || 0;
  }

  public getNetWorths(preRate, postRate, numYearsUntilEnough = 0) {
    const numYears =
      this.calculatedAssumptions?.yearsUntilMortalityForYoungestPartner;

    const aggSumForAssets = this.getAggregateSumForSomeCategory("assets");
    const aggSumForLiabilities =
      this.getAggregateSumForSomeCategory("liabilities");
    const familyHomeValue = this.getHomeValue();

    return this.DataCalculator.getNetWorths(
      numYears,
      preRate,
      postRate,
      aggSumForAssets,
      aggSumForLiabilities,
      this.calculatedFutureValues["expenses"],
      familyHomeValue,
      this.calculatedAssumptions.taxToBeDeductedFromInvestmentReturns,
      numYearsUntilEnough
    );
  }

  public getPeople = () => {
    return [this.primary, this.partner]
      .concat(this.children)
      .concat(this.dependents)
      .concat(this.partnerDependents)
      .concat(this.jointDependents)
      .filter((v) => v !== undefined);
  };

  public groupby = (type: string[]) => {
    return this.df.groupby(type);
  };

  public getRefsByType = (type: string) => {
    return this[`${type}Refs`];
  };

  reshapeAllDataForDataFrame = () => {
    [
      this.assetsRefs,
      this.expensesRefs,
      this.assetsRefs,
      this.liabilitiesRefs,
    ].flatMap((data, idx) =>
      this.reshapeDataForDataFrame(data, this.categories[idx])
    );
  };

  reshapeDataForDataFrame = (input, inputType) => {
    const reshapedData = [];
    for (let [person, dataArray] of Object.entries(input)) {
      for (let entry of dataArray) {
        reshapedData.push({
          class: entry.class,
          type: entry.type,
          value: entry.value,
          name: person,
          category: inputType,
        });
      }
    }
    return reshapedData;
  };

  public static frequencyToNumberMap(type, frequency = "") {
    if (type === "liabilities" || type === "assets") return 1;
    const multipliers = {
      weekly: 52,
      fortnightly: 26,
      monthly: 12,
      annually: 1,
      biAnnually: 2,
      quarterly: 4,
    };
    return multipliers[frequency] || 1;
  }

  getAllCategoriesKeyedByType() {
    return {
      incomes: this.getAggregateSumKeyedByType("incomes"),
      expenses: this.getAggregateSumKeyedByType("expenses"),
      assets: this.getAggregateSumKeyedByType("assets"),
      liabilities: this.getAggregateSumKeyedByType("liabilities"),
    };
  }

  public getAllRefsKeyedByType() {
    return {
      incomes: this.getRefsKeyedByType("incomes"),
      expenses: this.getRefsKeyedByType("expenses"),
      assets: this.getRefsKeyedByType("assets"),
      liabilities: this.getRefsKeyedByType("liabilities"),
    };
  }
  /*
    Get ["incomes", "expenses", "assets", "liabilities"] keyed by their type
    - e.g. personalExpense, rent, ...
    type Expense implements BudgetItem {
      type: String
      parentType: String
      label: String
      value: Float
      frequency: Int
      division: [Float]
      notes: String
      icon: String
      bucket: String
    }
  */
  getRefsKeyedByType(type) {
    const key = `${type}Refs`;
    const refs = this[key];
    let refsKeyedByType = {};
    for (let [person, values] of Object.entries(refs)) {
      for (let {
        id,
        type,
        parentType,
        label,
        value,
        frequency,
        division,
        notes,
        icon,
        bucket,
      } of values) {
        if (refsKeyedByType[type])
          refsKeyedByType[type].push({
            id,
            type,
            parentType,
            label,
            value,
            frequency,
            // division,
            // notes,
            icon,
            bucket,
            person,
          });
        else
          refsKeyedByType[type] = [
            { id, value, frequency, label, type, person },
          ];
      }
    }
    return refsKeyedByType;
  }

  public getAggregateSumKeyedByType(type) {
    const _refsKeyedByType = this.getRefsKeyedByType(type);
    const aggSumsByType = {};

    for (let [key, valuesArray] of Object.entries(_refsKeyedByType)) {
      const itemLabel = valuesArray[0]?.label;
      console.log("XXXXXXXXXXXXXXXXXXX");
      console.log(key, valuesArray);
      console.log(valuesArray);
      console.log(itemLabel);
      aggSumsByType[itemLabel] = valuesArray.reduce(
        (acc, { value, frequency }) =>
          acc + value * DataManager.frequencyToNumberMap(type, frequency),
        0
      );
    }
    const capitalizedType = `${type.slice(0, 1).toUpperCase()}${type.slice(1)}`;
    aggSumsByType["type"] = capitalizedType;
    return aggSumsByType;
  }

  /*
    Get sum for assets, liabilities, incomes and expenses:
  */
  public getAggregateSumForAll() {
    return this.categories.reduce(
      (acc, category) => ({
        ...acc,
        [category]: this.getAggregateSumForSomeCategory(category),
      }),
      {}
    );
  }
  getAggregateSumForSomeCategory(category) {
    let aggSumByCategory = 0;
    const categoryRefs = this[`${category}Refs`];
    for (let [key, valuesArray] of Object.entries(categoryRefs)) {
      aggSumByCategory += valuesArray.reduce(
        (acc, { value, frequency }) =>
          acc + value * DataManager.frequencyToNumberMap(category, frequency),
        0
      );
    }
    return aggSumByCategory;
  }

  setupRefs() {
    const iterableGroups = [
      { group: "children", data: this.children },
      { group: "dependents", data: this.dependents },
      { group: "jointDependents", data: this.jointDependents },
      { group: "partnerDependents", data: this.partnerDependents },
    ].filter(({ group, data }) => data !== undefined);
    this.verifyAndSetupRefs("primary", this.primary);
    this.verifyAndSetupRefs("partner", this.partner);
    this.verifyAndSetupRefs("joint", this.joint, 0, "joint");
    this.verifyAndSetupGroupsRefs(iterableGroups);
  }

  verifyAndSetupRefs(personType, personData, idx = 0, _name = undefined) {
    if (personData) {
      const name = _name || this.getName(personData, personType, idx);
      if (this.verifySinglePersonDataExists(personData["assets"]))
        this.assetsRefs[name] = personData["assets"];
      if (this.verifySinglePersonDataExists(personData["expenses"]))
        this.expensesRefs[name] = personData["expenses"];
      if (this.verifySinglePersonDataExists(personData["incomes"]))
        this.incomesRefs[name] = personData["incomes"];
      if (this.verifySinglePersonDataExists(personData["liabilities"]))
        this.liabilitiesRefs[name] = personData["liabilities"];
    }
  }
  verifyAndSetupGroupsRefs(iterableGroups) {
    for (let { group, data } of iterableGroups) {
      let idx = 0;
      for (let person of data) {
        this.verifyAndSetupRefs(group, person, idx);
        idx = idx + 1;
      }
    }
  }

  getName(person, group = "", idx = 0) {
    return person.firstName !== "" && person.firstName !== undefined
      ? person.firstName
      : `${group}_${idx}`;
  }

  verifySinglePersonDataExists(data) {
    return data && Object.keys(data).length > 0 ? data : undefined;
  }
  verifyGroupDataExists(data) {
    return data && data.length > 0 ? data : undefined;
  }
}

export default DataManager;
