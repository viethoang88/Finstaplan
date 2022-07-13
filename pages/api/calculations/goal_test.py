# -*- coding: utf-8 -*-
"""
Created on Sun Sep 19 11:25:53 2021

@author: sean2
"""
from functools import reduce
import pytz

from dummy_data2 import assumptions, portfolios, goals, clientData, shapedGoals

import numpy_financial as npf
import pandas as pd
import numpy as np
from dateutil.relativedelta import relativedelta
import datetime
import json
from math import floor

def getAge(birth_date, from_date=None):   
  if from_date is None:
    from_date = datetime.datetime.now()
  return (from_date - relativedelta(years=birth_date.year, months=birth_date.month, days=birth_date.day)).year

def reshape_assumptions(assumptions):
    assumptions_dict = dict()
    for assumption in assumptions:
        if (not assumptions_dict.get(assumption.get("for"))):
            assumptions_dict.update({ assumption.get("for"): dict()})
        
        toUpdate = assumptions_dict.get(assumption.get("for"))
        toUpdate.update({ assumption.get("type"): assumption.get("value") })
    return assumptions_dict 

def calculateAssumptions(clientData, assumptions):
  clientAge = getAge(parseDate(clientData["primary"]["dateOfBirth"])) 
  yearsUntilRetirementForYoungestPartner = assumptions["other"]["retirementAge"] - clientAge + 1
  yearsUntilMortalityPrimary = assumptions["other"]["mortalityAge"] - clientAge + 1
  yearsUntilRetirementPrimary = assumptions["other"]["retirementAge"] - clientAge + 1
  calculatedAssumptionsDict = {
      "clientAge": clientAge,
      "yearsUntilRetirementForYoungestPartner": yearsUntilRetirementForYoungestPartner,
      "yearsUntilMortalityForYoungestPartner": yearsUntilMortalityPrimary,
      "yearsUntilRetirement": yearsUntilRetirementForYoungestPartner,
      "yearsUntilMortalityPrimary": yearsUntilMortalityPrimary,
      "yearsUntilRetirementPrimary": yearsUntilRetirementPrimary
  }
     
  if (clientData["hasPartner"]):
    partnerAge = getAge(parseDate(clientData["partner"]["dateOfBirth"]))
    min_age = min([partnerAge, clientAge]) 
    calculatedAssumptionsDict["partnerAge"] = partnerAge
    calculatedAssumptionsDict["yearsUntilRetirementForYoungestPartner"] = assumptions["other"]["retirementAge"] - min_age + 1
    calculatedAssumptionsDict["yearsUntilMortalityForYoungestPartner"] = assumptions["other"]["mortalityAge"] - min_age + 1
    calculatedAssumptionsDict["yearsUntilRetirementPartner"] = assumptions["other"]["retirementAge"] - partnerAge + 1
    calculatedAssumptionsDict["yearsUntilMortalityPartner"] = assumptions["other"]["mortalityAge"] - partnerAge + 1   
  return calculatedAssumptionsDict 




# TODO: note the difference here: def extractRelevantAssumptions(assumptions, behaviourGrowthRate, clientData):
def extractRelevantAssumptions(assumptions, behaviourGrowthRate):
    reshapedAssumptions = reshape_assumptions(assumptions)
    calculatedAssumptions = calculateAssumptions(clientData, reshapedAssumptions)
    calculatedAssumptions["CPI"] = reshapedAssumptions["growthRate"]["CPI"] / 100
    calculatedAssumptions["behaviourModificationLoading"] = reshapedAssumptions["other"]["behaviourModificationLoading"] / 100
    calculatedAssumptions["behaviourGrowthRate"] = behaviourGrowthRate / 100
    calculatedAssumptions["mortalityAge"] = reshapedAssumptions["other"]["mortalityAge"]
    return calculatedAssumptions

def getPortfolioRate(portfolios):
    """   
    Parameters
    ----------
    portfolios : TYPE list
        shape: [{ "portfolioName": "High Growth", "expectedGrowth": 6.99, "investmentTerm": 8 },...]

    Returns
    -------
    portfolioRateMap : TYPE dict
        keys: investmentTerm
        values: { "portfolioName": "High Growth", "expectedGrowth": 6.99 }

    """
    return {
        pf["investmentTerm"]: { 
            "portfolioName": pf["portfolioName"], 
            "expectedGrowth": pf["expectedGrowth"]
            } for pf in portfolios
        }    
        
def getIndex(portfolioTerms, value):
    """
    Assumes myList is sorted. Returns closest value to myNumber.
    If two numbers are equally close, return the smallest number.
    If number is outside of min or max return False
    """
    if value > portfolioTerms[-1]:
        return portfolioTerms[-1]

    array = np.asarray(portfolioTerms)
    """
    # TODO: verify if this is a < or <= test, 
    # e.g. if i = 3   and   Conservative is 1.5 to 3, do I allocate 3 as Mod Conservative or Conservative
    """
    idx = np.argmax(value < array) - 1
    return array[idx]

    # v1:
    # from bisect import bisect_left   
    # pos = bisect_left(portfolioTerms, value)
    
    # if pos == 0:
    #         return portfolioTerms[0]
    # if pos == len(portfolioTerms):
    #         return portfolioTerms[-1]
        
    # before = portfolioTerms[pos - 1]
    # after = portfolioTerms[pos]
    
    # if after - value < value - before:
    #    return after
    # else:
    #    return before
   
    # v2:
    #return min(portfolioTerms, key=lambda x: abs(x - value))
    



def calculateActualRateTable(portfolios, behaviourGrowthRate, behaviourModificationLoading, yearsUntilMortality=65):
    """    
    
    Parameters
    ----------
    portfolios : TYPE
        DESCRIPTION.
    behaviourGrowthRate : TYPE
        DESCRIPTION.
    behaviourModificationLoading : TYPE
        DESCRIPTION.
    yearsUntilMortality : TYPE, optional
        DESCRIPTION. The default is 65.

    Returns
    -------
    table : TYPE pd.DataFrame
        formulae:
            col1: npf.pv(rate=behaviourModificationLoading * behaviourGrowthRate +
                          getPortfolioRate(i) * (1 - behaviourModificationLoading),
                     nper=1,
                     pmt=0,
                     fv=-1)
            
                    where getPortfolioRate is VLOOKUP(VARIABLES!$C71,VARIABLES!$B$12:$D$17,3,TRUE)
                    - for i <= investment term
                    
            col2: table["col2"][i-1] * table["col1"][i]
            
            col3: npf.rate()
                from: RATE(nper, pmt, pv, [fv], [type], [guess])
                 e.g: =RATE(10,,0.568478, -1)
                  to: npf.rate(nper, pmt, pv, fv)
                  to: npf.rate(10, 0, 0.568478, -1)
 
    """
    table = pd.DataFrame(np.ones((yearsUntilMortality+1, 4)), columns=["col1", "col2", "actualRate", "assignedPortfolio"])
    pf = getPortfolioRate(portfolios)
    terms = list(pf.keys())
    terms.sort()
    table.iloc[0, 3] = pf[getIndex(terms, 0)]["portfolioName"]
    
    for i in range(1, yearsUntilMortality+1):
        pf_idx = getIndex(terms, i)           
        pf_selected = pf[pf_idx]      
        behaviour_rate = round(behaviourModificationLoading * behaviourGrowthRate, 8)
        goal_rate = (pf_selected["expectedGrowth"]/100) * (1 - behaviourModificationLoading)
        rate = behaviour_rate + goal_rate            
    
        table.iloc[i, 0] = npf.pv(
            rate,
            1,
            0,
            -1
            )

        table.iloc[i, 1] = table["col2"][i-1] * table["col1"][i]
        
        table.iloc[i, 2] = npf.rate(i, 0, table["col2"][i], -1)
        
        table.iloc[i, 3] = pf_selected["portfolioName"]
        
        if (i == 1):
            a = table["col2"][i] * table["col1"][i-1]
            table.iloc[0, 2] = npf.rate(i, 0, a, -1)
        
    return table

def reshapeGoals(goals):
    """    

    Parameters
    ----------
    goals : TYPE dict        
        keys are indices, values are goels
    Returns
    -------
    reshapedGoals : TYPE dict
        keys are priorities, values are goals
    """
    try:
        return { goal["priority"]: goal for goal in goals }
        #return { goal["priority"]: goal for goal in goals.values() }
    except:
        return False


def parseDate(date_string):
  import datetime 
  from dateutil import parser
  parsedDate = parser.parse(date_string).replace(tzinfo=None)
  #matcher = "%Y-%m-%d"
  #parsedDate2 = datetime.datetime.strptime(date_string, matcher)
  #print(parsedDate, parsedDate2)
  return parsedDate
     
def addFrequencyPeriod(old_date, nper, per_type):
    from dateutil.relativedelta import relativedelta
    if (per_type == "years"):
        return old_date + relativedelta(years=nper)
    elif (per_type == "months"):
        return old_date + relativedelta(months=nper)
    elif (per_type == "weeks"):
        return old_date + relativedelta(weeks=nper)    
    elif (per_type == "days"):
        return old_date + relativedelta(days=nper)

def next_date(goal_date, frequency):
   def get_next_date_fn(goal_date, frequency): 
       fn_map = {
           "weekly": addFrequencyPeriod(goal_date, 7, "days"),
           "fortnightly": addFrequencyPeriod(goal_date, 2, "weeks"),
           "monthly":  addFrequencyPeriod(goal_date, 1, "months"),
           "quarterly": addFrequencyPeriod(goal_date, 3, "months"),
           "biAnnually": addFrequencyPeriod(goal_date, 6, "months"),
           "yearly": addFrequencyPeriod(goal_date, 1, "years"),
        }
       return fn_map[frequency]
   return get_next_date_fn(goal_date, frequency)      
          
def calculateYearsUntilStartDate(birth_date, from_date=None):  
  import datetime
  from dateutil.relativedelta import relativedelta
  
  if from_date is None:
    from_date = datetime.datetime.now()
  return (from_date - relativedelta(years=birth_date.year, months=birth_date.month, days=birth_date.day)).year

def calculateNumYears(birth_date, from_date=None):  
  import datetime
  from dateutil.relativedelta import relativedelta
  
  if from_date is None:
    from_date = datetime.datetime.now()
  return (from_date - relativedelta(years=birth_date.year, months=birth_date.month, days=birth_date.day)).year


def fillDatesHelper(goal, startDate, freq, yearsUntilMortality):
    startDates = [startDate]
    endDates = []
    numTimes = goal.get("numTimes")
    
    if freq == "onceOff":
        return [startDate], [startDate]
    
    elif numTimes:
        # TODO: TRYING SOMETHING HERE, revert if breaking change:
        for i in range(1, numTimes):        
            endDate = next_date(startDates[i-1], freq)
            endDates.append(endDate)
            startDates.append(endDate)
        endDates.append(next_date(startDates[-1], freq))
        
    else:  
        #breakAfterNext = False
        lastEndDate = pytz.utc.localize(datetime.datetime.now() + relativedelta(years=yearsUntilMortality))
        i = 1
        while True:
            endDate = next_date(startDates[i - 1], freq)
            i += 1
            endDates.append(endDate)
            startDates.append(endDate)            
            
            #if breakAfterNext: 
            #    break 
            
            if endDate >= lastEndDate:
                break
                #breakAfterNext = True
            
            
        endDates.append(next_date(startDates[-1], freq))

    return startDates, endDates

# https://towardsdatascience.com/timestamp-vs-timedelta-vs-time-period-afad0a48a7d1
def fillDates(goal, yearsUntilMortality, birthDate):
    when = goal["when"]
    freq = goal["goalFrequency"]
    
    if (when == "date"):
        startDate = parseDate(goal.get("date"))       

    elif (when == "dateRange"):
        # TODO: do I want to use some sort of range object here?
        #startDate = [parseDate(goal.get("dateRange")[0]), parseDate(goal.get("dateRange")[0])]
        startDate = parseDate(goal.get("dateRange")[0])

    elif (when == "age"):
        when_age = goal["age"]
        dob = parseDate(birthDate)
        delta = relativedelta(years=when_age)
        startDate = dob + delta 

    #print(fillDatesHelper(goal, startDate, "monthly", 65))
        
    return fillDatesHelper(goal, startDate, freq, yearsUntilMortality)

"""
Toy example:
    age: 20
    dob: Fri Jan 25 2001
    when_age: 40 
    
"""
def getMonthlySavingsRequiredForShortfall(final_rate, nper, pv, funded_amount):
    """    
    Parameters
    ----------
    final_rate : TYPE
        DESCRIPTION.
    actual_rate : TYPE
        DESCRIPTION.
    pv : TYPE
        DESCRIPTION.
    funded_amount : TYPE
        DESCRIPTION.

    Returns
    -------
    TYPE
        Given: Pmt(rate, nper, pv, [fv], [type])
        
        Trying to calculate Pmt(Final_rate / 12, 
                                incomeGoalSheet.Cells(iLRIncGoals, 11) * 12,
                                0,
                                -AllocAmount + fundedAmount)
        per spread sheet macro 

    """
    #npf.pmt(rate, nper, pv, fv, when="end")
    #npf.pmt(final_rate/12, actualRate[i] * 12, 0, -pv + fundedAmount)
    return npf.pmt(final_rate/12, nper*12, 0, -pv + funded_amount)
    
def getRatesAndPortfolios(goal, cpi, timesTillStartDate, actualRateTable, portfolios, portfolioAmount):
    estimateType = goal["estimateType"]
    pfTerms = list(portfolios.keys())
    pfTerms.sort() 
    rates, pfNames, yearFloats, presentValues, portfolioAmounts, portfolioAmountsRemaining, funded, fundedAmount, monthlySavingsRequired = [], [], [], [], [], [], [], [], []
    n = 0
    portfolioAmountRemaining = portfolioAmount 
    goalCost = goal["estimatedCost"]
    
    # TODO: for testing purposes:
    #yearFloats = [ 0.67 + i for i in range(29)]
    #yearFloats = timesTillStartDate 
   
    for time in timesTillStartDate:     
        # TODO: make this more accurate: 
        #lastTime = timesTillStartDate[n-1]
        #yearFloat = float(lastTime.years if lastTime.years else 0) + float(lastTime.months/12 if lastTime.months else 0) + float(lastTime.days/30.5/12 if lastTime.days else 0)        

        yearFloat = float(time.years if time.years else 0) + float(time.months/12 if time.months else 0) + float(time.days/30.5/12 if time.days else 0)        
        #yearFloat = yearFloats[n]
        #n+=1 

        _year = floor(yearFloat)
        yearFloats.append(yearFloat)
        if (yearFloat < 0): yearFloat = 0
        if (_year < 0): _year = 0
        rate = actualRateTable["actualRate"][_year] 
        rates.append(rate)
        pfNames.append(actualRateTable["assignedPortfolio"][_year])
        
        #npf.fv(rate, nper, pmt, pv, when)
        if (estimateType == "FV"):
            fv = goalCost        
        else:
            fv = npf.fv(cpi, yearFloat, 0, goalCost)*-1    
        
        #npf.pv(rate, nper, pmt, fv, when)     
        #if n != 0:
        #    pv = npf.pv(rate, yearFloat, 0, -fv)  
        if len(timesTillStartDate) == 1:
            pv = npf.pv(rate, yearFloat, 0, -fv) 
        else:
            pv = npf.pv(rate, yearFloat, 0, -fv)
            
        presentValues.append(pv)       
        portfolioAmounts.append(portfolioAmountRemaining)
        
       

        if (portfolioAmountRemaining - pv >= 0):
            funded.append(1)
            fundedAmount.append(pv)
            monthlySavingsRequired.append(0)
            #portfolioAmountRemaining -= pv 
            #portfolioAmountsRemaining.append(portfolioAmountRemaining)
            
        elif (portfolioAmountRemaining <= 0):
            funded.append(0)
            fundedAmount.append(0)
            
            msr = getMonthlySavingsRequiredForShortfall(
                rate,    # final_rate,
                yearFloat,
                pv,
                0)
            
            monthlySavingsRequired.append(msr)
            #portfolioAmountRemaining -= pv 
            #portfolioAmountsRemaining.append(portfolioAmountRemaining)
            
        else:
            fundedPercent = portfolioAmountRemaining / pv
            fundedAmt = portfolioAmountRemaining
            portfolioAmountRemaining = 0
            funded.append(fundedPercent)
            fundedAmount.append(fundedAmt)
            msr = getMonthlySavingsRequiredForShortfall(
                rate,  # final_rate,
                yearFloat,
                pv,
                fundedAmt)                    
            monthlySavingsRequired.append(msr)
            
        portfolioAmountRemaining -= pv 
        portfolioAmountsRemaining.append(portfolioAmountRemaining)
                            
        n += 1             
        
    #print(rates)
    #print(monthlySavingsRequired)
    
    return rates, pfNames, yearFloats, presentValues, portfolioAmounts, portfolioAmountsRemaining, funded, fundedAmount, monthlySavingsRequired, portfolioAmountRemaining

def calculateTimeDeltaRatio(d1, d2):
    """
    d1 = datetime.datetime(2021, 9, 20)
    d2 = datetime.datetime(2022, 5, 1)
    td = d2 - d1
    print(td.total_seconds()/datetime.timedelta(days=365.25).total_seconds())
    """ 
    td = d1 - d2
    return (td.total_seconds()/datetime.timedelta(days=365.25).total_seconds())
    

def calculateGoalTables(goals, portfolioAmount, yearsUntilMortality, assumptions, clientData, actualRateTable, portfolioTerms):
    portfolioAmountRemaining = portfolioAmount 
    tables = []
    cpi = assumptions["CPI"]     
    
    for i in range(1, len(goals)+1):
        goal = goals[i]
        #print(goal)
   
        # Create date columns:
        startDates, endDates = fillDates(goal, yearsUntilMortality, clientData["primary"]["dateOfBirth"])

        #now = pytz.utc.localize(datetime.datetime.now())
        
        now = datetime.datetime.now()

        #timesTillStartDate = [ datetime.timedelta(startDate, now) for startDate in startDates ]
        timesTillStartDate = [ relativedelta(startDate, now) for startDate in startDates ]

        #_startDatesCopy = startDates.copy()
        #_startDatesCopy.append(endDates[-1])        
        #timesTillStartDate = [ relativedelta(startDate, now) for startDate in _startDatesCopy ]
        
        #timesTillStartDate = [ relativedelta(pytc.utc.localize(startDate), now) for startDate in startDates ]       
        
        # Probably more accurate:               
        # _timesTillStartDate = [ 
        #     calculateTimeDeltaRatio(d, now) 
        #         for d in startDates
        #         ]

        #print("BETTER DATES ?")
        #print(_timesTillStartDate)

        #print("USING THESE DATES")
        #print(timesTillStartDate)
        
        #numPeriods = len(timesTillStartDate)       
        # futureValues = np.fromiter(
        #     (npf.fv(cpi, i, 0, goal["estimatedCost"], when={"begin": 1})*-1 
        #             for i in range(numPeriods)),
        #     float
        #     )
        
        #print("ABOUT TO DO A GOAL")
        #print(portfolioAmountRemaining)
        """ USAGE: (goal, cpi, timesTillStartDate, actualRateTable, portfolios, portfolioAmount)"""
        rates, pfNames, yearFloats, presentValues, portfolioAmounts, portfolioAmountsRemaining, funded, fundedAmount, monthlySavingsRequired, portfolioAmountRemaining = getRatesAndPortfolios(
            goal,
            cpi,
            timesTillStartDate,
            actualRateTable,
            portfolioTerms,
            portfolioAmountRemaining,
            )

        priority = [i for j in range(len(startDates))]        
        table_data = list(zip(startDates, endDates, yearFloats, rates, presentValues, pfNames, portfolioAmounts, portfolioAmountsRemaining, funded, fundedAmount, monthlySavingsRequired, priority))
        
        
        table = pd.DataFrame(
            table_data,
            columns=["Start Date",
                     "End Date",                
                     "Years to Start Date",
                     "Rate",
                     "Allocation Now",
                     "Portfolio",
                     "Portfolio Amount",
                     "Portfolio Amount Remaining",
                     "Funded", 
                     "Funded Amount", 
                     "Monthly Savings Required",
                     "priority" ]
            )
        tables.append(table)
        
       
        """
        data = []
        for a, b, c in some_function_that_yields_data():
          data.append([a, b, c])

        df = pd.DataFrame(data, columns=['A', 'B', 'C'])
        """
    return tables
    

    
def getOverallFundPercentFromTables(goalTables):
    fundedPercents = []
    for i in range(len(goalTables)):
        totalRequired = goalTables[i]["Allocation Now"].sum()
        totalFunded = goalTables[i]["Funded Amount"].sum()
        fundPercent = totalFunded / totalRequired
        fundedPercents.append(fundPercent)
    return fundedPercents

def calculateGoalsAllocations(assumptions, behaviourGrowthRate, goals, portfolios, clientData, portfolioValue, portfolioName):   
    assumptions = extractRelevantAssumptions(assumptions, behaviourGrowthRate)

    # Might need to look at whose goal this is... 
    yearsUntilMortality = assumptions.get("yearsUntilMortalityPrimary")
    yearsUntilMortalityForYoungestPartner = assumptions.get("yearsUntilMortalityForYoungestPartner")
    yearsUntilMortalityPartner = assumptions.get("yearsUntilMortalityPartner")
    
    # print(assumptions)  
    # print(yearsUntilMortality)
    # print(yearsUntilMortalityForYoungestPartner)
    # print(yearsUntilMortalityPartner)
    
    pf = getPortfolioRate(portfolios)

    useYears = 150  

    actualRateTable = calculateActualRateTable(
        portfolios, 
        assumptions["behaviourGrowthRate"], 
        assumptions["behaviourModificationLoading"],
        useYears
        )
    
    reshapedGoals = reshapeGoals(goals)
    print("--- RESHAPED GOALS ---")
    print(reshapedGoals)
    
    # TODO: ensure every goal has a priority, 1 - n 
    if not reshapedGoals: return { "error": "Goal Priorities NOT SET"}
    try:
        for i in range(1, len(reshapedGoals)+1):
            reshapedGoals[i]
    except:
        print("--- GOAL PRIORITIES NOT SET ---")
        return { "error": "Goal Priorities Incorrectly Set"}
    
    goalTables = calculateGoalTables(reshapedGoals, portfolioValue, useYears, assumptions, clientData, actualRateTable, pf)
    goalOverallFundedPercent = getOverallFundPercentFromTables(goalTables)
    goalTablesJSON = list(map(lambda el: el.to_json(), goalTables))

    import pprint 
    pp = pprint.PrettyPrinter(indent=4)
    print("----")
    print(portfolioName)
    print(goalOverallFundedPercent)
    for goalTable in goalTables:
        #print(goalTable.to_markdown())
        pp.pprint(goalTable.to_dict())
    print("----")
    return portfolioName, goalTablesJSON, goalOverallFundedPercent

    return goalTables, goalOverallFundedPercent
    




# res = calculateGoalsAllocations(
#     assumptions,
#     5.9735,
#     goals,
#     portfolios,
#     clientData,
#     1000000
#     )




#def performGoalAllocations(assumptions, behaviourGrowthRate, portfolios, clientData, assignedGoals):
#    return [calculateGoalsAllocations(assumptions, behaviourGrowthRate, goals, portfolios, clientData, portfolioValue)
#             for [portfolioValue, portfolioName], goals in assignedGoals.items()]

def performGoalAllocations(assumptions, behaviourGrowthRate, portfolios, clientData, assignedGoals):
    return [calculateGoalsAllocations(assumptions, behaviourGrowthRate, goals, portfolios, clientData, portfolioValue, portfolioName)
        for [portfolioValue, portfolioName, goals] in assignedGoals]


res2 = performGoalAllocations(assumptions, 5.9735, portfolios, clientData, shapedGoals)

"""
pf = getPortfolioRate(portfolios)
terms = list(pf.keys())
terms.sort() 
idx = getIndex(terms, 1)
#print(pf[])
goal_date = parseDate(goals["0"]["date"])
next_goal = next_date(goal_date, "yearly")
"""

"""
d1 = datetime.datetime(2021, 9, 20)
d2 = datetime.datetime(2022, 5, 1)
td = d2 - d1
print(td.total_seconds()/datetime.timedelta(days=365.25).total_seconds())
"""


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

    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    try: 
      body = json.loads(event.get("body"))

      # Check body.func === goals : body.func === insurance.

      
      #print("body loaded successfully from event");
      allDataProvided = reduce(
        lambda x, y: x and y, 
        map(lambda x: body.keys().__contains__(x), ["clientData", "behaviouralRate", "portfolios", "clientData", "assignedGoals"])
        )
      #print(allDataProvided)

      if (allDataProvided):
        a = body.get("assumptions")
        br = body.get("behaviouralRate")
        pfs = body.get("portfolios")
        cd = body.get("clientData")
        ag = body.get("assignedGoals")

        print(a)
        print(br)
        print(pfs)
        print(cd)
        print(ag)

        try: 
          results = performGoalAllocations(a, br, pfs, cd, ag)
          return  {"statusCode": 200, "body": json.dumps(results) }

        except BaseException as e:
          #return { "statusCode": 500, "body": json.dumps({"error": str(e)})}
          results = calculateGoalsAllocations(
                    assumptions,
                    5.9735,
                    goals,
                    portfolios,
                    clientData,
                    1000000
                    )
          return {"statusCode": 200, "body": json.dumps(results) }

      else: 
        results = calculateGoalsAllocations(
                assumptions,
                5.9735,
                goals,
                portfolios,
                clientData,
                1000000
                )

        return {"statusCode": 200, "body": json.dumps(results) }

    except BaseException as e:
      return { "statusCode": 500, "body": json.dumps({"error": str(e)})}
   
    # return {
    #     "statusCode": 200,
    #     "body": json.dumps(res),
    # }
"""
pf = getPortfolioRate(portfolios)
terms = list(pf.keys())
terms.sort() 
idx = getIndex(terms, 1)
#print(pf[])
goal_date = parseDate(goals["0"]["date"])
next_goal = next_date(goal_date, "yearly")
"""

"""
d1 = datetime.datetime(2021, 9, 20)
d2 = datetime.datetime(2022, 5, 1)
td = d2 - d1
print(td.total_seconds()/datetime.timedelta(days=365.25).total_seconds())
"""