import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./budget-summary.module.css";
import { valueFormatter } from "../../../helpers/util";
import DataManager from "../../../classes/DataManager";
import { Button } from "primereact/button";

const buttonStyles = {
  fontSize: ".75rem",
  //   height: ".95rem",
  //   width: "1.45rem",
};

const BudgetSummary = ({ type, incoming, outgoing }) => {
  const [isOpen, setIsOpen] = useState(true);
  const inWord = type === "budget" ? `Incomes` : "Assets";
  const outWord = type !== "budget" ? "Liabilities" : "Expenses";

  const appData = useSelector((state) => state.factFind);
  const _incDataPrimary = useSelector(
    (state) => state.factFind?.primary?.[incoming]
  );
  const _incDataPartner = useSelector(
    (state) => state.factFind?.partner?.[incoming]
  );
  const _incDataJoint = useSelector(
    (state) => state.factFind?.joint?.[incoming]
  );

  const _outDataPrimary = useSelector(
    (state) => state.factFind?.primary?.[outgoing]
  );
  const _outDataPartner = useSelector(
    (state) => state.factFind?.partner?.[outgoing]
  );
  const _outDataJoint = useSelector(
    (state) => state.factFind?.joint?.[outgoing]
  );

  const dm = useMemo(() => {
    return new DataManager(appData);
  }, [
    _incDataPrimary,
    _incDataPartner,
    _incDataJoint,
    _outDataPrimary,
    _outDataPartner,
    _outDataJoint,
  ]);

  const _in = dm.getAggregateSumForSomeCategory(incoming);
  const _out = dm.getAggregateSumForSomeCategory(outgoing);
  const total = _in - _out;

  // layout math:
  const addedValues = _in + _out;
  const displayTotal = valueFormatter(total);
  const inWidth = (_in / addedValues) * 40 + 14;
  const outWidth = (_out / addedValues) * 40 + 14;

  return (
    <div className={classes.outer_container}>
      <div className={classes.container}>
        <div className={classes.bar}>
          <div className={classes.in} style={{ width: `${inWidth}rem` }}>
            Total&nbsp;{inWord}: <br /> {valueFormatter(_in)}
          </div>
          <div className={classes.out} style={{ width: `${outWidth}rem` }}>
            Total&nbsp;{outWord}: <br />
            {valueFormatter(_out)}
          </div>
        </div>
        <div className={classes.total}>
          {total > 0 ? (
            <i
              className="pi pi-sort-amount-up"
              style={{ color: "#1ea97c", marginRight: "0.55rem" }}
            ></i>
          ) : (
            <i
              className="pi pi-sort-amount-down-alt"
              style={{ color: "#ff5757", marginRight: "0.55rem" }}
            ></i>
          )}
          {total > 0 ? "Surplus:" : "Shortfall:"} {displayTotal}
          <div className={classes.button}>
            {!isOpen ? (
              <Button
                icon="pi pi-chevron-right"
                className="p-button-rounded p-button-success p-button-text"
                aria-label="Open"
              />
            ) : (
              <Button
                icon="pi pi-chevron-left" // pi-times
                className="p-button-rounded p-button-danger p-button-text"
                aria-label="Close"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;

//   <div className={classes.bar}>
//        <div className={classes.in} style={{ width: inWidth }}>
//           {inWord}: {valueFormatter(_in)}
//         </div>
//         <div className={classes.out} style={{ width: outWidth }}>
//           {outWord}: {valueFormatter(_out)}
//         </div>
//       </div>

//       <div>
//         {total > 0 ? "Surplus:" : "Shortfall:"} {displayTotal}
//       </div>
//       </div>

// <div className={classes.button}>
// <i
//   className="pi pi-chevron-right"
//   style={{ preserveAspectRatio= 'none', fontSize: "4rem", height: "5rem", width: ".25rem" }}
// ></i>
//   </div>
// </div>
