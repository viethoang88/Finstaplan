import renderToPdf from "../../../../helpers/render-to-pdf2";
import React from "react";
import ReactPDF from "@react-pdf/renderer";

async function handler(req, res) {
  if (req.method === "POST") {
    const client = req.body;
    const Document = await renderToPdf(client);
    try {
      let pdfStream = await ReactPDF.renderToStream(Document);
      console.log("--------------RENDERED TO PDF--------");
      res.setHeader("Content-Type", "application/pdf");
      pdfStream.pipe(res);
      pdfStream.on("end", () => console.log("Done streaming, response sent."));
      pdfStream.on("finish", () => {
        console.log("On finish triggered");
      });
      pdfStream.on("error", (e) => {
        console.log("---------pdfStream.on error event triggered-------");
        console.log(e);
      });
    } catch (e) {
      console.log("---------ReactPDF.renderToStream FAILED------");
      console.log(e);
    }
  }
}

export default handler;
