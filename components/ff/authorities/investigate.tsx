import SimpleCrudTable from "../../ui/simple-crud-table";

const Investigate = ({ cols, emptyPlan, target }) => {
  return (
    <>
      <div>
        <h3>Authority to investigate with various companies</h3>
        <p>To whom it may concern,</p>
        <p>
          I/we authorise you to release all relevant information on my/our
          superannuation, investments, insurances, bank accounts or other
          financial, family business, trust or estate information, to the third
          parties listed including my financial planner and staff members of the
          company named, to access information about my/our account.
        </p>
      </div>
      <br />
      <br />
      <div>
        <h4>Please provide the following information:</h4>
        <br />
        {/* TABLE with: 
                   Financial Planner Name,
                   Staff members
                   Address 
                   Email Address 
                   Phone number 
                   Logo?
              */}
        <SimpleCrudTable
          type={"Details"}
          id={target}
          //data={testData}
          cols={cols}
          empty={emptyPlan}
          canCreate
          canDelete
          stripedRows={true}
          selectionMode={"checkbox"}
          storeNestedPath={[target, "authorities"]}
        />
      </div>
    </>
  );
};

export default Investigate;
