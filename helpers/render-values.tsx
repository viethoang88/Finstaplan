import ReactDOMServer from "react-dom/server";
import { Box } from "grommet";

const colors = [
  "#f8f7fc",
  "#e7e3f6",
  "#d0c8ed",
  "#b8ace3",
  "#a191da",
  "#8975d1",
  "#745dc9",
  "#5f44c1",
  "#5239ab",
  "#463193",
  // "#3a297a",
  "#f0f7f8",
  "#cde6e7",
  "#9bccd0",
  "#69b3b8",
  "#458e93",
  "#2e5e61",
  "#295457",
];

const valueContainerClicked = {
  textAlign: "center",
  alignSelf: "center",
  justifySelf: "center",
  fontSize: "16px",
  fontWeight: "700",
  textShadow: "1px 1px white",
  position: "relative",
  top: "3px",
  left: "1px",
  // width: "100px",
  // height: "90px",
};

const valueContainer = {
  textAlign: "center",
  alignSelf: "center",
  justifySelf: "center",
  fontSize: "18px",
  fontWeight: "bold",
  position: "relative",
  top: "5px",
  left: "7px",
  // top: "2.35rem",
  // width: "100px",
  // height: "65px",
};

const generateValuesComponent = (values) => {
  if (values === undefined) return <div></div>;
  const { selectedVals, topVals, topValsWhy } = values;

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {selectedVals.map((val, idx) => {
          return (
            <div
              key={idx}
              style={{
                backgroundColor: colors[idx],
                height: "55px",
                width: "130px",
                border: "0.5px solid black",
                display: "flex",
                flexBasis: "auto",
                padding: "12px",
                justifySelf: "center",
                alignSelf: "center",
                alignContent: "center",
                borderRadius: "20px",
                marginRight: "15px",
                alignItems: "center",
                justifyContent: "center",
                justifyItems: "center",
                marginBottom: "25px",
                position: "relative",
                left: "15px",
                top: "5px",
              }}
            >
              <p style={valueContainer}>{val}</p>
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {topVals.map((val, idx) => {
          return (
            <div>
              <div
                key={idx}
                style={{
                  backgroundColor: "lightgreen",
                  height: "50px",
                  width: "115px",
                  border: "1px solid black",
                  display: "flex",
                  flexBasis: "auto",
                  padding: "14px",
                  textAlign: "center",
                  justifySelf: "center",
                  alignSelf: "center",
                  alignContent: "center",
                  justifyContent: "center",
                  justifyItems: "center",
                  marginBottom: "25px",
                  marginRight: "15px",
                  borderRadius: "12px",
                }}
              >
                <p style={valueContainerClicked}>{val}</p>
              </div>
              <div
                style={{
                  position: "relative",
                  left: "3px",
                  top: "3px",
                  maxWidth: "95px",
                }}
              >
                {topValsWhy[val]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const generateValuesHtml2 = (values) => {
  if (values === undefined) return null;
  const { selectedVals, topVals, topValsWhy } = values;

  return `
    <html>
      <body style="padding: 0; margin: 0;">
        <div style="display: flex;
                    flex-direction: row; 
                    flex-wrap: wrap; 
                    align-content: center; 
                    justify-content: center; 
                    align-items: space-around;                   
                    margin: 0;
                    padding: 0;
                    margin-right: 24px;">
          ${selectedVals.map((val, idx) => {
            return `<div style="position: relative;
                                background-color: ${colors[idx]};
                                min-width: 115px;
                                width: 115px;
                                height: 60px;
                                min-height: 60px;
                                border: 12x solid black;
                                display: flex; 
                                flex-basis: auto;
                                padding: 40px;
                                align-self: center;
                                align-content: center;
                                border-radius: 25px;">
                <p style="position: relative;                            
                          text-align: center; 
                          align-self: center; 
                          font-size: 12px;
                          top: -25px;
                          width: 115px;
                          max-width: 115px;">
                    ${val}
                </p>
              </div>`;
          })}
        </div>
        <div style="display: flex;
                    flex-direction: row; 
                    flex-wrap: wrap; 
                    align-content: center; 
                    justify-content: center; 
                    align-items: space-around;                    
                    margin: 0;
                    padding: 0;
                    margin-right: 24px;">
          ${topVals.map((val, idx) => {
            // text-shadow: 1.5px 1.5px white; for p below
            return `<div>
                <div style="position: relative;
                            background-color: lightgreen;
                            min-width: 135px;
                            width: 135px;
                            height: 120px;
                            min-height: 120px;
                            border: 2px solid black;
                            display: flex;
                            flex-basis: auto;
                            padding: 15px;
                            align-self: center; 
                            align-content: center;
                            border-radius: 25px;">
                  <p style="position: relative; 
                            top: -20px;
                            text-align: center; 
                            align-self: center;
                            font-size: 18px;
                            font-weight: 700;">
                    ${val}
                  </p>
                  <div style="position: relative; top: -46px; font-size: 13px; text-align: center; margin-top: 14px">
                    ${topValsWhy[val]}
                  </div>
                </div>                
              </div>`;
          })}
        </div>
      </body>
    </html>`;
};

const generateValuesHtml = (values) => {
  if (values === undefined) return null;
  const { selectedVals, topVals, topValsWhy } = values;

  return `
    <html>
      <body style="padding: 0; 
                   margin: 150px; 
                   position: relative; 
                   left: -30px; 
                   top: -140px; 
                   width: 550px;
                   min-width: 600px;">
         <div style="display: flex;
                    flex-direction: row; 
                    flex-wrap: wrap; 
                    align-content: center; 
                    justify-content: center; 
                    align-items: space-around;                     
                    margin: 0;      
                    padding: 0;">
          ${topVals.map((val, idx) => {
            return `<div style="margin: 4px; margin-right: 24px;">
                <div style="position: relative;
                            background-color: lightgreen;
                            min-width: 160px;
                            width: 150px;
                            height: 120px;
                            min-height: 120px;
                            border: 2px solid black;
                            display: flex;
                            flex-basis: auto;
                            padding: 15px;                            
                            align-self: center; 
                            align-content: center;
                            border-radius: 25px;">
                  <p style="position: relative; 
                            top: -25px;
                            text-align: center; 
                            align-self: center;
                            font-size: 18px;
                            font-weight: 700;">
                    ${val}
                  </p>
                  <div style="position: relative; top: -46px; font-size: 13px; text-align: center; margin-top: 14px">
                    ${topValsWhy[val]}
                  </div>
                </div>                
              </div>`;
          })}
        </div>
      </body>
    </html>`;
};

export const renderValues = (values) => {
  return generateValuesComponent(values);
  // console.log("---- RENDERING WITH VALUES ----");
  // console.log(values);
  // try {
  //   // const valuesComponent = generateValuesComponent(values);
  //   // console.log("---- SUCCESSFULLY GENERATED VALUES COMPONENT ----");
  //   // console.log(valuesComponent);
  //   // const valuesMarkup = ReactDOMServer.renderToStaticMarkup(valuesComponent);
  //   // console.log("---- SUCCESSFULLY RENDERED VALUES Markup ----");
  //   const valuesMarkup = generateValuesHtml(values);
  //   console.log(valuesMarkup);
  //   return valuesMarkup;
  // } catch (e) {
  //   console.log("---- FAILED TO GENERATE Values Image ----");
  //   console.log(e);
  //   const testDiv = (
  //     <div id="container" style={{ height: "25rem" }}>
  //       PROBLEM
  //     </div>
  //   );

  //   const staticHtml = ReactDOMServer.renderToStaticMarkup(testDiv);
  //   console.log("---- STATIC HTML STRING ----");
  //   console.log(staticHtml);
  //   return staticHtml;
  // }
};
