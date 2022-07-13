import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOMServer from "react-dom/server";
import React, { Component } from "react";

export default class RenderToDoc extends Component {
  constructor(props) {
    super(props);
  }

  htmlToCanvas() {
    const html = ReactDOMServer.renderToStaticMarkup(this.render());
    html2canvas(html).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
    });
  }

  render() {
    return <div>{this.props.component}</div>;
  }
}
