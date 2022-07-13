from functools import reduce

import json

import datetime
from dateutil import parser
from dateutil.relativedelta import relativedelta

import numpy as np
import pandas as pd
import sys 
from collections import defaultdict
from itertools import chain 
import logging
#from hello_world.insurance_calc import insurance_calc as test1
#from hello_world.dummy_data import dummy_data as test2
#from dummy_data import philosophies, assumptions, clientData
#from dummy_data2 import assumptions, philosophies, clientData 
#from dummy_data2 import assumptions as backup_assumptions

EXPENSE_PARENT_TYPE_KEY = "parentType"

""" 
Main helpers:
    
"""
def reshape_assumptions(assumptions):
    assumptions_dict = dict()
    for assumption in assumptions:
        if (not assumptions_dict.get(assumption.get("for"))):
            assumptions_dict.update({ assumption.get("for"): dict()})
        
        toUpdate = assumptions_dict.get(assumption.get("for"))
        toUpdate.update({ assumption.get("type"): assumption.get("value") })
    return assumptions_dict 


def addNameToDictionary(dictionary, name):
    dictionary["name"] = name
    return dictionary

def addCategoryToDictionary(dictionary, category):
    dictionary["category"] = category
    return dictionary

def getDataForCategorySingle(data, role, category):
    pData = data[role].get(category, [])
    if (pData == None): return []
    try: 
        return list(map(lambda x: addCategoryToDictionary(x, category), pData))
    except: 
        return []

def getDataForDataFrameSingle(client_data, role, name):
    if (client_data[role] == None): return []
    
    """
    pExpenses = client_data[role].get("expenses", [])
    pExpenses = list(map(lambda x: addCategoryToDictionary(x, "expenses"), pExpenses))
    pLiabilities = client_data[role].get("liabilities", [])
    pLiabilities = list(map(lambda x: addCategoryToDictionary(x, "liabilities"), pLiabilities))
    pAssets = client_data[role].get("assets", [])
    pAssets = list(map(lambda x: addCategoryToDictionary(x, "assets"), pAssets))
    pIncomes = client_data[role].get("incomes",[])
    pIncomes = list(map(lambda x: addCategoryToDictionary(x, "incomes"), pIncomes))
    """
    
    pExpenses = getDataForCategorySingle(client_data, role, "expenses")
    pLiabilities = getDataForCategorySingle(client_data, role, "liabilities")
    pAssets = getDataForCategorySingle(client_data, role, "assets")
    pIncomes = getDataForCategorySingle(client_data, role, "incomes")
    try: 
        pAll = pExpenses + pLiabilities + pAssets + pIncomes
    except:
        pAll = []
        
    if (pAll != None):
        res = list(map(lambda x: addNameToDictionary(x, name), pAll))
        return res
    else:
        return []

def getDataForCategorySingleDependent(personData, category):    
    if (personData == None): return []
    try: 
        return list(map(lambda x: addCategoryToDictionary(x, category), personData))
    except: 
        return []

def getDataForDataFrameSingleDependent(person, name):
    if (person == None): return []    
    pExpenses = getDataForCategorySingleDependent(person, "expenses")
    pLiabilities = getDataForCategorySingleDependent(person, "liabilities")
    pAssets = getDataForCategorySingleDependent(person, "assets")
    pIncomes = getDataForCategorySingleDependent(person, "incomes")
    pAll = pExpenses + pLiabilities + pAssets + pIncomes
        
    if (pAll != None):
        res = list(map(lambda x: addNameToDictionary(x, name), pAll))
        return res
    else:
        return []

def getDataForDependents(client_data, role):        
   data = []
   dependentsList = client_data.get(role, [])
   if dependentsList == None or len(dependentsList) == 0: return []
   
   for idx, person in enumerate(dependentsList, start=1):
       """
       expenses = person.get("expenses", [])
       expenses = list(map(lambda x: addCategoryToDictionary(x, "expenses"), expenses))

       liabilities = person.get("liabilities",[])
       liabilities = list(map(lambda x: addCategoryToDictionary(x, "liabilities"), liabilities))
    
       assets = person.get("assets", [])
       assets = list(map(lambda x: addCategoryToDictionary(x, "assets"), assets))

       incomes = person.get("incomes", [])
       incomes = list(map(lambda x: addCategoryToDictionary(x, "incomes"), incomes))
       """
       name = person.get("firstName", f"dependent_{idx}")
       if (name == None): name = f"dependent_{idx}"
       
       _all = getDataForDataFrameSingleDependent(person, name)       
       
       if _all == None:
           _all = []
           
       data.extend(list(map(lambda x: addNameToDictionary(x, name), _all)))
       
   return data


# TODO: make sure this isnt broken:
"""
temp_assumptions = reshape_assumptions(assumptions)
rates = defaultdict(getDefaultRate, {
    "education": temp_assumptions["growthRate"]["education"] / 100,
    "livingExpense": temp_assumptions["growthRate"]["livingExpense"] / 100,
    "cpi": temp_assumptions["growthRate"]["CPI"] / 100,
    "medicalInflation": temp_assumptions["growthRate"]["medicalInflation"] / 100,
    "realEstate": temp_assumptions["growthRate"]["realEstate"] / 100,
    
    })
"""




def createGetRates(temp_assumptions):
    getDefaultRate = lambda : temp_assumptions["growthRate"]["CPI"]
    rates = defaultdict(getDefaultRate, {
    "education": temp_assumptions["growthRate"]["education"] / 100,
    "livingExpense": temp_assumptions["growthRate"]["livingExpense"] / 100,
    "cpi": temp_assumptions["growthRate"]["CPI"] / 100,
    "medicalInflation": temp_assumptions["growthRate"]["medicalInflation"] / 100,
    "realEstate": temp_assumptions["growthRate"]["realEstate"] / 100 })
        
    def getRate(_type):
        t = _type
        if (str.find(_type, "Education")): t = "education"
        elif (str.find(_type, "Living")): t = "livingExpense"
        #elif (str.find(_type, "Living")): t = "livingExpense"
        return rates[t]     

    return getRate
    
def npv_old(rate, values):
    values = np.asarray(values)
    return (values / (1+rate)**np.arange(0, len(values))).sum(axis=0)

def npv(rate, values):
    values = np.asarray(values)
    #_range = np.array(np.arange(1, len(values)))
    #_range = np.append(_range, [1])

    _range = np.array(np.arange(len(values+1), 0, -1))
    
    return (values / (1+rate)**_range).sum(axis=0)


def getNpvPerYear(values, _portfolioGrowthRate):
    values = np.flip(np.asarray(values), axis=0)
    return np.flip(np.asarray([npv(_portfolioGrowthRate, values[0:i+1]) for i in range(0, len(values))]), axis=0)

def getNpvPerYearDataFrame(df, portfolioGrowthRate):
    # Reverse the df: 
    #df = df.iloc[::-1].copy()
    
    # getNpvPerYear function reverses a column for you:
    lifeNpvs = getNpvPerYear(df["life"], portfolioGrowthRate)#[:,None]
    tpdNpvs = getNpvPerYear(df["tpd"], portfolioGrowthRate)#[:,None]
    traumaNpvs = getNpvPerYear(df["trauma"], portfolioGrowthRate)#[:,None]
    npvsDf = pd.DataFrame(np.ones((len(df), 3)), columns=["life", "tpd", "trauma"])
    npvsDf["life"] *= lifeNpvs
    npvsDf["tpd"] *= tpdNpvs
    npvsDf["trauma"] *= traumaNpvs    
    return npvsDf


# def getNpvsForDict(dict_, portfolioGrowthRate):
#     res = dict()
#     for k,v in dict_.items():
#         res[k] = getNpvPerYearDataFrame(v, portfolioGrowthRate)
#     return res

def getNpvsForDict(dict_, portfolioGrowthRate):
    if len(dict_) == 0: return {}    
    return { k: getNpvPerYearDataFrame(v, portfolioGrowthRate) for k,v in dict_.items()}


        
def getNPVfromSeries(assumptions, series, rate=None, _type="", get_rate=None):
    if (get_rate==None): get_rate=createGetRates(assumptions)
    
    if (type(series) == dict):
        npvs = []           
        for k, v in series.items():
            if not rate: rate = get_rate(k)
            _npv = getNPVfromSeries(assumptions, v, rate, k, get_rate)
            newVal = dict()
            newVal[k] = _npv
            npvs.append(newVal)
        return npvs
            
    elif (type(series) == list):
        if not rate: rate = get_rate(_type)
        return npv(rate, series)
    
    elif (type(series) == pd.core.frame.DataFrame):
        if not rate: rate = get_rate(_type)
        _npv = series.apply(lambda x: npv(rate, x), axis=0)
        return _npv
    
    
def sumNPVdict(npvs):
    if (type(npvs) == dict):
        _sum = 0       
        for k, v in npvs.items():
            if type(v) == dict:       
                _sum += sumNPVdict(v)
            elif (type(v) == list):
                _sum += sumNPVdict(v)
            elif type(v) == float:   
                _sum += v
            elif (type(v) == pd.core.frame.DataFrame):            
                _sum = npvs.apply(np.sum, axis=0)          
            else:
                _sum += float(v)
        return _sum
    
    elif (type(npvs) == list):      
        _sum = 0
        for v in npvs:
            _sum += sumNPVdict(v)
        return _sum
          
    elif (type(npvs) == pd.core.frame.DataFrame):            
        _sum = npvs.apply(np.sum, axis=0)
        return _sum
    

def extractDataAndReturnDataFrame(client_data):  
    primaryData = getDataForDataFrameSingle(client_data, "primary", client_data["primary"].get("firstName", "primary"))
    print("--- STEP 1.1 ---")
    partnerData = []
    childrenData = []
    dependentsData = []
    jointDependentsData = []
    partnerDependentsData = [] 
    jointData = getDataForDataFrameSingle(client_data, "joint", "joint")
    print("--- STEP 1.2 ---")
    
    if client_data["hasPartner"]:        
        partnerData = getDataForDataFrameSingle(client_data, "partner", client_data["partner"].get("firstName", "partner"))
        print("--- STEP 1.3 ---")

        
    if client_data["hasChildren"]:
        childrenData = getDataForDependents(client_data, "children")   
        print("--- STEP 1.4 ---")

        
    if client_data["hasDependents"]:
        dependentsData = getDataForDependents(client_data, "dependents")
        print("--- STEP 1.5 ---")

        
    if client_data["hasJointDependents"]:
        jointDependentsData = getDataForDependents(client_data, "jointDependents")
        print("--- STEP 1.6 ---")

        
    if client_data["hasPartnerDependents"]:
        partnerDependentsData = getDataForDependents(client_data, "partnerDependents")
        print("--- STEP 1.7 ---")

    
    allData = []
    for _list in [primaryData, partnerData, jointData, childrenData, dependentsData, jointDependentsData, partnerDependentsData]:
      allData.extend(_list)

    print("--- STEP 1.8 ---")

    #return pd.DataFrame.from_records(allData)          
    return pd.DataFrame.from_dict(allData, orient='columns')

def sumDataFrameList(dfList):
    _sum = pd.DataFrame([0, 0], index=["life", "tpd"])
    for item in dfList:
        for k, v in item.items(): 
            _sum = _sum.add(v, axis="index")
    return _sum    




def getNPV(P, r, g, n):
  lhs = P / (r - g);
  inflation = 1 + g;
  growth = 1 + r;
  return lhs * (1 - (inflation / growth)**n)

from functools import reduce


def getNPVoverArray(rate, initialCost, cashFlows): 
    index = -1
    fn = lambda acc, curr: acc + curr / (rate / 100 + 1)**(index + 1)
    return reduce(fn, cashFlows)



"""
// STEP 0: calculate assumptions:
    # TODO: ensure correctness of starting from year 0 vs. starting from year 1
"""
def parseDate(date_string):
  if (date_string == None):
      return datetime.datetime.now()
      
  return parser.parse(date_string).replace(tzinfo=None)
  #import datetime 
  #matcher = "%a %b %d %Y"
  #return datetime.datetime.strptime(date_string, matcher)
                
def getAge(birth_date, from_date=None):  
  print("--- in getAge ---")
  print(birth_date)
  print(from_date)
  
  if from_date is None:
    from_date = datetime.datetime.now()
  try: 
      return (from_date - relativedelta(years=birth_date.year, months=birth_date.month, days=birth_date.day)).year  
  except: 
      try: 
          return (from_date - relativedelta(months=birth_date.month, days=birth_date.day)).year
      except: 
          return (from_date - relativedelta(days=birth_date.day)).year
              
  
    
  
def getTaxToBeDeductedFromInvestmentReturns(taxOnIncomeGrowth, investmentReturnsIncome, taxOnFutureCapitalGrowth, investmentReturnsExpense):
  return taxOnIncomeGrowth * investmentReturnsIncome + taxOnFutureCapitalGrowth * investmentReturnsExpense

def getNumYearsToSupportChildrenArray(clientData, numYearsToSupportChildren):  
  children = clientData["children"]
  return list(map(lambda child:
      (child.get("firstName") or "Unnamed Child", 
       numYearsToSupportChildren - getAge(parseDate(child["dateOfBirth"])) + 1), 
       children))

def calculateAssumptions(clientData, assumptions):
  try:
      clientAge = getAge(parseDate(clientData["primary"]["dateOfBirth"]))
  except: 
      raise BaseException("Client Date of Birth is Required")
  
  taxToBeDeductedFromInvestmentReturns = getTaxToBeDeductedFromInvestmentReturns(
      assumptions["taxation"]["taxOnIncomeGrowth"] / 100,
      assumptions["investmentReturns"]["income"] / 100,
      assumptions["taxation"]["taxOnFutureCapitalGrowth"] / 100,
      assumptions["investmentReturns"]["expenses"] / 100
    )

  yearsUntilRetirementForYoungestPartner = assumptions["other"]["retirementAge"] - clientAge + 1
  yearsUntilMortalityPrimary = assumptions["other"]["mortalityAge"] - clientAge + 1
  yearsUntilRetirementPrimary = assumptions["other"]["retirementAge"] - clientAge + 1
  calculatedAssumptionsDict = {
      "clientAge": clientAge,
      "taxToBeDeductedFromInvestmentReturns": taxToBeDeductedFromInvestmentReturns,
      "yearsUntilRetirementForYoungestPartner": yearsUntilRetirementForYoungestPartner,
      "yearsUntilMortalityForYoungestPartner": yearsUntilMortalityPrimary,
      "yearsUntilRetirement": yearsUntilRetirementForYoungestPartner,
      "yearsUntilMortalityPrimary": yearsUntilMortalityPrimary,
      "yearsUntilRetirementPrimary": yearsUntilRetirementPrimary
  }
  
 
  if (clientData["hasChildren"]):
    calculatedAssumptionsDict["numYearsToSupportChildren"] = getNumYearsToSupportChildrenArray(
        clientData,
        assumptions["other"]["maximumAgeToFundChildren"] 
      )
  
  
  if (clientData["hasPartner"]):
    try: 
        partnerAge = getAge(parseDate(clientData["partner"]["dateOfBirth"]))
    except: 
        raise BaseException("Partner Date of Birth is Required")

    min_age = min([partnerAge, clientAge]) 
    calculatedAssumptionsDict["partnerAge"] = partnerAge
    calculatedAssumptionsDict["yearsUntilRetirementForYoungestPartner"] = assumptions["other"]["retirementAge"] - min_age + 1
    calculatedAssumptionsDict["yearsUntilMortalityForYoungestPartner"] = assumptions["other"]["mortalityAge"] - min_age + 1
    calculatedAssumptionsDict["yearsUntilRetirementPartner"] = assumptions["other"]["retirementAge"] - partnerAge + 1
    calculatedAssumptionsDict["yearsUntilMortalityPartner"] = assumptions["other"]["mortalityAge"] - partnerAge + 1   


  return calculatedAssumptionsDict 


    
   
"""
// STEP 1: Find all liabilities (AND CAPITAL REQUIREMENTS TO COVER THEM)
//       : Joint, and for both partners
// - add medicalRequirements, changeOfHousingCar ((24-25 philosophies table)) in event of TPD or Trauma
// - from philosophies - **Rows 10-16**: (advisor sets how much of different liability classes they want to repay in the event of
//         - Life   (Death)
//         - TPD    (Disability)
//         - Trauma (Bad injury, stroke, heart-attack -- out of work for a period, will recover)
// - NOTE: liabilities.type has a direct correlation to philosophies.requirements.type
"""
def getAggLiabilities(liabilities, requirements):
  resultsDf = pd.DataFrame(columns=["life", "tpd", "trauma", "ip", "name", "type"])
  
  medExpenses = requirements[requirements["type"] == "medicalRequirements"].loc[:, [ "life", "tpd", "trauma", "ip"]].copy()
  medExpenses["name"] = "medicalExpenses"
  medExpenses["type"] = "medicalExpenses"
  resultsDf = resultsDf.append(medExpenses)
          
  housingCarExpenses = requirements[requirements.type == "changeOfHousingCar"].loc[:, [ "life", "tpd", "trauma", "ip"]].copy()
  housingCarExpenses["name"] = "changeHousingOrCar"
  housingCarExpenses["type"] = "changeHousingOrCar"
  resultsDf = resultsDf.append(housingCarExpenses)
  
  for liability in liabilities.itertuples(index=False):    
    requirements_row = requirements[requirements.type == liability.type].loc[:, [ "life", "tpd", "trauma", "ip"]]
    if (len(requirements_row) == 0):       
        newRow = pd.DataFrame([[liability.value, liability.value, liability.value, liability.value, None, None]], columns=["life", "tpd", "trauma", "ip", "name", "type"])
    else: 
        newRow = liability.value * requirements_row
        
    newRow["name"] = liability.name
    newRow["type"] = liability.type
    resultsDf = resultsDf.append(newRow)
      
  return resultsDf.reset_index()

"""
#Aggregator functions:
resultsDf.apply(np.sum, axis=0)
resultsDf["life"].sum()
resultsDf.agg({ "life": "sum", "tpd": "sum", "trauma": "sum", "ip": "sum"})
"""


"""
FV
"""
_when_to_num = {'end': 0, 'begin': 1,
                'e': 0, 'b': 1,
                0: 0, 1: 1,
                'beginning': 1,
                'start': 1,
                'finish': 0}

def _convert_when(when):
    # Test to see if when has already been converted to ndarray
    # This will happen if one function calls another, for example ppmt
    if isinstance(when, np.ndarray):
        return when
    try:
        return _when_to_num[when]
    except (KeyError, TypeError):
        return [_when_to_num[x] for x in when]


def fv(rate, nper, pmt, pv, when='end'):
    """
    Compute the future value.
    Given:
     * a present value, `pv`
     * an interest `rate` compounded once per period, of which
       there are
     * `nper` total
     * a (fixed) payment, `pmt`, paid either
     * at the beginning (`when` = {'begin', 1}) or the end
       (`when` = {'end', 0}) of each period
    Return:
       the value at the end of the `nper` periods
    Parameters
    ----------
    rate : scalar or array_like of shape(M, )
        Rate of interest as decimal (not per cent) per period
    nper : scalar or array_like of shape(M, )
        Number of compounding periods
    pmt : scalar or array_like of shape(M, )
        Payment
    pv : scalar or array_like of shape(M, )
        Present value
    when : {{'begin', 1}, {'end', 0}}, {string, int}, optional
        When payments are due ('begin' (1) or 'end' (0)).
        Defaults to {'end', 0}.
    Returns
    -------
    out : ndarray
        Future values.  If all input is scalar, returns a scalar float.  If
        any input is array_like, returns future values for each input element.
        If multiple inputs are array_like, they all must have the same shape.
    Notes
    -----
    The future value is computed by solving the equation::
     fv +
     pv*(1+rate)**nper +
     pmt*(1 + rate*when)/rate*((1 + rate)**nper - 1) == 0
    or, when ``rate == 0``::
     fv + pv + pmt * nper == 0
    References
    ----------
    .. [WRW] Wheeler, D. A., E. Rathke, and R. Weir (Eds.) (2009, May).
       Open Document Format for Office Applications (OpenDocument)v1.2,
       Part 2: Recalculated Formula (OpenFormula) Format - Annotated Version,
       Pre-Draft 12. Organization for the Advancement of Structured Information
       Standards (OASIS). Billerica, MA, USA. [ODT Document].
       Available:
       http://www.oasis-open.org/committees/documents.php?wg_abbrev=office-formula
       OpenDocument-formula-20090508.odt
    Examples
    --------
    >>> import numpy as np
    >>> import numpy_financial as npf
    What is the future value after 10 years of saving $100 now, with
    an additional monthly savings of $100.  Assume the interest rate is
    5% (annually) compounded monthly?
    >>> npf.fv(0.05/12, 10*12, -100, -100)
    15692.928894335748
    By convention, the negative sign represents cash flow out (i.e. money not
    available today).  Thus, saving $100 a month at 5% annual interest leads
    to $15,692.93 available to spend in 10 years.
    If any input is array_like, returns an array of equal shape.  Let's
    compare different interest rates from the example above.
    >>> a = np.array((0.05, 0.06, 0.07))/12
    >>> npf.fv(a, 10*12, -100, -100)
    array([ 15692.92889434,  16569.87435405,  17509.44688102]) # may vary
    """
    when = _convert_when(when)
    rate, nper, pmt, pv, when = np.broadcast_arrays(rate, nper, pmt, pv, when)

    fv_array = np.empty_like(rate)
    zero = rate == 0
    nonzero = ~zero

    fv_array[zero] = -(pv[zero] + pmt[zero] * nper[zero])

    rate_nonzero = rate[nonzero]
    temp = (1 + rate_nonzero)**nper[nonzero]
    fv_array[nonzero] = (
        - pv[nonzero] * temp
        - pmt[nonzero] * (1 + rate_nonzero * when[nonzero]) / rate_nonzero
        * (temp - 1)
    )

    if np.ndim(fv_array) == 0:
        # Follow the ufunc convention of returning scalars for scalar
        # and 0d array inputs.
        return fv_array.item(0)
    return fv_array




"""
// STEP 3: Find what assets & incomes are available to offset against liabilities and expenses from STEP 1-2
// - assets => lump sum -->
//   - USING Philosophies OFFSETS to reduce value of corresponding assets.
//     - ((Philosophies row 39-48))
//   - assumption is that assets are sold to cover liabilities and expenses on event of TPD/Life
// - incomes => reduce income expectation based on event (reduced for living spouse by
//   ((philosophies row 50))).
//   - For calculating NPV: formula is affected by portfolio choice re rate of growth

#INCOMES:
Cecile income: 247,000
       Maxxia:   9,010

Tjaart income:  91,636 
rental income:  38,181


# ASSETS:
Cecile bonds:   21,450
       bonds:   90,000
     pension:  136,142
invest prprty: 225,000

Tjaart bonds:    7,017
       bonds:  124,510      
"""

# FORMAT: 
"""
Art: 
Investment Property 
Depreciating assets (boat, car, ...)
(Non-Cash investments): 
    
"""
def prev_curr(iterable, rate):
    """Make an iterator that yields an (previous, current, next) tuple per element.

    Returns None if the value does not make sense (i.e. previous before
    first and next after last).
    """
    iterable = iter(iterable)
    prv = None
    cur = iterable.__next__()
    try:
        while True:  
            prv = cur
            cur = prv * (1+rate)
            yield cur
            
    except StopIteration:
        yield cur

def buildAssetToTypeMap():
    cash = ["bankAccount", "termDeposits", "otherCash", "offsetAccount", "cash"]    
    # what do with these?? 
    personalProperty = ["jewellery", "clothing", "householdContents", "otherPersonalProperty"]
    depreciatingAssets = ["motorVehicle", "otherVehicle", ]  
    
    art = ["artOrAntique"]
    pension = ["super", "accountBasedPension"]
    investmentProperty = ["investmentProperty", "otherRealEstate", "holidayHome"]
    nonCashInvestments = ["bonds", "fixedInterestInvestment", "shares", "debtsOwed", "managedInvestments", "marginLoan"]

    livingPartnerIncome = []
    
    # TODO: WHAT ARE THESE? offset accounts? income protector? 
    income = ["salaryIncome", "bonusIncome", "commissionIncome"]    
    otherIncome = ["pension", "rentalIncome", "otherIncome", "investmentPropertyIncome", "investmentIncome", "otherInvestmentIncome"]
    otherLumpSums = []
    incomeProtector = []
    offsetAccounts = ["offsetAccount"]
    
    d = dict.fromkeys(art, "art")
    d.update(dict.fromkeys(["familyHome"], "familyHome"))
    d.update(dict.fromkeys(investmentProperty, "investmentProperty"))
    d.update(dict.fromkeys(cash, "cash"))
    d.update(dict.fromkeys(nonCashInvestments, "investmentsNonCash"))
    d.update(dict.fromkeys(pension, "pension"))
    #d.update(dict.fromkeys(livingPartnerIncome, ""))
    d.update(dict.fromkeys(incomeProtector, "incomeProtector"))
    d.update(dict.fromkeys(income, "income"))
    d.update(dict.fromkeys(otherIncome, "otherIncome"))
    d.update(dict.fromkeys(otherLumpSums, "otherLumpSums"))
    d.update(dict.fromkeys(offsetAccounts, "offsetAccounts"))
    return d   

def buildAssetToKeyMap(offsets):
    cash = ["bankAccount", "termDeposits", "otherCash", "cash"]
    
    # what do with these?? 
    personalProperty = ["jewellery", "clothing", "householdContents", "otherPersonalProperty"]
    depreciatingAssets = ["motorVehicle", "otherVehicle", ] 
    
    art = ["artOrAntique"]
    pension = ["super", "accountBasedPension"]
    investmentProperty = ["investmentProperty", "otherRealEstate", "holidayHome"]
    nonCashInvestments = ["bonds", "fixedInterestInvestment", "shares", "debtsOwed", "managedInvestments", "marginLoan"]

    livingPartnerIncome = []
    
    # TODO: WHAT ARE THESE? offset accounts? income protector? 
    income = ["salaryIncome", "bonusIncome", "commissionIncome"]    
    otherIncome = ["pension", "rentalIncome", "otherIncome", "investmentPropertyIncome", "investmentIncome", "otherInvestmentIncome"]
    otherLumpSums = []
    incomeProtector = []
    offsetAccounts = ["offsetAccount"]

    
    
    my_dict = dict.fromkeys(art, offsets[offsets["type"] == "artOrAntique"])
    my_dict.update(dict.fromkeys(["familyHome"], pd.DataFrame(data=[["offsets", "familyHome", 0, 0, 0, False, "assets"]], columns=[["category", "type", "life", "tpd", "trauma", "ip", "for"]])))
    my_dict.update(dict.fromkeys(["noReduction"],  pd.DataFrame(data=[["offsets", "noReduction", 1, 1, 1, False, "income"]], columns=[["category", "type", "life", "tpd", "trauma", "ip", "for"]])))
    my_dict.update(dict.fromkeys(["isSufferer"],  pd.DataFrame(data=[["offsets", "isSufferer", 0, 0, 1, False, "income"]], columns=[["category", "type", "life", "tpd", "trauma", "ip", "for"]])))
    my_dict.update(dict.fromkeys(investmentProperty, offsets[offsets["type"] == "investmentProperty"]))

    my_dict.update(dict.fromkeys(cash, offsets[offsets["type"] == "cash"]))
    my_dict.update(dict.fromkeys(nonCashInvestments, offsets[offsets["type"] == "nonCashInvestments"]))
    my_dict.update(dict.fromkeys(pension, offsets[offsets["type"] == "superAndPension"]))
    my_dict.update(dict.fromkeys(livingPartnerIncome, offsets[offsets["type"] == "livingPartnerIncome"]))
    my_dict.update(dict.fromkeys(incomeProtector, offsets[offsets["type"] == "incomeProtector"]))
    my_dict.update(dict.fromkeys(income, offsets[offsets["type"] == "livingPartnerIncome"]))
    my_dict.update(dict.fromkeys(otherIncome, offsets[offsets["type"] == "otherIncome"]))
    my_dict.update(dict.fromkeys(otherLumpSums, offsets[offsets["type"] == "otherLumpSums"]))
    my_dict.update(dict.fromkeys(offsetAccounts, offsets[offsets["type"] == "offsetAccounts"]))
    return my_dict

personalIncomeMap = dict.fromkeys(["salaryIncome", "personalIncome", "bonusIncome","commissionIncome"], "personalIncome")




def getAssetOffsets(assets, assumptions, offsets, yearsUntilMortality, portfolioGrowthRate):
    taxToBeDeductedFromInvestmentReturns = 1 - assumptions["calculatedAssumptions"]["taxToBeDeductedFromInvestmentReturns"]
    assetToOffsetMap = buildAssetToKeyMap(offsets)  
    res = [] 
    assetOffsets = dict()
    
    for asset in assets.itertuples(index=False):        
        #portfolioGrowthRate * taxToBeDeductedFromInvestmentReturns
        iterable = (fv(portfolioGrowthRate, i, 0, asset.value)*-1 
                    for i in range(yearsUntilMortality))
        
        #iterable = (fv(clientData["portfolio"]["rate"], i, 0, asset.value)*-1 
        #    for i in range(yearsUntilMortality))

        newRow = np.fromiter(iterable, float)
        res.append(newRow) 
        newDf = pd.DataFrame(np.ones((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
        newDf = newDf.multiply(np.asarray(assetToOffsetMap[asset.type].loc[:,["life", "tpd", "trauma"]])).multiply(newRow.T, axis="rows")    
        assetOffsets[asset.type + "_" + str(asset.value)] = newDf
        
    resDf = pd.DataFrame(res)
    sumPerYear = resDf.sum(axis=0)
    return [assetOffsets, resDf, sumPerYear]


def getIncomes(incomes, assumptions, offsets, yearsUntilMortality, yearsUntilRetirement, affected, excluded_incomes=[], portfolioGrowthRate=0.035, apply_reduction=True, is_sufferer=False):       
    incomes = incomes[incomes["name"] != affected]
    assetToOffsetMap = buildAssetToKeyMap(offsets)
    res2 = []
    incomeOffsets = dict()
    willRetire = yearsUntilRetirement
    cpi = assumptions["growthRate"]["CPI"] / 100
    
    for income in incomes.itertuples(index=False):
        if income.type in excluded_incomes: continue 
    
        newRow = np.zeros(yearsUntilMortality)
        if (personalIncomeMap.get(income.type)):
            for i in range(yearsUntilMortality):
                if i == 0:
                    newRow[i] = income.value 
                else:
                    newRow[i] = (newRow[i-1] * (1+cpi)) if i < willRetire else 0
             #iterable = prev_curr((income.value * (1 + cpi) for i in range(willRetire)), cpi)
             #iterable = chain(iterable, (0 for i in range(yearsUntilMortality-willRetire)))
        else:
             #iterable = prev_curr((income.value * (1 + cpi) for i in range(yearsUntilMortality)), cpi)
             for i in range(yearsUntilMortality):
               if i == 0:
                   newRow[i] = income.value 
               else:
                   newRow[i] = newRow[i-1] * (1+cpi)
        
        res2.append(newRow) 
        newDf = pd.DataFrame(np.ones((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
        
        if apply_reduction:
            newDf = newDf.multiply(np.asarray(assetToOffsetMap[income.type].loc[:,["life", "tpd", "trauma"]])).multiply(newRow.T, axis="rows")
        elif is_sufferer:
            newDf = newDf.multiply(np.asarray(assetToOffsetMap["isSufferer"].loc[:,["life", "tpd", "trauma"]])).multiply(newRow.T, axis="rows")
        else:
            newDf = newDf.multiply(np.asarray(assetToOffsetMap["noReduction"].loc[:,["life", "tpd", "trauma"]])).multiply(newRow.T, axis="rows")
            
        incomeOffsets[income.type + "_" + str(income.value)] = newDf
    
    resDf = pd.DataFrame(res2) 
    sumPerYearIncome = resDf.sum(axis=0)
    return [incomeOffsets, resDf, sumPerYearIncome]


def sumAssetsAndIncomeOffsets(assetOffsets, incomeOffsets, yearsUntilMortality):
    sumDf = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
    for k,v in assetOffsets.items():
        sumDf = sumDf.add(v, axis=1)
        
    for k,v in incomeOffsets.items():
        sumDf = sumDf.add(v, axis=1)
        
    return sumDf
    
def sumExpenses(expenses, yearsUntilMortality):
    sumDf = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
    for k,v in expenses.items():
        sumDf = sumDf.add(v, axis=1)      
    return sumDf    

def addChildExpenses(expenses, childExpenses, mortalityAge):
    newExpenses = expenses
    for child, expense in childExpenses.items():
        for expenseName, _expense in expense.items():
            expenseRow = np.concatenate((np.asarray(_expense), np.zeros(mortalityAge - len(_expense))))
            newExpenses = newExpenses.add(expenseRow, axis=0)
    return newExpenses

"""
// STEP 2: Find all expenses for family -- which expenses stay and which go away when who dies...
// - EXPENSES create INCOME REQUIREMENTS: See income requirements tab on excel
//   - one set of income requirements for TPD/Life/Trauma
//   - From philosophies - **Rows 18-21**
//   - NOTE: ADD extraHelpRequired ((philosophies row 21)) to expenses in event of TPD.
// - e.g. $100,000 expenses pre-death, 100,000 * (1 - livingExpensesInDeath) ((from ASSUMPTION row 16))
//      => 75,000 UNTIL AGE OF RETIREMENT
//   => 75,000 * (1 - LivingExpenseInRetirement ((from ASSUMPTION row 17)))
//   - what capital amount is required to generate 75,000 a year for (a, x, y, ...) years.
//   - mortalityAge - livingPartners age for rest of expenses.
//   - x,y,z,...: variables for  number of children, FROM ASSUMPTION: MaximumAgeToFund
//     ChildrensEducation - children age (forall children).
// - Rental is an expense: if renting, increase rent cost by CPI
// - TODO: KEY POINT:
//   - Sum all expenses for every year until mortality age, then calculate NPV from now for all expenses forever.
//     n is based on num year till death, decreasing n-1 forall years from 0.
"""

"""
TPD and Life insurance go until death
- for Life you calculate lump sum legacies and treat them as liabilities (legacies can be % of estate after exp/liabilities are paid -- or lump sum)
IP goes until retirement 
Trauma is just an initial cost
"""

def getAggExpenses(expenses, requirements, assumptions, clientData):
    if (clientData["hasChildren"]): 
        childExpenses = getChildExpenses(expenses[expenses[EXPENSE_PARENT_TYPE_KEY] == "childExpense"], assumptions, assumptions["calculatedAssumptions"]["numYearsToSupportChildren"])
        
    client = clientData["primary"]["firstName"]    
    yearsUntilMortalityPrimary = assumptions["calculatedAssumptions"]["yearsUntilMortalityPrimary"]
    yearsUntilRetirementForYoungestPartner =  assumptions["calculatedAssumptions"]["yearsUntilRetirementForYoungestPartner"]
    otherExpenses = expenses[expenses[EXPENSE_PARENT_TYPE_KEY] != "childExpense"]
    partner = None 

    # Client insurance calc: client dies/suffers TPD/suffers trauma:     
    if (clientData["hasPartner"]):
        yearsUntilMortalityPartner = assumptions["calculatedAssumptions"]["yearsUntilMortalityPartner"]
        partner = clientData.get("partner").get("firstName") or "Unnamed Partner"
        clientExpenses = otherExpenses[otherExpenses["name"] == client].copy()
        partnerExpenses = otherExpenses[otherExpenses["name"] == partner].copy()
        #jointExpenses = otherExpenses[otherExpenses["name"] == "joint"].copy()
        
        #  Client insurance calc:
        client = getExpenses(clientExpenses, otherExpenses[otherExpenses["name"] != client], assumptions, requirements, yearsUntilMortalityPartner, yearsUntilRetirementForYoungestPartner)           
        
        # Partner insurance calc: if partner dies/suffers TPD/suffers trauma:
        partner = getExpenses(partnerExpenses,  otherExpenses[otherExpenses["name"] != client], assumptions, requirements, yearsUntilMortalityPrimary, yearsUntilRetirementForYoungestPartner)       
    
    elif(not clientData["hasPartner"]): 
        client = getExpenses(clientExpenses, otherExpenses[otherExpenses["name"] != client], assumptions, requirements, yearsUntilMortalityPrimary, yearsUntilRetirementForYoungestPartner)

    
    return {
        "childExpenses": childExpenses,
        "client": client,
        "partner": partner
        }
    
    
def mapExpenseToGrowthRate(growthRateDict, relevantRequirements): 
    cpi = growthRateDict["cpi"]
    education = growthRateDict["education"]
    #livingExpense = growthRateDict["livingExpense"]
    medicalInflation = growthRateDict["medicalInflation"]
    
    # TODO:
    realEstateInflation = growthRateDict["realEstateInflation"]
    
    def defaultGrowthRate(): 
        return (1 + cpi) * relevantRequirements[relevantRequirements["type"] == "other"],
    
    expenseToGrowthRateMap = defaultdict(defaultGrowthRate, {
        "studyingProfessionalExpense": (1 + education) * relevantRequirements[relevantRequirements["type"] == "other"].loc[:, [ "life", "tpd"]],
        "livingExpense": (1 + cpi) * relevantRequirements[relevantRequirements["type"] == "livingExpense"].loc[:, [ "life", "tpd"]],
        "rentExpense": (1  + cpi) * relevantRequirements[relevantRequirements["type"] == "rentExpense"].loc[:, [ "life", "tpd"]],
        "medicalExpense": (1 + medicalInflation),
        "target": (1 + cpi) * relevantRequirements[relevantRequirements["type"] == "target"].loc[:, [ "life", "tpd"]],
        "currentYear": relevantRequirements[relevantRequirements["type"] == "other"].loc[:, [ "life", "tpd"]]
        }) 
    return expenseToGrowthRateMap

def mapExpenseToGrowthRateFlat(growthRateDict, relevantRequirements):  
    cpi = growthRateDict["cpi"]
    education = growthRateDict["education"]
    #livingExpense = growthRateDict["livingExpense"]
    medicalInflation = growthRateDict["medicalInflation"]
    
    # TODO:
    realEstateInflation = growthRateDict["realEstateInflation"]
    
    basic = 1 + cpi
    education = 1 + education
    #living = 1 + livingExpense + cpi
    medical = 1 + medicalInflation
    property_ = 1 + realEstateInflation
    
    
    def defaultGrowthRate(): 
        return basic 
    
    expenseToGrowthRateMap = defaultdict(defaultGrowthRate, {
        "studyingProfessionalExpense": education,
        "livingExpense": basic,
        "rentExpense": basic,
        "medicalExpense": medical,
        "target": basic,        
        }) 
    return expenseToGrowthRateMap

def getGrowthRate(expenseType, expenseToGrowthRateMap):
    if (str.find(expenseType, "LivingExpense") != -1):
        return expenseToGrowthRateMap["livingExpense"]
    elif (str.find(expenseType, "medical") != -1):
        return expenseToGrowthRateMap["medicalExpense"]
    else: 
        return expenseToGrowthRateMap[expenseType]
        
  
 
  
def buildExpenseToKeyMap(requirements):   
    familyLivingExpenses = ["ratesAndTaxesExpense", "homeMaintenanceAndRenovationsExpense", "homeServicesExpense", "homeEntertainmentExpense", "homeUtilitiesExpense", "generalLivingExpenses", "groceriesExpense", "clothesExpense", "householdItemsExpense", "laundryExpense", "donationsAndGiftsExpense", "birthdaysExpense", "otherLivingExpense", "hairCareExpense", "beautyExpense", "otherPersonalCareExpense", ]
    childEducation = ["childEducationExpense"]
    rent = ["rentExpense"] 
    
    def defaultExpenseReduction():
        return requirements[requirements["type"] == "livingExpense"]
    
    my_dict = dict.fromkeys(familyLivingExpenses, requirements[requirements["type"] == "livingExpense"])
    my_dict.update(dict.fromkeys(childEducation, requirements[requirements["type"] == "childEducationExpense"]))
    my_dict.update(dict.fromkeys(rent, requirements[requirements["type"] == "rentExpense"]))
    return defaultdict(defaultExpenseReduction, my_dict)


def getRelevantRequirements(requirements, assumptions):
    relevantRequirements = pd.DataFrame(columns=["life", "tpd", "type"])
    
    growthRateDict = {
        "cpi": assumptions["growthRate"]["CPI"] / 100,
        "education": assumptions["growthRate"]["education"] / 100,
        #"livingExpense": assumptions["growthRate"]["CPI"] / 100,
        "medicalInflation": assumptions["growthRate"]["medicalInflation"] / 100,
        "realEstateInflation": assumptions["growthRate"]["realEstate"] / 100
        }
    
    #cpi = assumptions["growthRate"]["CPI"] / 100
    #education = assumptions["growthRate"]["education"] / 100
    #livingExpense = assumptions["growthRate"]["livingExpense"] / 100
    #medicalInflation = assumptions["growthRate"]["medicalInflation"] / 100
    #realEstateInflation = assumptions["growthRate"]["realEstate"] / 100
    
    for key in filter(lambda s: str.find(s, "Expense") != -1, requirements["type"].values):
         newRow = requirements[requirements["type"] == key].copy()
         relevantRequirements = relevantRequirements.append(newRow)
         
    relevantRequirements.replace(False, 1, inplace=True)
    relevantRequirements = relevantRequirements.append({"type": "other", "tpd": 1, "life": 1, "category": "requirements", "for": "expenses"}, ignore_index=True)
    relevantRequirements = relevantRequirements.append({"type": "target", "tpd": 0.75, "life": 0, "category": "requirements", "for": "expenses"}, ignore_index=True)    
    expenseToGrowthRateMap = mapExpenseToGrowthRate(growthRateDict, relevantRequirements)
    expenseToGrowthRateFlat = mapExpenseToGrowthRateFlat(growthRateDict, relevantRequirements)
    return [expenseToGrowthRateMap, expenseToGrowthRateFlat]

def getExpenses(expenses, assumptions, requirements, yearsUntilMortality, yearsUntilRetirement, affected=None, excluded_expenses=[]):
    # TODO: apply reductions in death:
    reductionsInDeath = 1 - (assumptions["reductions"]["livingExpenseInDeathOfPartner"] / 100)
    _reductionsInDeath = pd.DataFrame(np.ones((1, 3)), columns=["life", "tpd", "trauma"])
    _reductionsInDeath["life"] = reductionsInDeath
    
    reductionsInRetirement = 1 - (assumptions["reductions"]["livingExpenseInRetirement"] / 100)
    
    expenseToGrowthRateMap, expenseToGrowthRateFlat = getRelevantRequirements(requirements, assumptions)
    expenseToKeyMap = buildExpenseToKeyMap(requirements)
    
    expenses = expenses[expenses["name"] != affected]

    expenses = expenses[expenses[EXPENSE_PARENT_TYPE_KEY] != "childExpense"]
    #expenses = expenses[expenses["class"] != "childExpense"]


    res = []
    expensesDict = dict()
    willRetire = yearsUntilRetirement-1
    cpi = assumptions["growthRate"]["CPI"] / 100
    #livingExpense = assumptions["growthRate"]["livingExpense"] / 100
    
    for expense in expenses.itertuples(index=False):
        if expense.type in excluded_expenses: continue 
        
        growthRate = getGrowthRate(expense.type, expenseToGrowthRateFlat) 
        newRow = np.zeros(yearsUntilMortality)
        yearsTillReduction = yearsUntilRetirement
        
        if (str.find(expense.type.lower(), "professional") != -1):
            for i in range(yearsUntilMortality):
                rate = 1
                if i == 0:
                    newRow[i] = expense.value * rate
                else:
                    newRow[i] = (newRow[i-1] * growthRate * rate) if i < willRetire else 0
                    
        else:
             for i in range(yearsUntilMortality):
                 rate = 1
                 if yearsTillReduction == 0: rate = reductionsInRetirement
              
                 if i == 0:
                     newRow[i] = expense.value * rate
                 else:
                     newRow[i] = newRow[i-1] * growthRate * rate
                     
                 yearsTillReduction = yearsTillReduction - 1
               
        
        res.append(newRow) 
        newDf = pd.DataFrame(np.ones((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
        newDf = newDf.multiply(np.asarray(expenseToKeyMap[expense.type].loc[:,["life", "tpd", "trauma"]])).multiply(newRow.T, axis="rows")
        expensesDict[expense.type + "_" + str(expense.value)] = newDf
    
    
    addExtraHelpRequired(expensesDict, requirements, yearsUntilMortality, cpi)#+livingExpense)    
    
    resDf = pd.DataFrame(res) 
    sumPerYear = resDf.sum(axis=0)
    return [expensesDict, resDf, sumPerYear]
  
    
def addExtraHelpRequired(expensesDict, requirements, yearsUntilMortality, cpi):
    # Add "Extra Help Required"
    newDf = pd.DataFrame(np.ones((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
    extraHelp = requirements[requirements.type == "extraHelpRequired"].loc[:,["life", "tpd", "trauma"]]
    newDf.iloc[0]["life"] = 1 * extraHelp["life"]
    newDf.iloc[0]["tpd"] = 1 * extraHelp["tpd"]
    newDf.iloc[0]["trauma"] = 1 * extraHelp["trauma"]
    
    for i in range(0, yearsUntilMortality):  
        #if i == 0: newDf.iloc[0] = newDf.iloc[0].multiply(
        #        np.asarray(requirements[requirements.type == "extraHelpRequired"]
        #                   .loc[:,["life", "tpd", "trauma"]]),
        #        axis=0)
        
        if i == 0: continue                  
        else: newDf.iloc[i] = newDf.iloc[i-1].multiply(1+cpi)

    expensesDict["extraHelpRequired"] = newDf  



def getChildExpenses(childExpenses, assumptions, numYearsToSupportChildren):
    cpi = assumptions["growthRate"]["CPI"] / 100
    education = assumptions["growthRate"]["education"] / 100
    
    results = dict()

    for (child, numYearsToSupport) in numYearsToSupportChildren:     
    #for (child, numYearsToSupport) in range(numYearsToSupportChildren): 
        results[child] = dict()
        childsExpenses = childExpenses[childExpenses["name"]== child]
        for expense in childsExpenses.itertuples(index=False):
            childResults = []
            expenseFrequency = 1
            try:
                expenseFrequency = expense.frequency if not np.isnan(expense.frequency) else 1
            except: 
                print("No frequency available")
                
            for i in range(0, numYearsToSupport):    
                if i == 0: 
                    childResults.append(expense.value * expenseFrequency)
                else:
                    if expense.type == "childEducationExpense":
                        childResults.append(expenseFrequency * childResults[i-1] * (1 + cpi + education))
                    else: 
                        childResults.append(expenseFrequency * childResults[i-1] * (1 + cpi))
        
            results[child][expense.type] = childResults
    
    return results

def getChildExpenses2(childExpenses, childExpensePhilosophy, assumptions, numYearsToSupportChildren, cpi, education, yearsUntilMortality):
    results = dict() 
    
    #for (child, numYearsToSupport) in range(numYearsToSupportChildren):
    for (child, numYearsToSupport) in numYearsToSupportChildren:
        childsExpenses = childExpenses[childExpenses["name"]== child]
        for expense in childsExpenses.itertuples(index=False):
            childDf = pd.DataFrame(np.zeros((yearsUntilMortality, 4)), columns=["tpd", "life", "trauma", "ip"], dtype=np.float64)
            expenseFrequency = 1
            try:
                expenseFrequency = expense.frequency if not np.isnan(expense.frequency) else 1
            except: 
                print("No frequency available")
                
            for i in range(0, numYearsToSupport):    
                if i == 0: 
                    res = childExpensePhilosophy.loc[:, [ "life", "tpd", "trauma", "ip"]] * expense.value * expenseFrequency
                    childDf.iloc[i]["life"] = float(res["life"])
                    childDf.iloc[i]["tpd"] = float(res["tpd"])
                    childDf.iloc[i]["trauma"] = float(res["trauma"])
                    childDf.iloc[i]["ip"] = float(res["ip"])
                else:
                    if expense.type == "childEducationExpense":
                        childDf.iloc[i] = childDf.iloc[i-1] * (1 + education)
                    else: 
                        childDf.iloc[i] = childDf.iloc[i-1] * (1 + cpi)
        
            results["{}_{}".format(child, expense.type)] = childDf    
    return results
            
   




"""
// # Life (death); TPD; Trauma; IP 
//                 TPD: total and permanent disability
//                 IP: Income protection insurance

// SET of offset classes for incomes/assets
// OTHER incomes for offset

// IF no dependents/spouse: on death --> living expenses => 0

// NOTE: every calculation for primary or partner is until mortality age
//       every calculation for children is until MaximumAgeToFundChildrensEducation
//   - add up all legacies, change of housing/car, all liabilities, medical requirements, liabilities, etc.
//   - see 73-74 income requirements tab excel.

// Spouses loss of income is treated as a requirement
// - PUT in offsets on spouse income for the first year only
// - (spouse_income * philosophies.offsets.livingPartnerIncome) - (spouse_income*philosophies.offsets.livingPartnerIncome * (philosophies.requirements.partnerTimeOffWorkInMonths/12))
// - assume (spouse_income * philosophies.offsets.livingPartnerIncome) going forward

// - SUM of offsets column: sum of all assets + NPV(income flow for that year).
//   - n is num years from start, n=n-1 starting at 28
"""

 
def getValuesPerYear(dictOfDfs, yearsUntilMortality, useExistingDf=False, df=None):
     if not useExistingDf:
         df = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])
         
     for k,v in dictOfDfs.items():
         df = df.add(v, axis="columns")
         
     return df

def getInitialRequirementsByType(initial, typeToTypeMap=dict()):
    initialRequirementsDict = dict() 
    initialRequirementsDict["life"] = defaultdict(int)
    initialRequirementsDict["tpd"] = defaultdict(int)
    
    #if typeToTypeMap != None: assetToTypeMap = typeToTypeMap
        
    for k,v, in initial.items():
        _k = k.split("_")[0]
        initialRequirementsDict["tpd"][typeToTypeMap[_k]] += v['tpd'][0]
        initialRequirementsDict["life"][typeToTypeMap[_k]] += v['life'][0]
        
    return initialRequirementsDict


def initialize(clientData, philosophies, assumptions): 
    # Move calculating expenses to after assets/incomes 
    allData = extractDataAndReturnDataFrame(clientData)
    
    # Philosophies:  
    requirements = pd.DataFrame.from_dict(philosophies["requirements"], orient="columns")
    offsets = pd.DataFrame.from_dict(philosophies["offsets"], orient="columns")
    steppedVsLevel = pd.DataFrame.from_dict(philosophies["steppedVsLevel"], orient="columns")
    
    # Expenses/liabilities/assets/incomes:
    expenses = allData[allData.category == "expenses"]
    liabilities = allData[allData.category == "liabilities"]
    assets = allData[allData.category == "assets"]
    incomes = allData[allData.category == "incomes"]
    client = clientData["primary"]["firstName"]
    hasPartner = clientData["hasPartner"]
    
    clientRes = calculateInsuranceRequirements(client, assumptions, offsets, assets, incomes, expenses, liabilities, clientData)
    
    if hasPartner:
        partner = clientData.get("partner").get("firstName") or "Unnamed Partner"
        partnerRes = calculateInsuranceRequirements(partner, assumptions, offsets, assets, incomes, expenses, liabilities, clientData)
        results = dict()
        results["primary"] = clientRes 
        results["partner"] = partnerRes
        print(json.dumps(results, indent=4))
    else: 
        print(json.dumps(clientRes, indent=4))
    sys.stdout.flush()
    return



"""
medExpenses = requirements[requirements["type"] == "medicalRequirements"].loc[:, [ "life", "tpd", "trauma"]].copy()
medExpenses["name"] = "medicalExpenses"
medExpenses["type"] = "medicalExpenses"
newDf = newDf.append(medExpenses)
        
housingCarExpenses = requirements[requirements.type == "changeOfHousingCar"].loc[:, [ "life", "tpd", "trauma"]].copy()
housingCarExpenses["name"] = "changeHousingOrCar"
housingCarExpenses["type"] = "changeHousingOrCar"
newDf = newDf.append(housingCarExpenses)

for liability in liabilities.itertuples(index=False):
  requirements_row = requirements[requirements.type == liability.type].loc[:, [ "life", "tpd", "trauma"]]
  if (len(requirements_row) == 0):       
      newRow = pd.DataFrame([[liability.value, liability.value, liability.value]], columns=["life", "tpd", "trauma"])
  else: 
      newRow = liability.value * requirements_row   
"""

def getFVliabilities(liabilities, requirements, yearsUntilMortality, growthDict):
  fvLiabilities = ["lumpSumLegacy"]
  cpi = growthDict["cpi"] / 100
  medicalInflation = growthDict["medicalInflation"] / 100
  realEstateInflation = growthDict["realEstateInflation"] / 100
  
  # TODO: Find out if this is right:
  """
  medExpenses = requirements[requirements["type"] == "medicalRequirements"].loc[:, [ "life", "tpd", "trauma"]].copy()
  housingCarExpenses = requirements[requirements.type == "changeOfHousingCar"].loc[:, [ "life", "tpd", "trauma"]].copy()
  newMedDf = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])   
  newHousingCarDf = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])  
  for i in range(yearsUntilMortality):
      if i == 0:
          newMedDf.iloc[i] += medExpenses.iloc[i]
          newHousingCarDf.iloc[i] += housingCarExpenses.iloc[i]
      else:
          newMedDf.iloc[i] = (newMedDf.iloc[i-1] * (1+cpi+medicalInflation))
          newHousingCarDf.iloc[i] = (newHousingCarDf.iloc[i-1] * (1 + cpi + realEstateInflation))
  
  #print(newMedDf + newHousingCarDf)
  """
  newDf = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"])  
  
  for liability in liabilities.itertuples(index=False):        
    #iterable = ([fv(rate, i, 0, liability.life)*-1, fv(rate, i, 0, liability.tpd)*-1 , fv(rate, i, 0, liability.trauma)*-1] 
    #            for i in range(yearsUntilMortality))
    
    #iterable = (fv(rate, i, 0, liability.life)
    #            for i in range(yearsUntilMortality)) 
    
    #newRow = np.fromiter(iterable, float)
    
    newRow = np.zeros(yearsUntilMortality)

    if (liability.type in fvLiabilities):
        for i in range(yearsUntilMortality):
            if i == 0:
                newRow[i] = liability.value
            elif (str.find(liability.type, "medical") != -1):
                newRow[i] = (newRow[i-1] * (1+medicalInflation))
            else:
                newRow[i] = (newRow[i-1] * (1+cpi))
    else:
          #iterable = prev_curr((income.value * (1 + cpi) for i in range(yearsUntilMortality)), cpi)
          for i in range(yearsUntilMortality):
            if i == 0:
                newRow[i] = liability.value
            else:
                newRow[i] = 0
    
    newDf = newDf.add(np.asarray(newRow.T), axis="rows")
        
  return newDf



def getFVliabilities2(aggLiabilities, requirements, yearsUntilMortality, growthDict):
    overAllresultsDf = pd.DataFrame(np.zeros((yearsUntilMortality, 4)), columns=["tpd", "life", "trauma", "ip"], dtype=np.float64)
    resultsDict = dict()
    fvLiabilities = ["lumpSumLegacy"]
    j = 0
    
    for liability in aggLiabilities.itertuples(index=False):
        resultsDf = pd.DataFrame(np.zeros((yearsUntilMortality, 4)), columns=["tpd", "life", "trauma", "ip"], dtype=np.float64)
        for i in range(yearsUntilMortality):
            if i == 0: 
                res = { "life": liability.life, "tpd": liability.tpd, "trauma": liability.trauma, "ip": liability.ip}
                #liability.loc[:, [ "life", "tpd", "trauma", "ip"]]
                resultsDf.iloc[i]["life"] += float(res["life"])
                resultsDf.iloc[i]["tpd"] += float(res["tpd"])
                resultsDf.iloc[i]["trauma"] += float(res["trauma"])
                resultsDf.iloc[i]["ip"] += float(res["ip"])
            else:
                if liability.type in fvLiabilities:
                    resultsDf.iloc[i] = resultsDf.iloc[i-1] * (1 + growthDict["cpi"])
                else: 
                    resultsDf.iloc[i] = 0
        
        overAllresultsDf = overAllresultsDf.add(resultsDf)
        resultsDict["{}_{}".format(liability.type, j)] = resultsDf
        j+=1
        
    return [overAllresultsDf, resultsDict]
    

# get NPV of all incomes from n, n+1, ... , n + yearsUntilRetirement 
def getNPVrecurring(incomes):
    pass


def attachChildExpensesToExpensesByCategoryDict(expenses, childExpenses, yearsUntilMortality):
    for child, child_expense in childExpenses.items():
        for expense_type, expense_array in child_expense.items():
            np_expense_array = np.asarray(expense_array, dtype=np.float64)
            empties = np.zeros(yearsUntilMortality - len(expense_array), dtype=np.float64)
            exp_ = np.append(np_expense_array, empties)
            newDf = pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=["life", "tpd", "trauma"], dtype=np.float64)
            newDf = newDf.add(exp_.T, axis=0)
            expenses['{}_{}'.format(child, expense_type)] = newDf
    return expenses
    """
    return { 
        '{}_{}'.format(child_name, expense_type):
            pd.DataFrame(np.zeros((yearsUntilMortality, 3)), columns=[["life", "tpd", "trauma"]]).add(expense_array.T) 
            for child_name, child_expense in childExpenses.items()
            for expense_type, expense_array in child_expense.items() 
            }
    """
    
def getDefaultPortfolioRate(assumptions, portfolios):
    try: 
        defaultPf = assumptions.get("growthRate").get("defaultGrowthRate")    
        print(defaultPf)
        portfolios = json.loads(portfolios)
        defaultPfObject = list(filter(lambda pf: pf.get("portfolioName") == defaultPf, portfolios))[0]
        print(defaultPfObject)
        defaultPfRate = defaultPfObject.get("expectedGrowth")        
        print("--- default Pf Rate ---")
        print(defaultPfRate)
        return defaultPfRate
    except:
        return 4.25

    
def convertDfDictToJSON(a_dict):
    return {
        k: v.to_json() for k,v in a_dict.items()
        }
    
def calculateInsuranceRequirements(client, yearsUntilMortality, yearsUntilRetirement, assumptions, assets, incomes, expenses, liabilities, clientData, philosophies):
    if clientData == None: return
    
    hasChildren = clientData.get("hasChildren")
    
      # rates:
    cpi = assumptions["growthRate"]["CPI"] / 100
    # living = assumptions["growthRate"]["livingExpense"]
    education = assumptions["growthRate"]["education"] / 100
    realEstate = assumptions["growthRate"]["realEstate"]
    medicalInflation = assumptions["growthRate"]["medicalInflation"]
   

    try:
        portfolioGrowthRate = clientData.get("riskProfile").get("portfolioRate")
        portfolioGrowthRate = portfolioGrowthRate / 100
        
    except: 
        portfolios = clientData.get("advisor").get("portfolios")
        defaultPortfolioRate = getDefaultPortfolioRate(assumptions, portfolios)
        portfolioGrowthRate = defaultPortfolioRate / 100

    print("---- USING PORTFOLIO GROWTH RATE OF ---", portfolioGrowthRate)        
    
     
    # Philosophies:    
    requirements = pd.DataFrame.from_dict(philosophies["requirements"], orient="columns")
    offsets = pd.DataFrame.from_dict(philosophies["offsets"], orient="columns")
    
    
    # TODO: steppedVsLevel calculator:
    steppedVsLevel = pd.DataFrame.from_dict(philosophies["steppedVsLevel"], orient="columns")
    #print(requirements[requirements["for"] == "liabilities"].loc[:, [ "life", "tpd", "trauma", "ip"]])
    
    
    
    # STEP 1: Get liabilities and lump sum legacies:   
    aggLiabilities = getAggLiabilities(liabilities, requirements)
    #fvLiabilitiesUntilDeath = getFVliabilities(aggLiabilities.loc[:, ["life", "tpd"]], yearsUntilMortality)
    #print(aggLiabilities.to_json())

    # STEP 2: Get all offsets (assets and incomes):
    """ assets """ 
    assetOffsets, resDf, sumPerYear = getAssetOffsets(assets, assumptions, offsets, yearsUntilMortality, portfolioGrowthRate)
    assetSumPerYear = getValuesPerYear(assetOffsets, yearsUntilMortality) 
    #assetsSumNpvPerYear = getNpvPerYearDataFrame(assetSumPerYear, portfolioGrowthRate)
    #allAssetsSumNPV = assetSumPerYear.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)
    
    """ incomes """    
    ## TODO: do I need this?
    ## Incomes after target dies/tpd/traumas:
    ## ASSUMPTIONS:
    ## - dead clients income stops
    ## - investments and investment properties are sold     
    ## - TODO: partner takes x months off work 
    ## - TODO: primary loses x % for y months off work for trauma 
    incomeOffsets, resDf2, sumPerYear2 = getIncomes(incomes, assumptions, offsets, yearsUntilMortality, yearsUntilRetirement, client, ["investmentPropertyIncome", "investmentIncome", "otherInvestmentIncome"], portfolioGrowthRate)
    partnerIncomes = getValuesPerYear(incomeOffsets, yearsUntilMortality)
    incomesSumNpvPerYear = getNpvPerYearDataFrame(partnerIncomes, portfolioGrowthRate)
    #incomesPerYear = getValuesPerYear(incomeOffsets, yearsUntilMortality)
    #incomesSumNPV = incomesPerYear.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)
    
    # OFFSETS: assets + incomes:
    #assetAndIncomeSumPerYear = getValuesPerYear(incomeOffsets, yearsUntilMortality, True, assetSumPerYear)
    #sumOfAssetsAndIncomeOffsets = sumAssetsAndIncomeOffsets(assetOffsets, incomeOffsets, yearsUntilMortality)    
    
    #assetsAndIncomesNPV = allAssetsSumNPV + incomesSumNPV
    """ 
    lost income as a result of death: sum npv of life income for both partners
    """
    # TODO: IMPORTANT: I'm not/I don't think I'm handling incomes correctly:
    """
    NOTES:
        - use dead spouses income: "Estimated loss of income on death"
    """
    # All incomes including target of death/tpd/trauma:
    #clientLostIncomes, _, _ = getIncomes(incomes, assumptions, offsets, yearsUntilMortality, yearsUntilRetirement, clientData.get("partner").get("firstName"), ["investmentPropertyIncome", "investmentIncome", "otherInvestmentIncome"], portfolioGrowthRate, apply_reduction=False)
    #clientLostIncomesPerYear = getValuesPerYear(clientLostIncomes, yearsUntilMortality)
    #clientIncomes = getIncomes(incomes, assumptions, offsets, yearsUntilMortality, yearsUntilRetirement, clientData.get("partner").get("firstName"), ["investmentPropertyIncome", "investmentIncome", "otherInvestmentIncome"], portfolioGrowthRate, apply_reduction=False, is_sufferer=True)
    #clientIncomesPerYear = getValuesPerYear(clientIncomes, yearsUntilMortality)
    
    # LOST INCOMES NPV:
    #allIncomesSumNpvPerYearPrimary = getNpvPerYearDataFrame(clientLostIncomesPerYear, portfolioGrowthRate)


    # TODO :: 
    #incomesByCategorySumNpv = getNpvsForDict(allIncomesPerYear, portfolioGrowthRate)
    incomesByCategorySumNpv = getNpvsForDict(incomeOffsets, portfolioGrowthRate)
    incomesSumNpvPerYear = reduce(lambda x, y: x.add(y, fill_value=0), incomesByCategorySumNpv.values(), pd.DataFrame(data=[[0,0,0]], columns=["life","tpd","trauma"]))

    #allIncomesSumNPV = allIncomesPerYear.apply(lambda x: npv(cpi, x), axis=0)
    #allIncomesSumNPV = incomesSumNpvPerYear.iloc[0]
    
    #offsetsSumNpvPerYear = assetsSumNpvPerYear + incomesSumNpvPerYear
    offsetsSumNpvPerYear = assetSumPerYear.add(incomesSumNpvPerYear, fill_value=0)

    

    # STEP 3: Get all expenses (income requirements):
    """ expenses """
    expensesByYear, resDf3, sumPerYear3 = getExpenses(
        expenses, 
        assumptions,
        requirements,
        yearsUntilMortality,
        yearsUntilRetirement,
        client, 
        excluded_expenses=["personalLoanExpense", "creditCardRepaymentsExpense", "residentialMortgageExpense",
                           "investmentPropertyRepaymentExpense", "investmentPropertyUpkeepExpense", "investmentManagedFundExpense",
                           "investmentBondsExpense", "investmentGearingExpense", "otherInvestmentExpense"])
        
    #print(expensesByYear)
    # childExpenses:
    numYearsToSupportChildren = assumptions.get("calculatedAssumptions").get("numYearsToSupportChildren") or 0
    
    #childExpenses = getChildExpenses(expenses[expenses["parentType"] == "childExpense"], assumptions, numYearsToSupportChildren)       
    
    ## TODO: use this to alter child expenses for tpd/life/trauma:
    if hasChildren:
        _childExpenses = expenses[expenses[EXPENSE_PARENT_TYPE_KEY] == "childExpense"]
        childExpensePhilosophy = buildExpenseToKeyMap(requirements)["childEducationExpense"]
        childExpenses = getChildExpenses2(_childExpenses, childExpensePhilosophy, assumptions, numYearsToSupportChildren, cpi, education, yearsUntilMortality)
    else: 
        childExpenses = {}
        
    # add child expenses:
    #sumOfAllExpenses = addChildExpenses(sumOfExpenses, childExpenses, yearsUntilMortality)    

    # EXPENSES and INCOMES npvs by category:
    #expensesByYear = attachChildExpensesToExpensesByCategoryDict(expensesByYear, childExpenses, yearsUntilMortality)
    expensesByYear = {**childExpenses, **expensesByYear}
    expensesByCategorySumNpv = getNpvsForDict(expensesByYear, portfolioGrowthRate)
    #incomesByCategorySumNpv = getNpvsForDict(incomeOffsets, portfolioGrowthRate)
    #incomesByCategorySumNpv = getNpvsForDict(partnerIncomes, portfolioGrowthRate)
    assetsByCategorySumNpv = getNpvsForDict(assetOffsets, portfolioGrowthRate)
    
    # sum of all expenses:
    sumOfAllExpenses = sumExpenses(expensesByYear, yearsUntilMortality)
    
    ## BROKEN:
    #expensesSumNPVByCategory = getNPVfromSeries(assumptions, expensesByYear, portfolioGrowthRate)
    #expensesSumNPV = sumOfExpenses.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)
    #childExpensesNPV = getNPVfromSeries(assumptions, childExpenses, portfolioGrowthRate)        
    #totalChildExpenses = sumNPVdict(childExpensesNPV)  
    
    #expensesSumOfAllNPV = sumOfAllExpenses.apply(lambda x: npv(portfolioGrowthRate, x), axis=0)   
    #expensesSumNpvPerYear2 = getNpvPerYearDataFrame(sumOfAllExpenses, portfolioGrowthRate)
    
    expensesSumNpvPerYear = reduce(lambda x, y: x.add(y, fill_value=0), expensesByCategorySumNpv.values(), pd.DataFrame(data=[[0,0,0]], columns=["life","tpd","trauma"]))
    expensesSumOfAllNPV = expensesSumNpvPerYear.iloc[0]
    
    
    #initialReqAssets = getInitialRequirementsByType(assetOffsets, assetToTypeMap)
    #initialReqIncomes = getInitialRequirementsByType(incomeOffsets, assetToTypeMap)
    initialReqLiabilities = aggLiabilities.loc[:, ["life", "tpd", "trauma"]].sum(axis=0)
    
    
    """
    // STEP 4: find minimum coverage requirements pre-offsets.
    // - e.g. I need $2mil of life cover
    // - from minimumCoverage requirements pre-offset ((from philosophies row 32)) 
         (cos trying to create liquidity incase you can't sell off the assets quickly enough')
    
    minimumCoverageAssumption * NPV of sum of expenses 
    minimumCoverageAssumption * sum of liabilities
    """
    minimumCoverage = requirements[requirements["type"] == "minimumCoveragePercentOfRequirementsPreOffsets"].loc[:, ["tpd", "trauma", "life"]]
    minimumCoverageRequirements = (minimumCoverage * initialReqLiabilities) + (minimumCoverage * expensesSumOfAllNPV)
    
    # Find cash or offsetAccount cash and subtract it from minimumCoverageRequirements
    # - filter keys by cash & offsetAccount 
    #filter(lambda x: , assetOffsets.keys())
    
    """
    // STEP FINAL: apply taxOnCapital ((from assumptions row 20)) to any lump sum for life cover and tpd sections
    // - e.g. client needs $5mil (debts/future expenses-> income requirements)
    //        - $4mil offsets    (assets being sold/income still generated/insurance cover/investment income, etc.)
    //        - net amount required: $1mil - 1.1*$1mil => 1.1mil
    
        assumptions["taxation"]["taxOnLumpSumInsurance"] -> e.g. 10%
    """
    taxOnLumpSumInsurance = assumptions["taxation"]["taxOnLumpSumPaymentsLife"] / 100
    taxOnLumpSumInsuranceTPD = assumptions["taxation"]["taxOnLumpSumPaymentsTPD"] / 100
    taxOnLumpSumPaymentsTrauma = assumptions["taxation"]["taxOnLumpSumPaymentsTrauma"] / 100

    #netAmountRequired = (-1) * (initialReqLiabilities + expensesSumNpvPerYear - incomesSumNpvPerYear - assetSumPerYear)    
    #taxPaid = netAmountRequired * np.array([taxOnLumpSumInsurance, taxOnLumpSumInsuranceTPD, taxOnLumpSumPaymentsTrauma])
    #taxPaid = netAmountRequired * taxOnLumpSumInsurance
    #netAmountRequiredAfterTax = netAmountRequired + taxPaid
    
    
    #aggLiabilitiesPerYear = getFVliabilities(liabilities, requirements, yearsUntilMortality, { "cpi": assumptions["growthRate"]["CPI"], "medicalInflation": assumptions["growthRate"]["medicalInflation"], "realEstateInflation": assumptions["growthRate"]["realEstate"] })
    [aggLiabilitiesPerYear, aggLiabilitiesPerYearByCategory] = getFVliabilities2(aggLiabilities, requirements, yearsUntilMortality, { "cpi": cpi, "medicalInflation": medicalInflation, "realEstateInflation": realEstate })

    # (assetAndIncomeSumPerYear - initialReqLiabilities - sumOfAllExpenses) * (-1) * (1+taxOnLumpSumInsurance)
    #netPerYear = allIncomesPerYear + assetSumPerYear - sumOfAllExpenses - initialReqLiabilities
   
    # TODO: ?? 
    #aggLiabilities.append()
    
    
    netPerYear = expensesSumNpvPerYear.copy() 
    netPerYear.iloc[0]["life"] += aggLiabilitiesPerYear.iloc[0]["life"]
    netPerYear.iloc[0]["tpd"] += aggLiabilitiesPerYear.iloc[0]["tpd"]
    netPerYear.iloc[0]["trauma"] += aggLiabilitiesPerYear.iloc[0]["trauma"]
    netPerYear = netPerYear - incomesSumNpvPerYear - assetSumPerYear
    taxPaid = netPerYear * np.array([taxOnLumpSumInsurance, taxOnLumpSumInsuranceTPD, taxOnLumpSumPaymentsTrauma])
    netAmountRequiredAfterTax = netPerYear + taxPaid 
    
    
    # TODO: 
    taxRow = pd.Series((np.concatenate((taxPaid.iloc[0], np.array([0, "Estimated Tax on Insurance", "estimatedTaxOnInsurancePayout"])))), index=["life", "tpd", "trauma", "ip", "name", "type"], name="taxPaid")
    aggLiabilities = aggLiabilities.append(taxRow)
    
    
    """
    MUST RETURN: 
        for life/tpd/trauma requirements:
            - all income requirements and their categories as NPV
            - all liabilities requirements and their categories as lump sum values
            - all incomes/assets available as offsets (current discounted value for offsets, NPV of sum of all incomes)
          
        for coverage graph:
            - sum of income requirements per year for all years
            - sum of liabilities (lump sum requirements) per year for all years
            - sum of NPV? of offsets per year for all years
            - NET needs (income + assets - expenses - liabilities)
        
        for total requirements graph:
            - NPV of income requirements (available from above)
            - liabilities and other lump sums (available from above)
            - all incomes/assets available as offsets (available from above)
            - total requirement: (income + assets - expenses - liabilities)
            - minimumCoveragRequirements
            
        level vs. stepped:
            - life, tpd, trauma, ip: < 15 yrs, > 15 yrs, age, retirement age
    """
    # return {
    #         "netPerYear": netPerYear,
    #         "taxPaid": taxPaid,
    #         "netAmountRequiredAfterTax": netAmountRequiredAfterTax,
    #         "expensesSumNpvPerYear": expensesSumNpvPerYear,
    #         "aggLiabilitiesByCategory": aggLiabilities,
    #         "liabilitiesPerYear": aggLiabilitiesPerYear,
    #         "initialLiabilities": aggLiabilitiesPerYear.iloc[0],
    #         "offsetsSumPerYear": offsetsSumNpvPerYear,            
    #         "expensesByCategorySumNpv": expensesByCategorySumNpv,
    #         "incomesByCategorySumNpv": incomesByCategorySumNpv,
    #         "assetsByCategorySumNpv": assetsByCategorySumNpv,
    #         "incomeRequirementsPerYear": allIncomesPerYear,
    #         "expensesPerYear": sumOfAllExpenses,
    #         "minimumCoverageRequirements": minimumCoverageRequirements,
    #         }
    
    return {
        #MUST RETURN:            
            # return tax paid on lump sums for use in requirements graph (tax on lump sum insurance payment)
            "netPerYear": netPerYear.to_json(),
            "taxPaid": taxPaid.to_json(),
            "netAmountRequiredAfterTax": netAmountRequiredAfterTax.to_json(),
        #for life/tpd/trauma requirements:
            #- all income requirements and their categories as NPV
            "expensesSumNpvPerYear": expensesSumNpvPerYear.to_json(),
            #"offsetsSumPerYear": sumOfAssetsAndIncomeOffsets.to_json(), 
            #"expensesSumNPVByCategory": pd.DataFrame(np.array(expensesSumNPVByCategory)).to_json(),
            #- all liabilities requirements and their categories as lump sum value (INCLUDES TAX)
            "aggLiabilitiesByCategory": aggLiabilities.to_json(),
            "liabilitiesPerYear": aggLiabilitiesPerYear.to_json(),
            "initialLiabilities": aggLiabilitiesPerYear.iloc[0].to_json(),

            #- all incomes/assets available as offsets (current discounted value for offsets, NPV of sum of all incomes)
            # TODO: CONVERT nested dataframes to JSON:
            "offsetsSumPerYear": convertDfDictToJSON(offsetsSumNpvPerYear),            
            "expensesByCategorySumNpv": convertDfDictToJSON(expensesByCategorySumNpv),
            "incomesByCategorySumNpv": convertDfDictToJSON(incomesByCategorySumNpv),
            "assetsByCategorySumNpv": convertDfDictToJSON(assetsByCategorySumNpv),
        #for coverage graph:
            #- sum of income requirements per year for all years
            "incomeRequirementsPerYear": partnerIncomes.to_json(),
            #- sum of liabilities (lump sum requirements) per year for all years
            #- sum of offsets per year for all years
            #"offsetsPerYear": sumOfAssetsAndIncomeOffsets.to_json(),
            "expensesPerYear": sumOfAllExpenses.to_json(),
            #- NET needs (income + assets - expenses - liabilities)

        
        #for total requirements graph:
            #- NPV of income requirements (available from above)         
            #- liabilities and other lump sums (available from above)
            #- all incomes/assets available as offsets (available from above)
            #- total requirement: (income + assets - expenses - liabilities)
            #- minimumCoveragRequirements
            "minimumCoverageRequirements": minimumCoverageRequirements.to_json(),
            
        #for level vs. stepped:
            #- life, tpd, trauma, ip: < 15 yrs, > 15 yrs, age, retirement age
            
      #"totalChildExpenses": totalChildExpenses,
      #"childExpensesNPV": childExpensesNPV,
      # "incomesNPV": incomesSumNPV.to_json(),
      # "expensesNPV": expensesSumOfAllNPV.to_json(),
      # "aggExpenses": sumOfAllExpenses.to_json(),
            }
   


"""
// STEP 2: Find all expenses for family -- which expenses stay and which go away when who dies...
// - EXPENSES create INCOME REQUIREMENTS: See income requirements tab on excel
//   - one set of income requirements for TPD/Life/Trauma
//   - From philosophies - **Rows 18-21**
//   - NOTE: ADD extraHelpRequired ((philosophies row 21)) to expenses in event of TPD.
// - e.g. $100,000 expenses pre-death, 100,000 * (1 - livingExpensesInDeath) ((from ASSUMPTION row 16))
//      => 75,000 UNTIL AGE OF RETIREMENT
//   => 75,000 * (1 - LivingExpenseInRetirement ((from ASSUMPTION row 17)))
//   - what capital amount is required to generate 75,000 a year for (a, x, y, ...) years.
//   - mortalityAge - livingPartners age for rest of expenses.
//   - x,y,z,...: variables for  number of children, FROM ASSUMPTION: MaximumAgeToFund
//     ChildrensEducation - children age (forall children).
// - Rental is an expense: if renting, increase rent cost by CPI
// - TODO: KEY POINT:
//   - Sum all expenses for every year until mortality age, then calculate NPV from now for all expenses forever.
//     n is based on num year till death, decreasing n-1 forall years from 0.
"""  
  
"""
# STEP 2: Get expenses: KEYS: childExpenses, client, partner
"""


def initialize_as_fn(clientData, philosophies, assumptions): 
     # STEP 0: Reshape assumptions and get calculated assumptions:
    assumptions = reshape_assumptions(assumptions)
    print("--- STEP 3 ----")
    assumptions["calculatedAssumptions"] = calculateAssumptions(clientData, assumptions)
    print("--- STEP 4 ----")
    yearsUntilMortality = assumptions["calculatedAssumptions"]["yearsUntilMortalityPrimary"]
    yearsUntilRetirement = assumptions["calculatedAssumptions"]["yearsUntilRetirement"]
    #print(assumptions["calculatedAssumptions"])
    #print(yearsUntilMortality)
    #print(yearsUntilRetirement)
    
    # Move calculating expenses to after assets/incomes 
    allData = extractDataAndReturnDataFrame(clientData)
    print("--- STEP 5 ----")
    
    # Expenses/liabilities/assets/incomes:
    expenses = allData[allData.category == "expenses"]
    liabilities = allData[allData.category == "liabilities"]
    assets = allData[allData.category == "assets"]
    incomes = allData[allData.category == "incomes"]
    client = clientData["primary"]["firstName"]
    hasPartner = clientData["hasPartner"]
    print("--- STEP 6 ----")
    if hasPartner:
        yearsUntilMortality = assumptions["calculatedAssumptions"]["yearsUntilMortalityForYoungestPartner"]
    print("--- STEP 7 ----")
    
    clientRes = calculateInsuranceRequirements(client, yearsUntilMortality, yearsUntilRetirement, assumptions, assets, incomes, expenses, liabilities, clientData, philosophies)
    print("--- STEP 8 ----")
    results = dict()
    results["primary"] = clientRes 
    
    if hasPartner:
        partner = clientData.get("partner").get("firstName") or "Unnamed Partner"
        yearsUntilMortality = assumptions["calculatedAssumptions"]["yearsUntilMortalityPrimary"]
        yearsUntilRetirement = assumptions["calculatedAssumptions"]["yearsUntilRetirementPartner"]    
        print("--- STEP 9 ----")
        partnerRes = calculateInsuranceRequirements(partner, yearsUntilMortality, yearsUntilRetirement, assumptions, assets, incomes, expenses, liabilities, clientData, philosophies)
        print("--- STEP 10 ----")
        results["partner"] = partnerRes
        
    return results


def insurance_calc(c=None, p=None, a=None):
  return initialize_as_fn(c, p, a)



def validate_client_data(clientData):
    hasPartner = clientData.get("hasPartner")
    primaryAge = clientData.get("primary").get("dateOfBirth")
    if (primaryAge == None): return False
    if (hasPartner and clientData.get('partner').get("dateOfBirth") == None): return False
    return True


def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """
    #print(type(event))       # => <class 'dict'>
    #print(event);            # => {} 
    #print(json.loads(event)) # => not necessary
  
    #print(insurance_calc)     # => <function insurance_calc ...> 
    #print(event)              # => event dictionary 
    #print(type(event))        # => <class 'dict'>
    #print(type(body))         # => <class 'str'> 
    #print(body)
    #print(type(body))         # => <class 'dict'>
    #print(body)              

    #body = event.get("body")  
    #body = json.loads(body)


    try: 
      print("--- STEP 1 ----")
      #print(event)      
      body = json.loads(event.get("body"))
      #print(body)
      # Check body.func === goals : body.func === insurance.

      
      #print("body loaded successfully from event");
      allDataProvided = reduce(
        lambda x, y: x and y, 
        map(lambda x: body.keys().__contains__(x), ["clientData", "assumptions", "philosophies"])
        )


      if (allDataProvided):
        c = body.get("clientData")
        valid = validate_client_data(c)
        p = body.get("philosophies")
        a = body.get("assumptions")
        #print(c)
        #print(p)
        #print(a)
        #print(valid)
        
        print("--- STEP 2 ----")
        
        if not valid:
            return {"statusCode": 200, "body": json.dumps({ "error": "Date of birth is required to be set for Insurance Calculations"})}
        
        try: 
          results = insurance_calc(c, p, a)
          return  {"statusCode": 200, "body": json.dumps(results) }

        except BaseException as e:
          #return { "statusCode": 500, "body": json.dumps({"error": str(e)})}
          #results = insurance_calc()
          raise e
          return {"statusCode": 500, "body": json.dumps({"error": str(e) }) }

      else: 
        #results = insurance_calc()
        #return {"statusCode": 200, "body": json.dumps(results) }
        return {"statusCode": 500, "body": json.dumps({"error": "required data was not provided"}) }

    except BaseException as e:
        raise e
        return { "statusCode": 500, "body": json.dumps({"error": str(e)})}
    """ USAGE:
    def insurance_calc(c=None, p=None, a=None):
        return initialize_as_fn(c or clientData, p or philosophies, a or assumptions)
    """
    #if (allDataProvided):
    #    results = insurance_calc(event.get("clientData"), event.get("philosophies"), event.get("assumptions"))
    #else:
    #    results = insurance_calc()

    """
    try:
      if (type(event) == dict):
         allDataProvided = reduce(
           lambda x, y: x and y, 
            map(lambda x: event.keys().__contains__(x), ["clientData", "assumptions", "philosophies"])
          )

         body = json.loads(event.get("body"))

         if (allDataProvided):
           c = json.loads(body.get("clientData"))
           p = json.loads(body.get("philosophies"))
           a = json.loads(body.get("assumptions"))
           results = insurance_calc(c, p, a)
           return {
            "statusCode": 200,
            "body": json.dumps(results),
           }
         else: 
           raise BaseException("Not all arguments were provided")

    except BaseException as e:
      logger = logging.getLogger("insurance_calc")
      logger.exception(e)
      results = insurance_calc()
      return {
        "statusCode": 200,
        "body": json.dumps(results),
      }
    """
    
def run_local_test():
    from dummy_data2 import assumptions, philosophies, clientData 
    from dummy_data3 import exampleClientTwo
    #from test_cases import testClientBasic
    #from dummy_data import clientData as clientData2
    #res = insurance_calc(clientData, philosophies, assumptions)
    #res = insurance_calc(testClientBasic, philosophies, assumptions)

    res = lambda_handler({ "body": 
        json.dumps({
            "clientData": exampleClientTwo, 
            "philosophies": philosophies, 
            "assumptions": assumptions })},
        {})
    return res
        
#results = insurance_calc()
if __name__ == "__main__":
    res = run_local_test()
        