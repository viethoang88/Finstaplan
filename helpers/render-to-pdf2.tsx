// import React, { Component } from "react";
// import { renderGoals } from "./render-goals3";
// import { renderValues } from "./render-values";
// import { PDFExport } from "@progress/kendo-react-pdf";
// import { getProfileImage } from "../components/advisor/admin/profile";
// // import { faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import canvg from 'canvg';
// import ReactDOMServer from "react-dom/server";
// import { Storage } from "aws-amplify";

// class RenderToPdf extends Component {
//   resume;
//   canvLoaded;

//   constructor(props) {
//     super(props);
//     // this.iconsToConvert = [
//     //     {
//     //         icon: faGithub,
//     //         alt: 'github icon'
//     //     },
//     //     {
//     //         icon: faMedium,
//     //         alt: 'medium icon'
//     //     }
//     // ]
//     this.canvLoaded = false;
//   }

//   exportPDF = () => {
//     this.resume.save();
//   };

//   // convertSvgToImage = (arr) => {
//   //     let canv = this.refs.canvas;
//   //     if (!this.canvLoaded) {
//   //         this.canvLoaded = true;
//   //         canv.getContext("2d");
//   //         arr.forEach((d, i) => {
//   //             let htmlString = ReactDOMServer.renderToStaticMarkup(
//   //                 <FontAwesomeIcon icon={d.icon} size={"3x"} style={{ color: '#005696', height: '500px', width: '500px' }} />
//   //             );
//   //             canvg(canv, htmlString);
//   //             d.icon = canv.toDataURL("image/png");
//   //         });
//   //         this.setState({});
//   //     }
//   // }

//   componentDidMount() {
//     // this.convertSvgToImage(this.iconsToConvert);
//     this.exportPDF;
//   }

//   render() {
//     return (
//       <div
//         style={{
//           height: "100vh",
//           width: "100vw",
//           paddingTop: 20,
//           backgroundColor: "white",
//         }}
//       >
//         {/* {!this.canvLoaded && <canvas ref="canvas" style={{ display: 'none' }}> </canvas>} */}
//         <div style={{ textAlign: "center", marginBottom: 10 }}>
//           <button onClick={this.exportPDF} style={{ margin: "auto" }}>
//             download
//           </button>
//         </div>
//         <PDFExport
//           paperSize={"A4"}
//           fileName="scoping_document.pdf"
//           title="Scoping Document"
//           subject="Financial Planning"
//           keywords=""
//           margin={28}
//           ref={(r) => (this.resume = r)}
//         >
//           {/* <div
//             style={{
//               height: 792,
//               width: 612,
//               padding: "none",
//               backgroundColor: "white",
//               boxShadow: "5px 5px 5px black",
//               margin: "auto",
//               overflowX: "hidden",
//               overflowY: "hidden",
//             }}
//           ></div> */}
//           {/* {this.canvLoaded && this.iconsToConvert.map((iconObject, index) => {
//                             return <img src={iconObject.icon} key={'img-' + index} alt={iconObject.alt} style={{ height: 25, width: 25 }} />
//                         })}
//                     </div> */}
//           {this.props.children}
//         </PDFExport>
//       </div>
//     );
//   }
// }

const styles = {
  paragraph: {
    marginTop: "12px",
    fontSize: "13px",
    textAlign: "left",
  },
};

export const MyDocument = (
  names,
  goalsHtml,
  wantsHtml,
  valuesHtml,
  signedURL
) => {
  return (
    <div style={{ padding: "35px" }}>
      {/* <img src={signedURL}></img> */}
      <img
        src="/assets/images/my-financial-mentors.jpg"
        style={{ maxHeight: "100px", maxWidth: "150px" }}
      />
      <p style={styles.paragraph}>Dear {names}</p>
      <p style={styles.paragraph}>
        At our recent meeting and through the information you have provided us,
        it is apparent that what is most important to you is:
      </p>

      {valuesHtml && valuesHtml}

      <p style={styles.paragraph}>
        We discussed your goals and some of the things that you would like to
        work towards, and the respective timelines are:
      </p>

      {goalsHtml && goalsHtml}

      <p style={styles.paragraph}>
        While at this stage, it is premature to determine if any or all the
        goals could be met, we will certainly keep these in mind and focus our
        planning on assisting to put you in a good position to achieve them.
      </p>

      <p style={styles.paragraph}>
        We also discussed some of the areas that are important to you for us to
        focus our immediate attention and advice around. Many of these areas
        will direct contribute towards assisting you to achieve your short and
        long-term goals.
      </p>

      <p style={styles.paragraph}>
        At this stage, within the scope of advice you have included the
        following items:
      </p>
      {wantsHtml && <div>{wantsHtml}</div>}

      <p style={styles.paragraph}>
        Please can you confirm that this is an accurate summary and feel free to
        add any further points that we should consider.
      </p>

      <p style={styles.paragraph}>Thanking you,</p>

      <p style={styles.paragraph}>Martin Morris</p>
    </div>
  );
};

const extractNamesString = (clientData) => {
  const clientName = clientData?.primary?.firstName || "Client";
  if (clientData?.hasPartner) {
    return clientName + " and " + (clientData?.partner?.firstName || "Partner");
  } else {
    return clientName;
  }
};

const extractWants = (clientData) => {
  const clientWants = clientData?.primary?.wants || [];
  if (clientData?.hasPartner) {
    const partnerWants = clientData?.partner?.wants || [];
    return [clientWants, partnerWants];
  }
  return [clientWants, []];
};

const wantsNamesStyles = {
  // position: "absolute",
  fontSize: 15,
  // top: -150,
  // marginLeft: 15,
  textAlign: "center",
  position: "relative",
  top: "15px",
};

const wantsToHtmlList = (wants, names) => {
  const [primaryWants, partnerWants] = wants;
  const _namesArr = names.split(" ");

  const wantsJSX = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-start",
        justifyContent: "flex-start",
        maxWidth: "",
      }}
    >
      {primaryWants?.length > 0 && (
        <div style={{ position: "relative" }}>
          <p style={wantsNamesStyles}>{_namesArr?.[0]}</p>
          <ul>
            {primaryWants.map((want) => (
              <li style={{ textAlign: "left" }}>{want}</li>
            ))}
          </ul>
        </div>
      )}
      {partnerWants?.length > 0 && (
        <div style={{ position: "relative" }}>
          <p style={wantsNamesStyles}>{_namesArr?.[2]}</p>
          <ul>
            {partnerWants.map((want) => (
              <li style={{ textAlign: "left" }}>{want}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return wantsJSX;
};

const renderToPdf = (_clientData, profileUrl) => {
  // const _clientData = JSON.parse(clientData);
  console.log("---- RECEIVED CLIENT DATA ----");
  console.log(_clientData);
  console.log(_clientData.values);

  const names = extractNamesString(_clientData);
  const wants = extractWants(_clientData);
  const wantsHtmlList = wantsToHtmlList(wants, names);

  const valuesHtml = renderValues(_clientData?.values);

  const goalsImage = "";
  //   const goalsImage = renderGoals(_clientData?.goals);

  return (
    <RenderToPdf>
      {MyDocument(names, goalsImage, wantsHtmlList, valuesHtml, profileUrl)}
    </RenderToPdf>
  );
};

export default renderToPdf;
