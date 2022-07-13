// import ReactDataSheet from "react-datasheet";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const grid = [
  [{ value: 1 }, { value: 3 }],
  [{ value: 2 }, { value: 4 }],
];

const dummy_data = [
  {
    header: "Income & Expenses",
    data: [
      {
        id: "1000",
        for: "Total",
        life: "$4,112,621",
        tpd: "$5,429,619",
        trauma: "$107,568",
        ip: "$68,727",
      },
      {
        id: "1001",
        for: "Family Living Expenses",
        life: "$2,233,259",
        tpd: "$2,233,259",
        trauma: "",
        ip: "",
      },
      {
        id: "1002",
        for: "Children's Education",
        life: "$1,378,862",
        tpd: "$1,378,862",
        trauma: "",
        ip: "",
      },
      {
        id: "1003",
        for: "Extra Help Required",
        life: "",
        tpd: "$1,316,998",
        trauma: "",
        ip: "",
      },
      {
        id: "1004",
        for: "Replacement Income",
        life: "",
        tpd: "",
        trauma: "$45,818",
        ip: "$68,727",
      },
      {
        id: "1005",
        for: "Spouse Income Loss",
        life: "$61,750",
        tpd: "$61,750",
        trauma: "$61,750",
        ip: "",
      },
    ],
  },
  {
    header: "Liabilities",
    data: [
      {
        id: "1000",
        for: "Total",
        life: "$90,100",
        tpd: "$90,100",
        trauma: "$15,015",
        ip: "",
      },
      {
        id: "1001",
        for: "Car Finance Loan",
        life: "$10,000",
        tpd: "$10,000",
        trauma: "$3,000",
        ip: "",
      },
      {
        id: "1002",
        for: "Residential Mortgage",
        life: "$80,100",
        tpd: "$80,100",
        trauma: "$12,015",
        ip: "",
      },
    ],
  },
  {
    header: "Lump Sum Requirements",
    data: [
      {
        id: "1000",
        for: "Total",
        life: "",
        tpd: "$380,000",
        trauma: "$200,000",
        ip: "",
      },
      {
        id: "1001",
        for: "Medical Requirements",
        life: "",
        tpd: "$200,000",
        trauma: "$200,000",
        ip: "",
      },
      {
        id: "1002",
        for: "Change of Housing / Car",
        life: "",
        tpd: "$180,000",
        trauma: "",
        ip: "",
      },
    ],
  },
  {
    header: "Total Requirements Before Offsets",
    data: [
      {
        id: "1000",
        for: " ",
        life: "$4,202,721",
        tpd: "$5,899,719",
        trauma: "$322,583",
        ip: "$68,727",
      },
    ],
  },
  {
    header: "Offsets",
    data: [
      {
        id: "1000",
        for: "Total",
        life: "$3,950,888",
        tpd: "$8,665,661",
        trauma: "$168,680",
        ip: "",
      },
      {
        id: "1001",
        for: "Investment Property",
        life: "$191,250",
        tpd: "$191,250",
        trauma: "",
        ip: "",
      },
      {
        id: "1002",
        for: "Non-cash Investments",
        life: "$206,530",
        tpd: "$206,530",
        trauma: "$121,489",
        ip: "",
      },
      {
        id: "1003",
        for: "Pension (Cecille)",
        life: "$115,721",
        tpd: "$115,721",
        trauma: "",
        ip: "",
      },
      {
        id: "1004",
        for: "Income Protector",
        life: "",
        tpd: "$1,324,577",
        trauma: "",
        ip: "",
      },
      {
        id: "1005",
        for: "Income (Cecille)",
        life: "$3,390,196",
        tpd: "$6,780,392",
        trauma: "",
        ip: "",
      },
      {
        id: "1006",
        for: "Incomes (Other)",
        life: "$47,191",
        tpd: "$47,191",
        trauma: "$47,191",
        ip: "",
      },
    ],
  },
  {
    header: "Net Requirements",
    data: [
      {
        id: "1000",
        for: "Income Requirements",
        life: "$4,112,621",
        tpd: "$5,429,619",
        trauma: "$107,568",
        ip: "$68,727",
      },
      {
        id: "1001",
        for: "Liabilities & Other Lump Sums",
        life: "$90,100",
        tpd: "$470,100",
        trauma: "$215,015",
        ip: "",
      },
      {
        id: "1002",
        for: "Offsets",
        life: "$(3,950,888)",
        tpd: "$(8,665,661)",
        trauma: "$153,904",
        ip: "$68,727",
      },
      {
        id: "1003",
        for: "Total Requirements",
        life: "$251,832",
        tpd: "$(2,765,942)",
        trauma: "$(2,765,942)",
        ip: "$68,727",
      },
      {
        id: "1004",
        for: "Total Minimum Requirements",
        life: "$1,050,680",
        tpd: "$1,474,930",
        trauma: "$153,904",
        ip: "$68,727",
      },
    ],
  },
];

const SummaryTable = (props) => {
  const [summary, setSummary] = useState(dummy_data);

  return (
    <>
      {summary.map((s) => (
        <>
          <DataTable value={s.data} className="p-datatable-sm" showGridlines>
            <Column field="for" header={s.header}></Column>
            <Column field="life" header="Life"></Column>
            <Column field="tpd" header="TPD"></Column>
            <Column field="trauma" header="Trauma"></Column>
            <Column field="ip" header="IP"></Column>
          </DataTable>
          <br />
        </>
      ))}
    </>
  );
};

export default SummaryTable;
