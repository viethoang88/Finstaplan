import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { renderGoals } from "./render-goals";
import Html from "react-pdf-html";
import { renderValues } from "./render-values";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "white", //"#E4E4E4",
    fontSize: "12pt",
    marginVertical: "12pt",
  },
  section: {
    margin: 48,
    padding: 14,
    flexGrow: 1,
  },
  paragraph: {
    marginVertical: 6,
    padding: 2,
    flexGrow: 1,
  },
});

// Create Document Component
/*
    // CREATE NEW PAGE:
    <Page size="A4" style={styles.page} wrap orientation={"landscape"}>     
    </Page>

    <Image src={Source Object}>
    </Image>
    
    // VALID Source Objects:
    String	Valid image URL or filesystem path (Node only)	www.react-pdf.org/test.jpg
    URL object	Enables to pass extra parameters on how to fetch images	{ uri: valid-url, method: 'GET', headers: {}, body: '' }
    Buffer	Renders image directly from Buffer. Image format (png or jpg) will be guessed based on Buffer.	Buffer
    Data buffer	Renders buffer image via the data key. It's also recommended to provide the image format so the engine knows how to proccess it	{ data: Buffer, format: 'png' \| 'jpg' }
    Function	A function that returns (can also return a promise that resolves to) any of the above formats	() => String \| Promise<String>
*/
const wrapInHtml = (innerHtml, wrapperStyles) => {
  return `<html>
    <body>
      <div style=${wrapperStyles}>
        ${innerHtml}
      </div>
    </body>
  </html>`;
};

// "font-family: Arial;"
const wantsWrapperStyles = `"font-size: 12px; display: flex; flex-direction: row;"`;

const MyDocument = (names, goalsHtml = "", wantsHtml = "", valuesHtml = "") => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.paragraph}>Dear {names},</Text>
          <Text style={styles.paragraph}>
            At our recent meeting and through the information you have provided
            us, it is apparent that what is most important to you is:
          </Text>

          {valuesHtml !== "" && <Html>{valuesHtml}</Html>}

          <Text style={styles.paragraph}>
            We discussed your goals and some of the things that you would like
            to work towards, and the respective timelines are:
          </Text>

          {goalsHtml !== "" && <Html>{goalsHtml}</Html>}

          <Text style={styles.paragraph}>
            While at this stage, it is premature to determine if any or all the
            goals could be met, we will certainly keep these in mind and focus
            our planning on assisting to put you in a good position to achieve
            them.
          </Text>

          <Text style={styles.paragraph}>
            We also discussed some of the areas that are important to you for us
            to focus our immediate attention and advice around. Many of these
            areas will direct contribute towards assisting you to achieve your
            short and long-term goals.
          </Text>

          <Text style={styles.paragraph}>
            At this stage, within the scope of advice you have included the
            following items:
          </Text>
          {wantsHtml !== "" && (
            <View>
              <Html>{wantsHtml}</Html>
            </View>
          )}

          <Text style={styles.paragraph}>
            Please can you confirm that this is an accurate summary and feel
            free to add any further points that we should consider.
          </Text>

          <Text style={styles.paragraph}>Thanking you,</Text>

          <Text style={styles.paragraph}>Martin Morris</Text>
        </View>
      </Page>
    </Document>
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

const wantsNamesStyles = `"position: absolute; font-size: 14px; top: -150px; margin-left: 15px;"`;

const wantsToHtmlList = (wants, names) => {
  const [primaryWants, partnerWants] = wants;
  const _namesArr = names.split(" ");

  let wantsString = "";
  if (primaryWants?.length > 0) {
    wantsString += `<div style="position: relative;"><p style=${wantsNamesStyles}>${_namesArr?.[0]}</p>`;
    wantsString +=
      "<ul>" +
      primaryWants.map((want) => `<li>${want}</li>`).join("") +
      "</ul>";
    wantsString += "</div>";
  }
  if (partnerWants?.length > 0) {
    wantsString += `<div style="position: relative;"><p style=${wantsNamesStyles}>${_namesArr?.[2]}</p>`;
    wantsString +=
      "<ul>" +
      partnerWants.map((want) => `<li>${want}</li>`).join("") +
      "</ul>";
    wantsString += "</div>";
  }
  return wantsString;
};

const renderToPdf = async (clientData) => {
  console.log(typeof clientData);
  const _clientData = JSON.parse(clientData);
  console.log("---- RECEIVED CLIENT DATA ----");
  console.log(_clientData);
  console.log(_clientData.values);

  const names = extractNamesString(_clientData);
  const wants = extractWants(_clientData);
  const wantsHtmlList = wantsToHtmlList(wants, names);
  const wantsHtml =
    wantsHtmlList !== "" ? wrapInHtml(wantsHtmlList, wantsWrapperStyles) : "";
  console.log(names);
  console.log(wantsHtmlList);
  console.log(wantsHtml);

  const valuesHtml = await renderValues(_clientData?.values);

  try {
    const goalsImage = await renderGoals(_clientData?.goals);
    console.log("--------- SUCCESSFULLY RENDERED GOALS IMAGE --------");
    console.log(goalsImage);
    return MyDocument(names, goalsImage, wantsHtml, valuesHtml);
  } catch (e) {
    console.log("---------- ERROR RENDERING GOALS ----------");
    console.log(e);
    return MyDocument(names, undefined, wantsHtml, valuesHtml);
  }
};

export default renderToPdf;
