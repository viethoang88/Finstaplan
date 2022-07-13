import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const WeightingSums = ({
  allocationSumTemplate,
  summedColumns,
  cols,
  sumFields,
  paddingColWidth = "7%",
}) => {
  console.log("-----IN WEIGHTING SUMS ------");
  console.log(allocationSumTemplate);
  console.log(summedColumns);
  console.log(cols);
  console.log(sumFields);

  return (
    <div className="card">
      <DataTable
        className={`editable-cells-table p-datatable-sm p-datatable-striped`}
        value={summedColumns}
      >
        <Column
          field="padding"
          key="padding"
          style={{ width: paddingColWidth }}
        ></Column>
        {cols.map((c) => {
          if (sumFields.includes(c.field)) {
            return (
              <Column
                body={allocationSumTemplate}
                key={c.field}
                field={c.field}
                style={{ width: "30rem" }}
              ></Column>
            );
          } else {
            return (
              <Column
                field={c.field}
                key={c.field}
                style={{ width: "35rem" }}
              ></Column>
            );
          }
        })}
      </DataTable>
      <br />
    </div>
  );
};

export default WeightingSums;
