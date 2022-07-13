// CLIENT
// - name
// - birth date
// - desired retirement age
// - partner
// - partner age

// - ASSETS and LIABILITIES - can name a new item and add to any section below.

// LIABILITIES
// - Repayable (YES OR NO) => interest (%), monthly repayment

// 1) General: credit card balance, bank overdraft
// 2) Loans: Motor vehicle, personal, investment, retail store card, investment property

// ASSETS
// - Managed (YES OR NO):
// - CAN have an associated:
//   - liability (mortgage) and/or
//   - income and/or
//   - expense

// 1) cash
// - bank account
// - term deposits

// 2) personal property
// - vehicles
// - trailer/boat/caravan
// - home contents
// - jewellery
// - art / antiques

// 3) superannuation / pension

// 4) real estate
// - family home
// - holiday home
// - investment properties

// 5) other investments
// - fixed interest investments
// - shares
// - money owed to you
// - managed investments
// - margin loan investment

// BUDGET: each item has a Frequency (Monthly, Quarterly, Bi-Annually, Annually)
// 1) Personal:
// - Salary & Overtime
// - Bonus
// - Commission
// - Government Pensions and Allowances
// - Other (child support, gifts, etc.)

// 2) Investment
// - Interest, dividends, etc.
// - Rental Income(s)

// 3) Expenses (lots of possible expenses)
import { useState } from "react";
import UserInfoMenus from "./user-info-menus/people";
import UserInfoCanvas from "./user-info-canvas";
import UserValues from "./user-values";
import UserGoals from "./user-goals";
import UserInfoForm from "./user-info-form/user-info-form";
import UserInfoBackground from "./user-info-background";
import Tree from "./family-tree/tree";

import classes from "./user-info.module.css";

const UserInfo = (props) => {
  const { showForm } = props;

  return (
    <div>
      {/* <div className={classes.family_tree}>
          <Tree />
        </div> */}

      {/* // TODO:  */}
      {showForm && <UserInfoForm />}
    </div>
  );
};

export default UserInfo;
