# -*- coding: utf-8 -*-
"""
Created on Sun Aug 29 15:52:40 2021

@author: sean2
"""

# BACKUP THINGS:
"""Evaluate and stringify a javascript expression in node.js, and convert the resulting JSON to a Python object"""   

"""
def evaluate_javascript(s):  
    node = subprocess.Popen(['node', '-'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    stdout, _ = node.communicate(f'console.log(JSON.stringify({s}))'.encode('utf8'))
    return json.loads(stdout.decode('utf8'))

def load_js_files():
    #client_data = pathlib.PureWindowsPath('d:/Projects/finstaplan/dummy_data/client_examples.ts')
    #assumptions = pathlib.PureWindowsPath('d:/Projects/finstaplan/dummy_data/assumptions.ts')
    #philosophies = pathlib.PureWindowsPath('d:/Projects/finstaplan/dummy_data/philosophies.ts')
    #client_data = "./test_data/client_examples.ts"
    #assumptions = "./test_data/assumptions.ts"
    #philosophies = "./test_data/philosophies.ts"
    import os
    _dir = os.path.dirname(__file__)
    client_data = os.path.join(_dir, 'test_data/client_examples.ts')
    assumptions = os.path.join(_dir, 'test_data/assumptions.ts')
    philosophies = os.path.join(_dir, 'test_data/philosophies.ts')
    file_data = []
    for file in [client_data, assumptions, philosophies]:
      with open(file, 'r') as file:
          file_data.append(file.read().replace('\n', ''))
          
    return map(lambda x: evaluate_javascript(x), file_data)
"""

"""
TESTING CODE


# Move calculating expenses to after assets/incomes 
allData = extractDataAndReturnDataFrame(clientData)

assetToTypeMap = buildAssetToTypeMap()


# Expenses/liabilities/assets/incomes:
expenses = allData[allData.category == "expenses"]
liabilities = allData[allData.category == "liabilities"]
assets = allData[allData.category == "assets"]
incomes = allData[allData.category == "incomes"]
hasPartner = clientData["hasPartner"]
client = clientData["primary"]["firstName"]

# reshape assumptions:
assumptions = reshape_assumptions(assumptions)    

# rates:
cpi = assumptions["growthRate"]["CPI"]
#living = assumptions["growthRate"]["livingExpense"]
education = assumptions["growthRate"]["education"]    

portfolioGrowthRate = clientData["riskProfile"]["portfolioRate"] / 100

# Philosophies:    
requirements = pd.DataFrame.from_dict(philosophies["requirements"], orient="columns")
offsets = pd.DataFrame.from_dict(philosophies["offsets"], orient="columns")
steppedVsLevel = pd.DataFrame.from_dict(philosophies["steppedVsLevel"], orient="columns")
#print(requirements[requirements["for"] == "liabilities"].loc[:, [ "life", "tpd", "trauma", "ip"]])

# STEP 0: Get calculated assumptions:
assumptions["calculatedAssumptions"] = calculateAssumptions(clientData, assumptions)

yearsUntilMortality = assumptions["calculatedAssumptions"]["yearsUntilMortalityPartner"]
yearsUntilRetirement = assumptions["calculatedAssumptions"]["yearsUntilRetirementPartner"]

# STEP 1: Get liabilities and lump sum legacies:   
aggLiabilities = getAggLiabilities(liabilities, requirements)
#print(aggLiabilities.to_json())



# assets
assetOffsets, resDf, sumPerYear = getAssetOffsets(assets, assumptions, offsets, yearsUntilMortality, portfolioGrowthRate)
assetSumPerYear = getValuesPerYear(assetOffsets, yearsUntilMortality)  

# incomes 
# All incomes including target of death/tpd/trauma:
allIncomes, _, _ = getIncomes(incomes, assumptions, offsets, yearsUntilMortality, yearsUntilRetirement, "", [])
allIncomesPerYear = getValuesPerYear(allIncomes, yearsUntilMortality)
allIncomesSumNPV = allIncomesPerYear.apply(lambda x: npv(cpi, x), axis=0)

# Incomes after target dies/tpd/traumas:
incomeOffsets, resDf2, sumPerYear2 = getIncomes(incomes, assumptions, offsets, yearsUntilMortality, yearsUntilRetirement, client, ["investmentPropertyIncome", "investmentIncome", "otherInvestmentIncome"])
incomesPerYear = getValuesPerYear(incomeOffsets, yearsUntilMortality)
incomesSumNPV = incomesPerYear.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)
assetAndIncomeSumPerYear = getValuesPerYear(incomeOffsets, yearsUntilMortality, True, assetSumPerYear)
sumOfAssetsAndIncomeOffsets = sumAssetsAndIncomeOffsets(assetOffsets, incomeOffsets, yearsUntilMortality)    

incomesSumNpvPerYear = getNpvPerYearDataFrame(allIncomesPerYear, portfolioGrowthRate)
allIncomesSumNPV = incomesSumNpvPerYear.iloc[0]

#lost income as a result of death: sum npv of life income for both partners
# TODO

# expenses
expensesByYear, resDf3, sumPerYear3 = getExpenses(expenses, assumptions, requirements, yearsUntilMortality, yearsUntilRetirement, client, excluded_expenses=["personalLoanExpense", "creditCardRepaymentsExpense", "residentialMortgageExpense", "investmentPropertyRepaymentExpense", "investmentPropertyUpkeepExpense", "investmentManagedFundExpense", "investmentBondsExpense", "investmentGearingExpense", "otherInvestmentExpense"])


# childExpenses:
numYearsToSupportChildren = assumptions["calculatedAssumptions"]["numYearsToSupportChildren"]  
childExpenses = getChildExpenses(expenses[expenses["class"] == "childExpense"], assumptions, numYearsToSupportChildren)       
childExpensesNPV = getNPVfromSeries(assumptions, childExpenses, portfolioGrowthRate)

totalChildExpenses = sumNPVdict(childExpensesNPV)

sumOfExpenses = sumExpenses(expensesByYear, yearsUntilMortality)
expensesSumNPV = sumOfExpenses.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)
# add child expenses:
sumOfAllExpenses = addChildExpenses(sumOfExpenses, childExpenses, yearsUntilMortality)    

#expensesSumOfAllNPV = sumOfAllExpenses.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)

expensesSumNpvPerYear = getNpvPerYearDataFrame(sumOfAllExpenses, portfolioGrowthRate)
expensesSumOfAllNPV = expensesSumNpvPerYear.iloc[0]


initialReqAssets = getInitialRequirementsByType(assetOffsets, assetToTypeMap)
initialReqIncomes = getInitialRequirementsByType(incomeOffsets, assetToTypeMap)
initialReqLiabilities = aggLiabilities.loc[:, ["life", "tpd", "trauma"]].sum(axis=0)

lifeExpenses = sumOfAllExpenses["life"].to_numpy()
tpdExpenses = sumOfAllExpenses["tpd"].to_numpy()
npvOfExpensesLife = npv(portfolioGrowthRate, lifeExpenses)
npvOfExpensesTpd = npv(portfolioGrowthRate, tpdExpenses)

minimumCoverage = requirements[requirements["type"] == "minimumCoveragePercentOfRequirementsPreOffsets"].loc[:, ["tpd", "trauma", "life"]]
minimumCoverageRequirements = (minimumCoverage * initialReqLiabilities) + (minimumCoverage * expensesSumOfAllNPV)

taxOnLumpSumInsurance = assumptions["taxation"]["taxOnLumpSumPaymentsLife"] / 100
taxOnLumpSumInsuranceTPD = assumptions["taxation"]["taxOnLumpSumPaymentsTPD"] / 100
taxOnLumpSumPaymentsTrauma = assumptions["taxation"]["taxOnLumpSumPaymentsTrauma"] / 100

netAmountRequired = (-1) * (initialReqLiabilities + expensesSumOfAllNPV - incomesSumNPV - assetSumPerYear.iloc[0])
taxPaid = netAmountRequired * np.array([taxOnLumpSumInsurance, taxOnLumpSumInsuranceTPD, taxOnLumpSumPaymentsTrauma])
#taxPaid = netAmountRequired * taxOnLumpSumInsurance
netAmountRequiredAfterTax = netAmountRequired + taxPaid


#fvLiabilities = getFVliabilities(aggLiabilities, 12, 0.02)

aggLiabilitiesPerYear = getFVliabilities(liabilities, requirements, yearsUntilMortality, { "cpi": assumptions["growthRate"]["CPI"], "medicalInflation": assumptions["growthRate"]["medicalInflation"], "realEstateInflation": assumptions["growthRate"]["realEstate"] })
# (assetAndIncomeSumPerYear - initialReqLiabilities - sumOfAllExpenses) * (-1) * (1+taxOnLumpSumInsurance)
#netPerYear = allIncomesPerYear + assetSumPerYear - sumOfAllExpenses - initialReqLiabilities
netPerYear = expensesSumNpvPerYear + aggLiabilitiesPerYear - incomesSumNpvPerYear - assetSumPerYear
netAfterTaxOnInsurance = netPerYear * (1 + taxOnLumpSumInsurance)

# Generate NPVs of expenses every year:
exp_ = list(np.flip(np.asarray(sumOfAllExpenses["life"]),axis=0))
  
exp_2 = np.asarray(sumOfAllExpenses["life"])
res_4 = [npv(portfolioGrowthRate, exp_2[0:i+1]) for i in range(len(exp_2), 0, -1)]

#npv(portfolioGrowthRate*(1-assumptions["calculatedAssumptions"]["taxToBeDeductedFromInvestmentReturns"]))  
actual_ = npv(0.045, [83054, 80635, 78286, 76006, 73792, 71643, 86946, 115975, 111730, 107658, 103750, 100000])
pv_ = [83054, 80635, 78286, 76006, 73792, 71643, 86946, 115975, 111730, 107658, 103750, 100000]
res2_ = [npv(portfolioGrowthRate, pv_[0:i+1]) for i in range(0, len(pv_))]
res3_ = [npv(portfolioGrowthRate, exp_[0:i+1]) for i in range(0, len(exp_))]
res_ = []

final_npv = npv(portfolioGrowthRate, pv_)
final_npv2 = npv(portfolioGrowthRate, exp_)

d_ = []
for i in range(0, len(exp_)):
  print(pv_[i], round(exp_[i]), round(exp_[i]) == pv_[i], i, sumOfAllExpenses["life"][i])
  d_.append(exp_[i])




# Other things
lifeExpensesNpvs = getNpvPerYear(sumOfAllExpenses["life"])#[:,None]
tpdExpensesNpvs = getNpvPerYear(sumOfAllExpenses["tpd"])#[:,None]
traumaExpensesNpvs = getNpvPerYear(sumOfAllExpenses["trauma"])#[:,None]
expensesNpvsDf = pd.DataFrame(np.ones((len(sumOfAllExpenses), 3)), columns=["life", "tpd", "trauma"])
expensesNpvsDf["life"] *= lifeExpensesNpvs
expensesNpvsDf["tpd"] *= tpdExpensesNpvs
expensesNpvsDf["trauma"] *= traumaExpensesNpvs
"""
