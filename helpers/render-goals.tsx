// import html2canvas from "html2canvas";
import ReactDOMServer from "react-dom/server";
// import jsdom from "jsdom";
// import classes from "../components/ff/goal-map.module.css";
// import nodeHtmlToImage from "node-html-to-image";

// import { iconOptions } from "../components/ff/user-goals";

const goalMap = (goals) => {
  // console.log("-------- BUILDING GOAL MAP WITH GOALS ---------");
  // console.log(goals);

  return `
    <html>
      <style>
      .wrapper {      
        position: relative;
        top: -7rem;
        left: -6rem;
        display: flex;       
        align-self: center;
      }

      .goal_bin {
        position: absolute;
        width: 100%;
        min-width: 100%;
        height: 100%;        
        min-height: 100%;
      }
      .outer {
        width: 1590px;
        min-width: 1590px;
        height: 950px;
        min-height: 950px;
        border: 3px solid black;
        background-color: rgba(233, 230, 230, 0.904);
      
      }
      .outer td {
        border: 3px solid black;
      }

      .row_1 {
        height: 5rem;
        font-size: 3.5rem;
      }
      .row_2 {
        height: 2.5rem;
        font-size: 1.5rem;
      }
      .row {
        height: 12rem;
      }
      .td_0 {
        max-width: 4rem;
        width: 4rem;
        min-width: 4rem;
        border-radius: 35px;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
      }
      .td_1,
      .td_1_2,
      .td_2,
      .td_3,
      .td_4 {
        position: relative;
        width: 15rem;   
      }
      .td_1,
      .td_1_2,
      .td_2,
      .td_3 {
        height: 15rem;
      }

      .goalContainer {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        align-content: center;
        max-width: 36px;
        width: 36px;
        height: 36px;
        max-height: 36px;
        border-radius: 25px;
      }
      .goal_button {
        display: flex;
        flex-direction: column;
        align-self: center;
        align-items: center;        
        align-content: center;
        justify-content: center;
        text-align: center;
        width: 7.2rem;
        height: 7.2rem;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
        border: black solid 1.5px;        
      }
      .goal_text {
        text-align: center;
        width: auto;
        font-weight: 500;
        font-size: 12px;
        color: black;
      }
      </style>
      <body>
        <div class="wrapper">
          <table class="outer">
            <thead>
              <tr class="row_1">
                <th class="th_0" colSpan="1"></th>
                <th class="th_1" colSpan="2">
                  Short term
                </th>
                <th class="th_3">Medium term</th>
                <th class="th_4">Long term</th>
              </tr>
              <tr class="row_2">
                <th class="th_0"></th>
                <th class="th_1 shortterm">
                  0-2 years
                </th>
                <th class="th_1_2">2-4 years</th>
                <th class="th_3">4-7 years</th>
                <th class="th_4">7+ years</th>
              </tr>
            </thead>
            <div class="goal_bin">
              ${
                goals &&
                goals?.map((goalData) => {
                  const { left, top, goal, arrIdx, idx, ...rest } = goalData;
                  return `
                    <div
                        class="goalContainer"
                        style="left: ${left}; top: ${top};"
                      >
                        <div
                          class="goal_button"
                          style="background-color: white;">
                          <p class="goal_text">{goal}</p>
                        </div>
                      </div>`;
                })
              }              
            </div>
            <tbody>
              <tr class="row">
                <td class="td_0 need"}>Need</td>
                <td class="td_1"></td>
                <td class="td_1_2"></td>
                <td class="td_2"></td>
                <td class="td_3"></td>
              </tr>
              <tr class="row">
                <td class="td_0 want">Want</td>
                <td class="td_1"></td>
                <td class="td_1_2"></td>
                <td class="td_2"></td>
                <td class="td_3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>`;
};

export const renderGoals = (goals) => {
  try {
    // const _goalsImage = goalMap(goals);
    // console.log("---- SUCCESSFULLY GENERATED GOALS IMAGE ----");
    // console.log(_goalsImage);
    // const _goalsMarkup = ReactDOMServer.renderToStaticMarkup(_goalsImage);
    console.log("---- SUCCESSFULLY RENDERED GOALS Markup ----");
    const goalsMarkup = goalMap(goals);
    // console.log(_goalsMarkup);
    return goalsMarkup;
  } catch (e) {
    console.log("---- FAILED TO GENERATE GOALS IMAGE ----");
    console.log(e);
    const testDiv = (
      <div
        id="container"
        style={{ height: "25rem", width: "25rem", backgroundColor: "green" }}
      >
        HELLLLLLLLLLOOOOO
      </div>
    );

    const staticHtml = ReactDOMServer.renderToStaticMarkup(testDiv);
    // console.log("---- STATIC HTML STRING ----");
    // console.log(staticHtml);
    return staticHtml;
  }

  // console.log(staticHtml);

  // const image = await nodeHtmlToImage({
  //   html: staticHtml,
  //   encoding: "base64",
  // });

  // console.log(typeof image);
  // console.log(image);
  // console.log(image.toString());

  // return image.toString();
};

// export const renderGoals = goals => {
//   const testDiv = (
//     <div
//       id="container"
//       style={{ height: "10rem", width: "10rem", backgroundColor: "green" }}
//     >
//       HELLLLLLLLLLOOOOO
//     </div>
//   );
//   const staticDiv = ReactDOMServer.renderToStaticMarkup(testDiv);
//   //   console.log("----------staticDiv----------");
//   //   console.log(staticDiv);
//   const htmlDiv = new jsdom.JSDOM(staticDiv);
//   const htmlElement = htmlDiv.window.document.getElementById("container");
//   //   console.log("---------htmlDiv-----------");
//   //   console.log(htmlDiv);

//   return html2canvas(htmlElement)
//     .then((canvas) => {
//       console.log("-------CANVAS--------");
//       console.log(canvas);
//       const imgData = canvas.toDataURL("image/png");
//       console.log(imgData);
//       return imgData;
//     })
//     .catch((e) => {
//       console.log("ERROR CONVERTING CANVAS TO IMAGE");
//       console.log(e);
//       console.log("---------------------------------");
//     });
// };
