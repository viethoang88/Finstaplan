import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const data = [
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      description: "Product Description",
      image: "bamboo-watch.jpg",
      price: 65,
      category: "Accessories",
      quantity: 24,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1001",
      code: "nvklal433",
      name: "Black Watch",
      description: "Product Description",
      image: "black-watch.jpg",
      price: 72,
      category: "Accessories",
      quantity: 61,
      inventoryStatus: "INSTOCK",
      rating: 4,
    },
    {
      id: "1002",
      code: "zz21cz3c1",
      name: "Blue Band",
      description: "Product Description",
      image: "blue-band.jpg",
      price: 79,
      category: "Fitness",
      quantity: 2,
      inventoryStatus: "LOWSTOCK",
      rating: 3,
    },
    {
      id: "1003",
      code: "244wgerg2",
      name: "Blue T-Shirt",
      description: "Product Description",
      image: "blue-t-shirt.jpg",
      price: 29,
      category: "Clothing",
      quantity: 25,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1004",
      code: "h456wer53",
      name: "Bracelet",
      description: "Product Description",
      image: "bracelet.jpg",
      price: 15,
      category: "Accessories",
      quantity: 73,
      inventoryStatus: "INSTOCK",
      rating: 4,
    },
    {
      id: "1005",
      code: "av2231fwg",
      name: "Brown Purse",
      description: "Product Description",
      image: "brown-purse.jpg",
      price: 120,
      category: "Accessories",
      quantity: 0,
      inventoryStatus: "OUTOFSTOCK",
      rating: 4,
    },
    {
      id: "1006",
      code: "bib36pfvm",
      name: "Chakra Bracelet",
      description: "Product Description",
      image: "chakra-bracelet.jpg",
      price: 32,
      category: "Accessories",
      quantity: 5,
      inventoryStatus: "LOWSTOCK",
      rating: 3,
    },
    {
      id: "1007",
      code: "mbvjkgip5",
      name: "Galaxy Earrings",
      description: "Product Description",
      image: "galaxy-earrings.jpg",
      price: 34,
      category: "Accessories",
      quantity: 23,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1008",
      code: "vbb124btr",
      name: "Game Controller",
      description: "Product Description",
      image: "game-controller.jpg",
      price: 99,
      category: "Electronics",
      quantity: 2,
      inventoryStatus: "LOWSTOCK",
      rating: 4,
    },
    {
      id: "1009",
      code: "cm230f032",
      name: "Gaming Set",
      description: "Product Description",
      image: "gaming-set.jpg",
      price: 299,
      category: "Electronics",
      quantity: 63,
      inventoryStatus: "INSTOCK",
      rating: 3,
    },
  ],
};

export class DataTableEditDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products1: null,
      products2: null,
      products3: null,
      products4: null,
      editingRows: {},
    };

    this.columns = [
      { field: "code", header: "Code" },
      { field: "name", header: "Name" },
      { field: "quantity", header: "Quantity" },
      { field: "price", header: "Price" },
    ];

    this.statuses = [
      { label: "In Stock", value: "INSTOCK" },
      { label: "Low Stock", value: "LOWSTOCK" },
      { label: "Out of Stock", value: "OUTOFSTOCK" },
    ];

    this.editingCellRows = {};
    this.originalRows = {};
    this.originalRows2 = {};
   
    this.onRowEditInit = this.onRowEditInit.bind(this);
    this.onRowEditCancel = this.onRowEditCancel.bind(this);
    this.onRowEditInit2 = this.onRowEditInit2.bind(this);
    this.onRowEditCancel2 = this.onRowEditCancel2.bind(this);
    this.onRowEditChange = this.onRowEditChange.bind(this);
    this.onEditorInit = this.onEditorInit.bind(this);
    this.onEditorCancel = this.onEditorCancel.bind(this);
    this.onEditorSubmit = this.onEditorSubmit.bind(this);
    this.statusBodyTemplate = this.statusBodyTemplate.bind(this);
    this.positiveIntegerValidator = this.positiveIntegerValidator.bind(this);
    this.emptyValueValidator = this.emptyValueValidator.bind(this);
  }

  componentDidMount() {
    // this.fetchProductData("products1");
    // this.fetchProductData("products2");
    // this.fetchProductData("products3");
    // this.fetchProductData("products4");
    for (let key of ["products1", "products2", "products3", "products4"]) {
        this.setState({[`${key}`]: data})
    }
  }

  positiveIntegerValidator(e) {
    const { rowData, field } = e.columnProps;
    return this.isPositiveInteger(rowData[field]);
  }

  emptyValueValidator(e) {
    const { rowData, field } = e.columnProps;
    return rowData[field].trim().length > 0;
  }

  isPositiveInteger(val) {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  onEditorInit(e) {
    const { rowIndex: index, field, rowData } = e.columnProps;
    if (!this.editingCellRows[index]) {
      this.editingCellRows[index] = { ...rowData };
    }
    this.editingCellRows[index][field] = this.state.products2[index][field];
  }

  onEditorCancel(e) {
    const { rowIndex: index, field } = e.columnProps;
    let products = [...this.state.products2];
    products[index][field] = this.editingCellRows[index][field];
    delete this.editingCellRows[index][field];

    this.setState({
      products2: products,
    });
  }

  onEditorSubmit(e) {
    const { rowIndex: index, field } = e.columnProps;
    delete this.editingCellRows[index][field];
  }

  onRowEditInit(event) {
    this.originalRows[event.index] = { ...this.state.products3[event.index] };
  }

  onRowEditCancel(event) {
    let products = [...this.state.products3];
    products[event.index] = this.originalRows[event.index];
    delete this.originalRows[event.index];

    this.setState({ products3: products });
  }

  onRowEditInit2(event) {
    this.originalRows2[event.index] = { ...this.state.products4[event.index] };
  }

  onRowEditCancel2(event) {
    let products = [...this.state.products4];
    products[event.index] = this.originalRows2[event.index];
    delete this.originalRows2[event.index];

    this.setState({ products4: products });
  }

  onRowEditChange(event) {
    this.setState({ editingRows: event.data });
  }

  setActiveRowIndex(index) {
    let products = [...this.state.products4];
    this.originalRows2[index] = { ...products[index] };
    let editingRows = {
      ...this.state.editingRows,
      ...{ [`${products[index].id}`]: true },
    };
    this.setState({ editingRows });
  }

  getStatusLabel(status) {
    switch (status) {
      case "INSTOCK":
        return "In Stock";

      case "LOWSTOCK":
        return "Low Stock";

      case "OUTOFSTOCK":
        return "Out of Stock";

      default:
        return "NA";
    }
  }

  onEditorValueChange(productKey, props, value) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    this.setState({ [`${productKey}`]: updatedProducts });
  }

  inputTextEditor(productKey, props, field) {
    return (
      <InputText
        type="text"
        value={props.rowData[field]}
        onChange={(e) =>
          this.onEditorValueChange(productKey, props, e.target.value)
        }
      />
    );
  }

  codeEditor(productKey, props) {
    return this.inputTextEditor(productKey, props, "code");
  }

  nameEditor(productKey, props) {
    return this.inputTextEditor(productKey, props, "name");
  }

  priceEditor(productKey, props) {
    return (
      <InputNumber
        value={props.rowData["price"]}
        onValueChange={(e) =>
          this.onEditorValueChange(productKey, props, e.value)
        }
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  }

  statusEditor(productKey, props) {
    return (
      <Dropdown
        value={props.rowData["inventoryStatus"]}
        options={this.statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => this.onEditorValueChange(productKey, props, e.value)}
        style={{ width: "100%" }}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  }

  statusBodyTemplate(rowData) {
    return this.getStatusLabel(rowData.inventoryStatus);
  }

  priceBodyTemplate(rowData) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.price);
  }

  render() {
    return (
      <div className="datatable-editing-demo">
        <Toast ref={(el) => (this.toast = el)} />

        <div className="card">
          <h5>Basic Cell Editing</h5>
          <DataTable
            value={this.state.products1}
            editMode="cell"
            className="editable-cells-table"
          >
            <Column
              field="code"
              header="Code"
              editor={(props) => this.codeEditor("products1", props)}
            ></Column>
            <Column
              field="name"
              header="Name"
              editor={(props) => this.nameEditor("products1", props)}
            ></Column>
            <Column
              field="inventoryStatus"
              header="Status"
              body={this.statusBodyTemplate}
              editor={(props) => this.statusEditor("products1", props)}
            ></Column>
            <Column
              field="price"
              header="Price"
              body={this.priceBodyTemplate}
              editor={(props) => this.priceEditor("products1", props)}
            ></Column>
          </DataTable>
        </div>
      </div>
    );
  }
}
