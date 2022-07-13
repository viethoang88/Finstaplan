import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { maxCoverBody } from "./response-table";
import { valueFormatter } from "../../../../helpers/util";

const priceTemplate = (rowData, props) => {
  const field = props?.field;
  const price = rowData[field];
  return valueFormatter(price);
};

const ComparisonTable = ({ cols, data, clientName }) => {
  if (data === undefined || data === null || data?.length === 0) return null;
  return (
    <DataTable
      header={
        <div className="p-d-flex p-jc-between">{`Insurance Quotes for ${clientName}`}</div>
      }
      dataKey="id"
      value={data}
    >
      {cols.map(({ field, header }) => {
        switch (field) {
          case "maxCoverOffered":
            return (
              <Column
                field={field}
                key={field}
                header={header}
                body={maxCoverBody}
                sortable
              />
            );
          case "coverRequired":
            return (
              <Column
                field={field}
                key={field}
                header={header}
                body={priceTemplate}
              />
            );
          case "underwriterCompany":
            return (
              <Column field={field} key={field} header={header} sortable />
            );

          default:
            return <Column field={field} key={field} header={header} />;
        }
      })}
    </DataTable>
  );
};

export default ComparisonTable;
