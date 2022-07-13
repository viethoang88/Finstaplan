class Formulae {
  static _valueIsNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  static getNPV(P, r, g, n) {
    const lhs = P / (r - g);
    const inflation = 1 + g;
    const growth = 1 + r;
    return lhs * (1 - (inflation / growth) ** n);
  }

  static getNPVoverArray(rate, initialCost, cashFlows) {
    return cashFlows.reduce((acc, next, idx) => {
      return acc + next / Math.pow(rate / 100 + 1, idx);
    }, 0);
  }
  // using python and numpy:
  // static getNpvOverArray2(rate, values) {
  //   return (values / (1+rate)**np.arange(0, len(values))).sum(axis=0)
  // }

  static futureValueAnnuity(payment, rate_per_period, number_of_periods) {
    //https://www.investopedia.com/retirement/calculating-present-and-future-value-of-annuities/
    if (
      Formulae._valueIsNumber(payment) &&
      Formulae._valueIsNumber(rate_per_period) &&
      Formulae._valueIsNumber(number_of_periods)
    ) {
      return (
        Number(
          payment *
            (1 + rate_per_period) *
            ((Math.pow(1 + rate_per_period, number_of_periods) - 1) /
              rate_per_period)
        ) || 0
      );
    } else {
      throw new TypeError(
        `Arguments should be numbers, got ${payment} ~ ${rate_per_period} ~ ${number_of_periods}`
      );
    }
  }

  static presentValueAnnuity(payment, rate_per_period, number_of_periods) {
    //http://financeformulas.net/Present_Value_of_Annuity.html
    if (
      Formulae._valueIsNumber(payment) &&
      Formulae._valueIsNumber(rate_per_period) &&
      Formulae._valueIsNumber(number_of_periods)
    ) {
      return (
        Number(
          payment *
            ((1 - Math.pow(1 + rate_per_period, -number_of_periods)) /
              rate_per_period)
        ) || 0
      );
    } else {
      throw new TypeError(
        `Arguments should be numbers, got ${payment} ~ ${rate_per_period} ~ ${number_of_periods}`
      );
    }
  }

  static compoundInterest(starting_value, rate_per_period, number_of_periods) {
    if (
      Formulae._valueIsNumber(starting_value) &&
      Formulae._valueIsNumber(rate_per_period) &&
      Formulae._valueIsNumber(number_of_periods)
    ) {
      return (
        Number(
          starting_value * Math.pow(1 + rate_per_period, number_of_periods)
        ) || 0
      );
    } else {
      throw new TypeError(
        `Arguments should be numbers, got\
                 ${starting_value} ~ ${rate_per_period}\
                 ~ ${number_of_periods}`
      );
    }
  }

  static presentValue(future_value, rate_per_period, number_of_periods) {
    if (
      Formulae._valueIsNumber(future_value) &&
      Formulae._valueIsNumber(rate_per_period) &&
      Formulae._valueIsNumber(number_of_periods)
    ) {
      return (
        Number(future_value / (1 + rate_per_period) ** number_of_periods) || 0
      );
    } else {
      throw new TypeError(
        `Arguments should be numbers, got\
                 ${future_value} ~ ${rate_per_period}\
                 ~ ${number_of_periods}`
      );
    }
  }

  static growingAnnuityPayment(
    payment,
    rate_per_period,
    growth_rate,
    number_of_periods
  ) {
    //http://www.financeformulas.net/Growing-Annuity-Payment.html
    if (
      Formulae._valueIsNumber(payment) &&
      Formulae._valueIsNumber(rate_per_period) &&
      Formulae._valueIsNumber(growth_rate) &&
      Formulae._valueIsNumber(number_of_periods)
    ) {
      return (
        payment *
          ((1 -
            ((1 + growth_rate) / (1 + rate_per_period)) ** number_of_periods) /
            (rate_per_period - growth_rate)) || 0
      );
    } else {
      throw new TypeError(
        `Arguments should be numbers, got
                 payment ${payment} ~ rpp ${rate_per_period}
                 gr ${growth_rate} ~ np ${number_of_periods}`
      );
    }
  }
}

export default Formulae;
