import { useState } from "react";
import ConfigureBenchmarking from "./benchmarking/benchmarking-configure/configure-benchmarking";
import ConfigureBenchmarkingWeightings from "../advisor/benchmarking/benchmarking-configure/configure-benchmarking-weightings";
import { TabView, TabPanel } from "primereact/tabview";
import SimpleCrudTable from "../ui/simple-crud-table";
import AdvisorLayout from "../ui/adviser-layout";
import Assumptions from "./assumptions";
import Philosophies from "./philosophies";
import LicenseeAllocation from "./licensee-allocation";
import FixedBands from "./fixed-bands";
import {
  authSliceActions,
  fetchData,
  updateAllPortfolioReliantData,
} from "../../store/auth";
import { useSelector, useDispatch } from "react-redux";

import {
  testData,
  portfolioCols,
  // assumptionsCols,
  // philosophies,
  emptyPortfolio,
} from "./dummy_variables";
import { useEffect } from "react";
import InsuranceUnderwriters from "./insurance-underwriters";
import Funds from "./funds";

// template: (options) => {
// options.className: Style class of the default header element.
// options.titleClassName: Style class of the title element.
// options.onClick: Click event for the header element.
// options.leftIconElement: Default left icon element created by the component.
// options.titleElement: Default title element created by the component.
// options.rightIconElement: Default right icon element created by the component.
// options.element: Default element created by the component.
// options.props: component props.
// options.index: The index of tab.
// options.selected: Whether the panel is selected.
// options.ariaControls: The value of aria-controls property.
// };
const template = (options) => {};

const ConfigureVariables = (props) => {
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [tempPortfolios, setTempPortfolios] = useState();
  const [dontForceRerender, setDontForceRerender] = useState(true);
  const { assumptions, philosophies, benchmarking } = testData;

  const portfolios = useSelector((state) => state.auth.portfolios);

  useEffect(() => {
    if (portfolios === undefined) {
      dispatch(fetchData());
    }
  }, []);

  useEffect(() => {
    if (portfolios === undefined) return;
    dispatch(updateAllPortfolioReliantData(portfolios));
    if (dontForceRerender) {
      setDontForceRerender(false);
      setTimeout(() => {
        setDontForceRerender(true);
      }, 200);
    }
  }, [portfolios]);

  return (
    <AdvisorLayout>
      <div>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* <TabPanel header="Header"headerTemplate={template}> */}

          <TabPanel header="Portfolios">
            {portfolios !== undefined && (
              <SimpleCrudTable
                data={portfolios !== undefined ? portfolios : []}
                type="Portfolios"
                id="portfolios"
                empty={emptyPortfolio}
                cols={portfolioCols}
                addClasses="p-datatable-sm p-datatable-striped"
                storeSlice="auth"
                actionsToUse={authSliceActions}
                useSaveRevert={true}
                selectionMode={"checkbox"}
                setParentTempStore={setTempPortfolios}
              />
            )}
            <br />
            <br />
            <br />
            {portfolios !== undefined && dontForceRerender && (
              <LicenseeAllocation />
            )}
            <br />
            <br />
            <br />
            {portfolios !== undefined && dontForceRerender && <FixedBands />}
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </TabPanel>
          <TabPanel header="Fund Allocator">
            <Funds portfolios={portfolios} />
          </TabPanel>
          <TabPanel header="Assumptions">
            <Assumptions data={assumptions} />
            <br />
            <br />
            <br />
          </TabPanel>

          <TabPanel header="Philosophies">
            <Philosophies
              header={"Requirements"}
              data={philosophies.requirements}
              segment={"requirements"}
              authSlice={["philosophies", "requirements"]}
            />
            <br />
            <Philosophies
              header={"Offsets"}
              data={philosophies.offsets}
              segment={"offsets"}
              authSlice={["philosophies", "offsets"]}
            />
            <br />
            <Philosophies
              header={"Stepped vs. Level Insurance"}
              data={philosophies.steppedVsLevel}
              segment={"steppedVsLevel"}
              authSlice={["philosophies", "steppedVsLevel"]}
            />
            <br />
          </TabPanel>
          <TabPanel header="Benchmarking KPIs">
            <ConfigureBenchmarking />
          </TabPanel>
          <TabPanel header="Benchmarking Weightings">
            <ConfigureBenchmarkingWeightings />
          </TabPanel>
          <TabPanel header="Insurance Underwriters">
            <InsuranceUnderwriters />
          </TabPanel>
        </TabView>
      </div>
    </AdvisorLayout>
  );
};

export default ConfigureVariables;
