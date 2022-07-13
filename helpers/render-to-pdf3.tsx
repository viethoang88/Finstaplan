// ReactToPrint attempt:
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { extractWants, wantsToHtmlList } from "./render-wants";
// import { MyDocument } from "./render-to-pdf2";
import { renderValues } from "./render-values";
import { renderGoals } from "./render-goals2";
import React, { useRef } from "react";

const extractNamesString = (clientData) => {
  const clientName = clientData?.primary?.firstName || "Client";
  if (clientData?.hasPartner) {
    return clientName + " and " + (clientData?.partner?.firstName || "Partner");
  } else {
    return clientName;
  }
};

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
  left: "0.5px",
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
  top: "1.5px",
  left: "2.5px",
  // top: "2.35rem",
  // width: "100px",
  // height: "65px",
};

const wantsNamesStyles = {
  // position: "absolute",
  fontSize: 15,
  // top: -150,
  // marginLeft: 15,
  textAlign: "center",
  position: "relative",
  top: "15px",
  marginBottom: "25px",
};

const styles = {
  paragraph: {
    marginTop: "12px",
    fontSize: "13px",
    textAlign: "left",
    marginBottom: "12px",
  },
  firstParagraph: {
    marginTop: "36px",
    fontSize: "13px",
    textAlign: "left",
  },
};

export const Document = React.forwardRef((props, ref) => {
  const { names, primaryWants, partnerWants, values, goals } = props;
  const _namesArr = names.split(" ");
  let selectedVals = [];
  let topVals = [];
  let topValsWhy = {};
  console.log("--- CREATING SCOPING DOCUMENT ---");
  console.log(names);
  console.log(primaryWants);
  console.log(partnerWants);
  console.log(values);
  if (values !== undefined) {
    selectedVals = values?.selectedVals;
    topVals = values?.topVals;
    topValsWhy = values?.topValsWhy;
  }

  return (
    <div ref={ref} style={{ padding: "35px" }}>
      {/* <img src={signedURL}></img> */}
      <img
        src="/assets/images/my-financial-mentors.jpg"
        style={{ maxHeight: "100px", maxWidth: "150px" }}
      />
      <p style={styles.firstParagraph}>Dear {names}</p>

      <p style={styles.paragraph}>
        At this stage, within the scope of advice you have included the
        following items:
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-around",
          justifyItems: "space-around",
          alignItems: "flex-start",
          maxWidth: "100%",
          padding: "15px",
          marginTop: "35px",
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

      <p style={styles.paragraph}>
        At our recent meeting and through the information you have provided us,
        it is apparent that what is most important to you is:
      </p>

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
                  width: "155px",
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
                  marginBottom: "5px",
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
        {topVals !== undefined && topVals.length > 0 && (
          <p style={styles.paragraph}>With your most important values being:</p>
        )}
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
                    height: "65px",
                    width: "165px",
                    border: "1px solid black",
                    display: "flex",
                    flexBasis: "auto",
                    padding: "8px",
                    textAlign: "center",
                    justifySelf: "center",
                    justifyContent: "center",
                    marginBottom: "25px",
                    marginRight: "45px",
                    alignSelf: "center",
                    alignContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  <p style={valueContainerClicked}>{val}</p>
                </div>
                <div
                  style={{
                    position: "relative",
                    left: "3px",
                    maxWidth: "160px",
                    top: "0.5px",
                    marginBottom: "20px",
                  }}
                >
                  {topValsWhy[val]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={styles.paragraph}>
        We discussed your goals and some of the things that you would like to
        work towards, and the respective timelines are:
      </p>

      {/* <GoalsHtml /> */}
      {renderGoals(goals)}

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
        Please can you confirm that this is an accurate summary and feel free to
        add any further points that we should consider.
      </p>

      <p style={styles.paragraph}>Thanking you,</p>

      <p style={styles.paragraph}>Martin Morris</p>
    </div>
  );
});

const RenderToPdf = ({ clientData }) => {
  if (clientData === undefined) return <div></div>;
  const wrapperRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => wrapperRef.current,
  });

  console.log(clientData);
  console.log(clientData?.values);
  const names = extractNamesString(clientData);
  console.log(names);
  const wants = extractWants(clientData);
  console.log(wants);
  const [primaryWants, partnerWants] = wants;
  console.log(primaryWants);
  console.log(partnerWants);
  //   console.log(wants);
  //   const WantsHtmlList = wantsToHtmlList(wants, names);
  //   console.log(WantsHtmlList);
  //   const ValuesHtml = renderValues(clientData?.values);
  //   console.log(ValuesHtml);
  //   const GoalsImage = renderGoals(clientData?.goals);
  //   console.log(GoalsImage);

  // USAGE: MyDocument(names, goalsHtml, wantsHtml, valuesHtml, signedURL)
  // const Document = MyDocument(names, goalsImage, wantsHtmlList, valuesHtml, "");
  // console.log(Document);
  //   const Document = MyDocument("", "", "", "", "");
  return (
    <div>
      <Document
        ref={wrapperRef}
        names={names}
        signedURL={""}
        primaryWants={primaryWants}
        partnerWants={partnerWants}
        values={clientData?.values}
        goals={clientData?.goals}
      />
      <button onClick={handlePrint}>Generate Scoping Document</button>
    </div>
  );
};

export default RenderToPdf;
