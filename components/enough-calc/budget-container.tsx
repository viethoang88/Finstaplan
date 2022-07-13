import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBalanceScale,
  faTable,
  faPlusSquare,
  faMinusSquare,
  faBalanceScaleLeft,
  faBalanceScaleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import classes from "./budget-container.module.css";
import BudgetList from "./budget-list";

const tabIconStyles = {
  fontSize: "1.5rem",
  maxWidth: "1.6rem",
  maxHeight: "1.6rem",
  marginRight: ".95rem",
  position: "relative",
  top: ".15rem",
};

const incomeHeader = (
  <span>
    Incomes&nbsp;&nbsp;{" "}
    <FontAwesomeIcon icon={faPlusSquare} style={tabIconStyles} />
  </span>
);
const expenseHeader = (
  <span>
    Expenses&nbsp;&nbsp;
    <FontAwesomeIcon icon={faMinusSquare} style={tabIconStyles} />
  </span>
);
const assetsHeader = (
  <span>
    Assets&nbsp;&nbsp;
    <FontAwesomeIcon icon={faBalanceScaleLeft} style={tabIconStyles} />
  </span>
);
const liabilitiesHeader = (
  <span>
    Liabilities&nbsp;&nbsp;
    <FontAwesomeIcon icon={faBalanceScaleRight} style={tabIconStyles} />
  </span>
);

const BudgetContainer = ({ incomes, expenses, assets, liabilities }) => {
  return (
    <>
      <Card style={{ margin: "2rem" }}>
        <TabView
        // activeIndex={activeIndex}
        // onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel
            header={incomeHeader}
            contentClassName={classes.container_tab}
          >
            <BudgetList data={incomes} />
          </TabPanel>
          <TabPanel
            header={expenseHeader}
            contentClassName={classes.container_tab}
          >
            <BudgetList data={expenses} />
          </TabPanel>
          <TabPanel
            header={assetsHeader}
            contentClassName={classes.container_tab}
          >
            <BudgetList data={assets} />
          </TabPanel>
          <TabPanel
            header={liabilitiesHeader}
            contentClassName={classes.container_tab}
          >
            <BudgetList data={liabilities} />
          </TabPanel>
        </TabView>
      </Card>
    </>
  );
};

export default BudgetContainer;
