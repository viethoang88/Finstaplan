// import { Component } from "react";
// import { Document, Text, render, Image, Header, LineBreak } from "redocx";
// import fs from "fs";
// import path from "path";
// import process from "process";

// class ScopingDocument extends Component {
//   constructor(props) {
//     super(props);
//     console.log(props.client);
//   }

//   render() {
//     return (
//       <Document>
//         <Text style={{ color: "black" }}>Dear Tjaart and Cecile,</Text>
//         <Text style={{ color: "black" }}>
//           At our recent meeting and through the information you have provided
//           us, it is apparent that the things that are most important to both of
//           you are:
//         </Text>

//         <Text style={{ color: "black" }}>
//           We discussed your goals and some of the things that you would like to
//           work towards, and the respective timelines are:
//         </Text>

//         <Text style={{ color: "black" }}>
//           While at this stage, it is premature to determine if any or all the
//           goals could be met, we will certainly keep these in mind and focus our
//           planning on assisting to put you in a good position to achieve them.
//         </Text>

//         <Text style={{ color: "black" }}>
//           We also discussed some of the areas that are important to you for us
//           to focus our immediate attention and advice around. Many of these
//           areas will direct contribute towards assisting you to achieve your
//           short- and long-term goals.
//         </Text>

//         <Text style={{ color: "black" }}>
//           At this stage, the scope of advice as we understand you require would
//           include - List of items that were checked in the “what you would like
//           to do?” section.
//         </Text>

//         <Text style={{ color: "black" }}>
//           Please can you confirm that this is an accurate summary and feel free
//           to add any further points that we should consider.
//         </Text>

//         <Text style={{ color: "black" }}>Thanking you,</Text>

//         <Text style={{ color: "black" }}>Martin Morris</Text>
//       </Document>
//     );
//   }
// }

// const SampleDocument = () => (
//   <Document>
//     <Text>Hello World</Text>
//   </Document>
// );

// //https://github.com/vercel/next.js/discussions/15453
// //https://github.com/nitin42/redocx/blob/master/docs/api.md
// async function handler(req, res) {
//   if (req.method === "PUT") {
//     const { client } = req.body;
//     const idString = `${
//       client?.primary?.firstName
//     }_${new Date().toISOString()}`;

//     // render(
//     //   <SampleDocument />,
//     //   //<ScopingDocument client={client} />,
//     //   `${__dirname}/public/temp/${idString}.docx`
//     // );
//     // console.log("-------RENDERED DOC---------");
//     // console.log(`${__dirname}/${idString}.docx`);

//     return res.json({ idString, success: true });
//   }

//   if (req.method === "POST") {
//     const { idString } = req.body;
//     try {
//       const filePath = path.join(
//         process.cwd(),
//         `${__dirname}/public/temp/${idString}.docx`
//       );
//       const fileBuffer = fs.createReadStream(filePath);

//       await new Promise(function (resolve) {
//         // res.setHeader('Content-Type', 'image/svg+xml');
//         res.setHeader(
//           "Content-Type",
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//         );
//         res.setHeader(
//           "Content-Disposition",
//           "attachment; filename=scoping_document.docx"
//         );
//         fileBuffer.pipe(res);
//         fileBuffer.on("end", resolve);
//         fileBuffer.on("error", function (err) {
//           if (err.code === "ENOENT") {
//             res.status(400).json({
//               error: true,
//               message: "Sorry we could not find the file you requested!",
//             });
//             res.end();
//           } else {
//             res
//               .status(500)
//               .json({ error: true, message: "Sorry, something went wrong!" });
//             res.end();
//           }
//         });
//       });
//     } catch (err) {
//       res.status(400).json({ error: true, message: err });
//       res.end();
//     }
//   }
// }

// async function handler2(req, res) {
//   if (req.method === "POST") {
//     const { client } = req.body;

//     try {
//       render(<ScopingDocument client={client} />).then(async (stream) => {
//         await new Promise(function (resolve) {
//           res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//           );
//           res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=scoping_document.docx"
//           );
//           res.send(stream);
//           // stream.pipe(res);
//           // stream.on("end", resolve);
//           // stream.on("error", function (err) {
//           //   if (err.code === "ENOENT") {
//           //     res.status(400).json({
//           //       error: true,
//           //       message: "Sorry we could not find the file you requested!",
//           //     });
//           //     res.end();
//           //   } else {
//           //     res.status(500).json({
//           //       error: true,
//           //       message: "Sorry, something went wrong!",
//           //     });
//           //     res.end();
//           //   }
//           // });
//         });
//       });

//       // fs.open(
//       //   "scoping_document.docx",
//       //   "w+",
//       //   stream.length,
//       //   async (err, fd) => {
//       //     if (err) {
//       //       console.log(err);
//       //     }

//       //const readStream = fs.createReadStream(stream.toBuffer());

//       //     await new Promise(function (resolve) {
//       //       res.setHeader(
//       //         "Content-Type",
//       //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       //       );
//       //       res.setHeader(
//       //         "Content-Disposition",
//       //         "attachment; filename=scoping_document.docx"
//       //       );
//       //       stream.pipe(res);
//       //       stream.on("end", resolve);
//       //       stream.on("error", function (err) {
//       //         if (err.code === "ENOENT") {
//       //           res.status(400).json({
//       //             error: true,
//       //             message: "Sorry we could not find the file you requested!",
//       //           });
//       //           res.end();
//       //         } else {
//       //           res.status(500).json({
//       //             error: true,
//       //             message: "Sorry, something went wrong!",
//       //           });
//       //           res.end();
//       //         }
//       //       });
//       //     });
//       //   }
//       // );
//       // });
//     } catch (e) {
//       console.log("SOMETHING WENT WRONG");
//       console.error(e);
//       res.status(400).json({ error: true, message: e });
//       res.end();
//     }
//   }
// }

// //res.send(stream.toBuffer());
// // res.download(null, stream.toBuffer(), (err) => {
// //   if (err) {
// //     console.log(err);
// //   }
// // });
// // res.end();

// // fs.write(fd, stream.toBuffer(), (writeErr) => {
// //   if (writeErr) {
// //     console.log(writeErr);
// //   }
// //   console.log("Docx generated and saved to sample.docx");
// //   console.log(fd);
// // });
// // });
// //   }
// // }

// export default handler;
