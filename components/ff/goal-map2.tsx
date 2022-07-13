import classes from "./goal-map.module.css";
import { ConnectDropTarget, DropTargetMonitor } from "react-dnd";
import { DropTarget } from "react-dnd";
import { FC, memo, useState, useCallback } from "react";
import update from "immutability-helper";
import GoalBin from "./goal-bin2";

// export interface DustbinProps {
//   accepts: string[];
//   lastDroppedItem?: any;
//   onDrop: (item: any) => void;

//   // Collected Props
//   canDrop: boolean;
//   isOver: boolean;
//   connectDropTarget: ConnectDropTarget;
// }
// import { useDrop } from "react-dnd";

export const GoalMap: FC = memo(function GoalMap() {
  // const [collectedProps, dropRef, drop, hover, lastDroppedItem ] = useDrop(() => ({
  //   accept: "goal",
  // }));

  const [dustbins, setDustbins] = useState([
    { binLabel: "need02", accepts: ["goal"], lastDroppedItem: null, items: [] },
    { binLabel: "want02", accepts: ["goal"], lastDroppedItem: null, items: [] },
    { binLabel: "need25", accepts: ["goal"], lastDroppedItem: null, items: [] },
    { binLabel: "want25", accepts: ["goal"], lastDroppedItem: null, items: [] },
    {
      binLabel: "need612",
      accepts: ["goal"],
      lastDroppedItem: null,
      items: [],
    },
    {
      binLabel: "want612",
      accepts: ["goal"],
      lastDroppedItem: null,
      items: [],
    },
    {
      binLabel: "need12p",
      accepts: ["goal"],
      lastDroppedItem: null,
      items: [],
    },
    {
      binLabel: "want12p",
      accepts: ["goal"],
      lastDroppedItem: null,
      items: [],
    },
  ]);

  const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([]);

  function isDropped(boxName: string) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const handleDrop = useCallback(
    (index: number, item: { name: string }) => {
      const { name } = item;
      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name] } : { $push: [] })
      );
      setDustbins(
        update(dustbins, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [droppedBoxNames, dustbins]
  );

  return (
    <div className={classes.wrapper}>
      {/* <span className={classes.arrow_container}>
        <hr className={classes.arrow_shaft} />
        <span className={classes.arrow}>&#10230;</span>
      </span> */}
      <table className={classes.outer}>
        <thead>
          <tr className={`box p-shadow-24 ${classes.row_1}`}>
            <th className={classes.th_0} colSpan="1"></th>
            <th className={classes.th_1} colSpan="2">
              Short term
            </th>
            <th className={classes.th_3}>Medium term</th>
            <th className={classes.th_4}>Long term</th>
          </tr>
          <tr className={classes.row_2}>
            <th className={classes.th_0}></th>
            <th className={`${classes.th_1} ${classes.shortterm}`}>
              0-2 years
            </th>
            <th className={classes.th_1_2}>2-4 years</th>
            <th className={classes.th_3}>4-7 years</th>
            <th className={classes.th_4}>7+ years</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.row}>
            <td className={`${classes.td_0} ${classes.need}`}>Need</td>
            <td className={classes.td_1}>
              <GoalBin
                accepts={dustbins[0].accepts}
                onDrop={(item) => handleDrop(0, item)}
                idx={0}
                key={0}
                lastDroppedItem={dustbins[0].lastDroppedItem}
              />
            </td>
            <td className={classes.td_1_2}>
              <GoalBin
                key={2}
                idx={2}
                accepts={dustbins[2].accepts}
                onDrop={(item) => handleDrop(2, item)}
                lastDroppedItem={dustbins[2].lastDroppedItem}
              />
            </td>
            <td className={classes.td_2}>
              <GoalBin
                key={4}
                idx={4}
                accepts={dustbins[4].accepts}
                onDrop={(item) => handleDrop(4, item)}
                lastDroppedItem={dustbins[4].lastDroppedItem}
              />
            </td>
            <td className={classes.td_3}>
              <GoalBin
                key={6}
                idx={6}
                accepts={dustbins[6].accepts}
                onDrop={(item) => handleDrop(6, item)}
                lastDroppedItem={dustbins[6].lastDroppedItem}
              />
            </td>
          </tr>
          <tr className={classes.row}>
            <td className={`${classes.td_0} ${classes.want}`}>Want</td>
            <td className={classes.td_1}>
              <GoalBin
                key={1}
                idx={1}
                accepts={dustbins[1].accepts}
                onDrop={(item) => handleDrop(1, item)}
                lastDroppedItem={dustbins[1].lastDroppedItem}
              />
            </td>
            <td className={classes.td_1_2}>
              <GoalBin
                key={3}
                idx={3}
                accepts={dustbins[3].accepts}
                onDrop={(item) => handleDrop(3, item)}
                lastDroppedItem={dustbins[3].lastDroppedItem}
              />
            </td>
            <td className={classes.td_2}>
              <GoalBin
                key={5}
                idx={5}
                accepts={dustbins[5].accepts}
                onDrop={(item) => handleDrop(5, item)}
                lastDroppedItem={dustbins[5].lastDroppedItem}
              />
            </td>
            <td className={classes.td_3}>
              <GoalBin
                key={7}
                idx={7}
                accepts={dustbins[7].accepts}
                onDrop={(item) => handleDrop(7, item)}
                lastDroppedItem={dustbins[7].lastDroppedItem}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

// GoalMap = (props) => {
//   <svg
//     xmlns:dc="http://purl.org/dc/elements/1.1/"
//     xmlns:cc="http://creativecommons.org/ns#"
//     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
//     xmlns:svg="http://www.w3.org/2000/svg"
//     xmlns="http://www.w3.org/2000/svg"
//     xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
//     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
//     width="270.35147mm"
//     height="133.21738mm"
//     viewBox="0 0 270.35146 133.21738"
//     version="1.1"
//     id="svg8"
//     inkscape:version="0.92.3 (2405546, 2018-03-11)"
//     sodipodi:docname="wish-grid.svg"
//   >
//     <defs id="defs2">
//       <marker
//         inkscape:isstock="true"
//         style="overflow:visible"
//         id="marker1287"
//         refX="0"
//         refY="0"
//         orient="auto"
//         inkscape:stockid="TriangleOutL"
//       >
//         <path
//           transform="scale(0.8)"
//           style="fill:#d0d922;fill-opacity:1;fill-rule:evenodd;stroke:#d0d922;stroke-width:1.00000003pt;stroke-opacity:1"
//           d="M 5.77,0 -2.88,5 V -5 Z"
//           id="path1285"
//           inkscape:connector-curvature="0"
//         />
//       </marker>
//       <marker
//         inkscape:isstock="true"
//         style="overflow:visible"
//         id="marker1229"
//         refX="0"
//         refY="0"
//         orient="auto"
//         inkscape:stockid="TriangleInL"
//       >
//         <path
//           transform="scale(-0.8)"
//           style="fill:#1a736b;fill-opacity:1;fill-rule:evenodd;stroke:#1a736b;stroke-width:1.00000003pt;stroke-opacity:1"
//           d="M 5.77,0 -2.88,5 V -5 Z"
//           id="path1227"
//           inkscape:connector-curvature="0"
//         />
//       </marker>
//       <marker
//         inkscape:stockid="TriangleInL"
//         orient="auto"
//         refY="0"
//         refX="0"
//         id="TriangleInL"
//         style="overflow:visible"
//         inkscape:isstock="true"
//         inkscape:collect="always"
//       >
//         <path
//           id="path952"
//           d="M 5.77,0 -2.88,5 V -5 Z"
//           style="fill:#d0d922;fill-opacity:1;fill-rule:evenodd;stroke:#d0d922;stroke-width:1.00000003pt;stroke-opacity:1"
//           transform="scale(-0.8)"
//           inkscape:connector-curvature="0"
//         />
//       </marker>
//       <marker
//         inkscape:stockid="TriangleOutL"
//         orient="auto"
//         refY="0"
//         refX="0"
//         id="TriangleOutL"
//         style="overflow:visible"
//         inkscape:isstock="true"
//         inkscape:collect="always"
//       >
//         <path
//           id="path961"
//           d="M 5.77,0 -2.88,5 V -5 Z"
//           style="fill:#d0d922;fill-opacity:1;fill-rule:evenodd;stroke:#d0d922;stroke-width:1.00000003pt;stroke-opacity:1"
//           transform="scale(0.8)"
//           inkscape:connector-curvature="0"
//         />
//       </marker>
//       <marker
//         inkscape:stockid="Arrow2Lend"
//         orient="auto"
//         refY="0"
//         refX="0"
//         id="Arrow2Lend"
//         style="overflow:visible"
//         inkscape:isstock="true"
//       >
//         <path
//           id="path840"
//           style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.625;stroke-linejoin:round;stroke-opacity:1"
//           d="M 8.7185878,4.0337352 -2.2072895,0.01601326 8.7185884,-4.0017078 c -1.7454984,2.3720609 -1.7354408,5.6174519 -6e-7,8.035443 z"
//           transform="matrix(-1.1,0,0,-1.1,-1.1,0)"
//           inkscape:connector-curvature="0"
//         />
//       </marker>
//       <marker
//         inkscape:stockid="Arrow2Lstart"
//         orient="auto"
//         refY="0"
//         refX="0"
//         id="Arrow2Lstart"
//         style="overflow:visible"
//         inkscape:isstock="true"
//       >
//         <path
//           id="path837"
//           style="fill:#000000;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.625;stroke-linejoin:round;stroke-opacity:1"
//           d="M 8.7185878,4.0337352 -2.2072895,0.01601326 8.7185884,-4.0017078 c -1.7454984,2.3720609 -1.7354408,5.6174519 -6e-7,8.035443 z"
//           transform="matrix(1.1,0,0,1.1,1.1,0)"
//           inkscape:connector-curvature="0"
//         />
//       </marker>
//     </defs>
//     <sodipodi:namedview
//       id="base"
//       pagecolor="#ffffff"
//       bordercolor="#666666"
//       borderopacity="1.0"
//       inkscape:pageopacity="0.0"
//       inkscape:pageshadow="2"
//       inkscape:zoom="0.59575501"
//       inkscape:cx="490.61051"
//       inkscape:cy="-40.348981"
//       inkscape:document-units="mm"
//       inkscape:current-layer="layer1"
//       showgrid="false"
//       inkscape:window-width="1920"
//       inkscape:window-height="1015"
//       inkscape:window-x="1920"
//       inkscape:window-y="36"
//       inkscape:window-maximized="1"
//       fit-margin-top="0"
//       fit-margin-left="0"
//       fit-margin-right="0"
//       fit-margin-bottom="0"
//       showguides="true"
//     />
//     <metadata id="metadata5">
//       <rdf:RDF>
//         <cc:Work rdf:about="">
//           <dc:format>image/svg+xml</dc:format>
//           <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
//           <dc:title></dc:title>
//         </cc:Work>
//       </rdf:RDF>
//     </metadata>
//     <g
//       inkscape:label="Layer 1"
//       inkscape:groupmode="layer"
//       id="layer1"
//       transform="translate(8.257144,-105.9748)"
//     >
//       <path
//         style="fill:none;stroke:#d0d922;stroke-width:0.40145978;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;marker-start:url(#TriangleInL);marker-end:url(#TriangleOutL)"
//         d="M 12.305813,132.56322 V 234.90613"
//         id="path815"
//         inkscape:connector-curvature="0"
//       />
//       <path
//         style="fill:none;stroke:#d0d922;stroke-width:0.48184469;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;marker-end:url(#marker1287)"
//         d="M -3.1868871,182.44173 H 256.19821"
//         id="path817"
//         inkscape:connector-curvature="0"
//       />
//       <path
//         style="fill:none;stroke:#d3d3d3;stroke-width:0.22171938px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
//         d="M 114.73462,107.35868 V 238.767"
//         id="path1847"
//         inkscape:connector-curvature="0"
//       />
//       <path
//         style="fill:none;stroke:#d3d3d3;stroke-width:0.22001939px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
//         d="M 194.00442,107.30868 V 238.32714"
//         id="path1849"
//         inkscape:connector-curvature="0"
//       />
//       <g
//         aria-label="Want to have"
//         transform="matrix(0,-0.14165719,0.14165719,0,-25.689417,198.76995)"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#808080;fill-opacity:1;stroke:none"
//         id="flowRoot1913"
//       >
//         <path
//           d="m 181.77461,208.19546 h 3.4 l 3.76,9.88 3.8,-9.88 h 3.4 l -4.92,12.36 4.88,11.72 9.6,-24.24 h 3.92 l -11.88,28.4 h -3.12 l -5.64,-13.4 -5.68,13.4 h -3.12 l -11.84,-28.4 h 3.88 l 9.64,24.24 4.84,-11.72 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4647"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 215.94023,236.83546 q -1.48,0 -2.76,-0.48 -1.28,-0.52 -2.24,-1.4 -0.92,-0.88 -1.48,-2.04 -0.52,-1.2 -0.52,-2.6 0,-1.44 0.64,-2.6 0.64,-1.2 1.8,-2.04 1.2,-0.84 2.8,-1.32 1.64,-0.48 3.56,-0.48 1.52,0 3.08,0.28 1.56,0.28 2.76,0.76 v -1.68 q 0,-2.56 -1.44,-4 -1.44,-1.48 -4.08,-1.48 -3.16,0 -6.64,2.44 l -1.16,-2.28 q 4.04,-2.72 8.12,-2.72 4.12,0 6.4,2.2 2.32,2.2 2.32,6.2 v 8.52 q 0,1.24 1.12,1.28 v 3.04 q -0.56,0.08 -0.92,0.12 -0.36,0.04 -0.76,0.04 -1.04,0 -1.68,-0.6 -0.6,-0.64 -0.72,-1.52 l -0.08,-1.48 q -1.4,1.88 -3.56,2.88 -2.12,0.96 -4.56,0.96 z m 0.92,-2.64 q 1.88,0 3.48,-0.68 1.64,-0.72 2.48,-1.88 0.76,-0.76 0.76,-1.56 v -3.08 q -2.56,-1 -5.32,-1 -2.64,0 -4.32,1.12 -1.64,1.12 -1.64,2.92 0,0.88 0.32,1.64 0.36,0.76 0.96,1.32 0.64,0.56 1.48,0.88 0.84,0.32 1.8,0.32 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4649"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 250.88773,236.43546 h -3.52 v -11.68 q 0,-3.36 -1.04,-4.88 -1,-1.52 -3.08,-1.52 -1.08,0 -2.16,0.44 -1.08,0.4 -2.04,1.12 -0.96,0.72 -1.68,1.72 -0.72,1 -1.08,2.2 v 12.6 h -3.52 v -20.88 h 3.2 v 4.48 q 1.24,-2.2 3.56,-3.52 2.36,-1.32 5.12,-1.32 1.8,0 3,0.68 1.2,0.64 1.92,1.84 0.72,1.16 1,2.76 0.32,1.6 0.32,3.48 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4651"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 266.92711,235.39546 q -0.32,0.16 -0.84,0.4 -0.52,0.2 -1.2,0.44 -0.64,0.2 -1.44,0.32 -0.76,0.16 -1.6,0.16 -1.92,0 -3.32,-1.04 -1.4,-1.08 -1.4,-3.32 v -14.04 h -2.84 v -2.76 h 2.84 v -6.96 h 3.52 v 6.96 h 4.68 v 2.76 h -4.68 v 12.96 q 0.08,1.16 0.76,1.68 0.68,0.52 1.6,0.52 1.04,0 1.88,-0.32 0.88,-0.36 1.2,-0.56 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4653"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 291.14586,235.39546 q -0.32,0.16 -0.84,0.4 -0.52,0.2 -1.2,0.44 -0.64,0.2 -1.44,0.32 -0.76,0.16 -1.6,0.16 -1.92,0 -3.32,-1.04 -1.4,-1.08 -1.4,-3.32 v -14.04 h -2.84 v -2.76 h 2.84 v -6.96 h 3.52 v 6.96 h 4.68 v 2.76 h -4.68 v 12.96 q 0.08,1.16 0.76,1.68 0.68,0.52 1.6,0.52 1.04,0 1.88,-0.32 0.88,-0.36 1.2,-0.56 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4655"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 303.21586,236.83546 q -2.36,0 -4.32,-0.88 -1.92,-0.88 -3.32,-2.36 -1.36,-1.48 -2.12,-3.44 -0.76,-1.96 -0.76,-4.12 0,-2.2 0.76,-4.16 0.8,-1.96 2.16,-3.44 1.4,-1.48 3.32,-2.36 1.96,-0.88 4.28,-0.88 2.32,0 4.28,0.88 1.96,0.88 3.32,2.36 1.4,1.48 2.16,3.44 0.8,1.96 0.8,4.16 0,2.16 -0.76,4.12 -0.76,1.96 -2.16,3.44 -1.4,1.48 -3.36,2.36 -1.92,0.88 -4.28,0.88 z m -6.92,-10.76 q 0,1.64 0.52,3.04 0.56,1.4 1.48,2.44 0.96,1.04 2.2,1.64 1.28,0.6 2.72,0.6 1.44,0 2.68,-0.6 1.28,-0.6 2.24,-1.64 0.96,-1.08 1.48,-2.48 0.56,-1.44 0.56,-3.08 0,-1.6 -0.56,-3 -0.52,-1.44 -1.48,-2.48 -0.96,-1.08 -2.24,-1.68 -1.24,-0.6 -2.68,-0.6 -1.44,0 -2.72,0.64 -1.24,0.6 -2.2,1.68 -0.92,1.04 -1.48,2.48 -0.52,1.4 -0.52,3.04 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4657"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 346.35648,236.43546 h -3.52 v -11.68 q 0,-3.24 -1.12,-4.8 -1.12,-1.6 -3.28,-1.6 -1.04,0 -2.08,0.44 -1.04,0.4 -1.96,1.12 -0.88,0.72 -1.6,1.72 -0.68,1 -1.04,2.2 v 12.6 h -3.52 v -29.2 h 3.52 v 12.8 q 1.24,-2.28 3.36,-3.56 2.12,-1.28 4.64,-1.28 1.84,0 3.12,0.68 1.28,0.68 2.04,1.84 0.76,1.16 1.08,2.8 0.36,1.6 0.36,3.44 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4659"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 357.19023,236.83546 q -1.48,0 -2.76,-0.48 -1.28,-0.52 -2.24,-1.4 -0.92,-0.88 -1.48,-2.04 -0.52,-1.2 -0.52,-2.6 0,-1.44 0.64,-2.6 0.64,-1.2 1.8,-2.04 1.2,-0.84 2.8,-1.32 1.64,-0.48 3.56,-0.48 1.52,0 3.08,0.28 1.56,0.28 2.76,0.76 v -1.68 q 0,-2.56 -1.44,-4 -1.44,-1.48 -4.08,-1.48 -3.16,0 -6.64,2.44 l -1.16,-2.28 q 4.04,-2.72 8.12,-2.72 4.12,0 6.4,2.2 2.32,2.2 2.32,6.2 v 8.52 q 0,1.24 1.12,1.28 v 3.04 q -0.56,0.08 -0.92,0.12 -0.36,0.04 -0.76,0.04 -1.04,0 -1.68,-0.6 -0.6,-0.64 -0.72,-1.52 l -0.08,-1.48 q -1.4,1.88 -3.56,2.88 -2.12,0.96 -4.56,0.96 z m 0.92,-2.64 q 1.88,0 3.48,-0.68 1.64,-0.72 2.48,-1.88 0.76,-0.76 0.76,-1.56 v -3.08 q -2.56,-1 -5.32,-1 -2.64,0 -4.32,1.12 -1.64,1.12 -1.64,2.92 0,0.88 0.32,1.64 0.36,0.76 0.96,1.32 0.64,0.56 1.48,0.88 0.84,0.32 1.8,0.32 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4661"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 379.35461,236.43546 -8.24,-20.88 h 3.64 l 6.6,17.8 6.64,-17.8 h 3.36 l -8.24,20.88 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4663"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 403.33586,236.83546 q -2.36,0 -4.32,-0.84 -1.96,-0.88 -3.36,-2.36 -1.4,-1.48 -2.2,-3.44 -0.76,-2 -0.76,-4.2 0,-2.2 0.76,-4.16 0.8,-1.96 2.2,-3.44 1.44,-1.48 3.4,-2.32 1.96,-0.88 4.32,-0.88 2.36,0 4.28,0.88 1.96,0.88 3.32,2.36 1.36,1.44 2.08,3.4 0.76,1.92 0.76,4 0,0.44 -0.04,0.8 0,0.36 -0.04,0.56 h -17.32 q 0.12,1.56 0.72,2.84 0.6,1.28 1.56,2.2 0.96,0.92 2.16,1.44 1.24,0.52 2.6,0.52 0.96,0 1.88,-0.24 0.92,-0.28 1.72,-0.72 0.8,-0.44 1.4,-1.08 0.64,-0.64 0.96,-1.44 l 3.04,0.84 q -0.52,1.16 -1.44,2.12 -0.88,0.96 -2.08,1.68 -1.16,0.68 -2.6,1.08 -1.44,0.4 -3,0.4 z m 7.16,-12.24 q -0.12,-1.48 -0.76,-2.72 -0.6,-1.28 -1.56,-2.16 -0.92,-0.88 -2.16,-1.36 -1.24,-0.52 -2.64,-0.52 -1.4,0 -2.64,0.52 -1.24,0.48 -2.2,1.4 -0.92,0.88 -1.52,2.12 -0.56,1.24 -0.68,2.72 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4665"
//           inkscape:connector-curvature="0"
//         />
//       </g>
//       <g
//         aria-label="Need to have"
//         transform="matrix(0,-0.14165719,0.14165719,0,5.4255874,205.93024)"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#808080;fill-opacity:1;stroke:none"
//         id="flowRoot1913-3"
//       >
//         <path
//           d="m -129.28304,-5.20752 v 21.68 h -3.6 v -28.4 h 2.8 l 17.6,22.12 v -22.08 h 3.6 v 28.36 h -3.04 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4668"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m -93.812419,16.87248 q -2.36,0 -4.32,-0.84 -1.960001,-0.88 -3.360001,-2.36 -1.4,-1.48 -2.2,-3.44 -0.76,-2.0000001 -0.76,-4.2000001 0,-2.2 0.76,-4.16 0.8,-1.96 2.2,-3.44 1.44,-1.4799999 3.400001,-2.3199999 1.96,-0.88 4.32,-0.88 2.36,0 4.28,0.88 1.96,0.88 3.32,2.3599999 1.36,1.44 2.08,3.4 0.76,1.92 0.76,4 0,0.44 -0.04,0.8 0,0.36 -0.04,0.56 h -17.320001 q 0.12,1.56 0.72,2.8400001 0.600001,1.28 1.560001,2.2 0.96,0.92 2.16,1.44 1.24,0.52 2.6,0.52 0.96,0 1.88,-0.24 0.92,-0.28 1.72,-0.72 0.8,-0.44 1.4,-1.08 0.64,-0.64 0.96,-1.44 l 3.04,0.84 q -0.52,1.16 -1.44,2.12 -0.88,0.96 -2.08,1.68 -1.16,0.68 -2.6,1.08 -1.44,0.4 -3,0.4 z m 7.16,-12.2400001 q -0.12,-1.48 -0.76,-2.72 -0.6,-1.28 -1.56,-2.16 -0.92,-0.88 -2.16,-1.36 -1.24,-0.52 -2.64,-0.52 -1.4,0 -2.64,0.52 -1.24,0.48 -2.2,1.4 -0.92,0.88 -1.520001,2.12 -0.56,1.24 -0.68,2.72 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4670"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m -70.140539,16.87248 q -2.36,0 -4.32,-0.84 -1.96,-0.88 -3.36,-2.36 -1.4,-1.48 -2.2,-3.44 -0.76,-2.0000001 -0.76,-4.2000001 0,-2.2 0.76,-4.16 0.8,-1.96 2.2,-3.44 1.44,-1.4799999 3.4,-2.3199999 1.96,-0.88 4.32,-0.88 2.36,0 4.28,0.88 1.96,0.88 3.32,2.3599999 1.36,1.44 2.08,3.4 0.76,1.92 0.76,4 0,0.44 -0.04,0.8 0,0.36 -0.04,0.56 h -17.32 q 0.12,1.56 0.72,2.8400001 0.6,1.28 1.56,2.2 0.96,0.92 2.16,1.44 1.24,0.52 2.6,0.52 0.96,0 1.88,-0.24 0.92,-0.28 1.72,-0.72 0.8,-0.44 1.4,-1.08 0.64,-0.64 0.96,-1.44 l 3.04,0.84 q -0.52,1.16 -1.44,2.12 -0.88,0.96 -2.08,1.68 -1.16,0.68 -2.6,1.08 -1.44,0.4 -3,0.4 z m 7.16,-12.2400001 q -0.12,-1.48 -0.76,-2.72 -0.6,-1.28 -1.56,-2.16 -0.92,-0.88 -2.16,-1.36 -1.24,-0.52 -2.64,-0.52 -1.4,0 -2.64,0.52 -1.24,0.48 -2.2,1.4 -0.92,0.88 -1.52,2.12 -0.56,1.24 -0.68,2.72 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4672"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m -47.108669,16.87248 q -2.16,0 -4,-0.88 -1.84,-0.88 -3.16,-2.36 -1.32,-1.48 -2.08,-3.44 -0.72,-1.9600001 -0.72,-4.1200001 0,-2.2 0.68,-4.16 0.72,-2 1.96,-3.48 1.28,-1.4799999 3,-2.3199999 1.76,-0.88 3.84,-0.88 2.52,0 4.48,1.32 2,1.3199999 3.16,3.1999999 V -12.72752 h 3.52 v 24.88 q 0,1.24 1.12,1.28 v 3.04 q -0.56,0.08 -0.92,0.12 -0.32,0.04 -0.64,0.04 -1.04,0 -1.84,-0.68 -0.76,-0.72 -0.76,-1.64 v -1.76 q -1.24,2.04 -3.32,3.2 -2.04,1.12 -4.32,1.12 z m 0.84,-3.04 q 0.96,0 1.96,-0.36 1.04,-0.36 1.92,-1 0.92,-0.64 1.56,-1.48 0.68,-0.88 0.88,-1.8400001 v -6 q -0.36,-1 -1.08,-1.88 -0.72,-0.92 -1.64,-1.56 -0.88,-0.68 -1.92,-1.04 -1,-0.4 -2,-0.4 -1.56,0 -2.84,0.68 -1.24,0.64 -2.16,1.76 -0.88,1.08 -1.36,2.52 -0.48,1.4 -0.48,2.88 0,1.56 0.56,3 0.56,1.4000001 1.52,2.4400001 0.96,1.04 2.24,1.68 1.32,0.6 2.84,0.6 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4674"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m -9.5961691,15.43248 q -0.32,0.16 -0.8399999,0.4 -0.52,0.2 -1.2,0.44 -0.64,0.2 -1.44,0.32 -0.76,0.16 -1.6,0.16 -1.92,0 -3.32,-1.04 -1.4,-1.08 -1.4,-3.32 V -1.6475201 h -2.84 V -4.40752 h 2.84 v -6.96 h 3.52 v 6.96 h 4.68 v 2.7599999 h -4.68 V 11.31248 q 0.08,1.16 0.76,1.68 0.68,0.52 1.6,0.52 1.04,0 1.88,-0.32 0.88,-0.36 1.2,-0.56 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4676"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 2.4738309,16.87248 q -2.36000001,0 -4.32,-0.88 -1.92,-0.88 -3.32,-2.36 -1.36,-1.48 -2.12,-3.44 -0.76,-1.9600001 -0.76,-4.1200001 0,-2.2 0.76,-4.16 0.8,-1.96 2.16,-3.44 1.4,-1.4799999 3.32,-2.3599999 1.95999999,-0.88 4.28,-0.88 2.32,0 4.28,0.88 1.96,0.88 3.3200001,2.3599999 1.4,1.48 2.16,3.44 0.8,1.96 0.8,4.16 0,2.16 -0.76,4.1200001 -0.76,1.96 -2.16,3.44 -1.4000001,1.48 -3.3600001,2.36 -1.92,0.88 -4.28,0.88 z m -6.92,-10.7600001 q 0,1.64 0.52,3.04 0.56,1.4000001 1.48,2.4400001 0.96,1.04 2.19999999,1.64 1.28000001,0.6 2.72000001,0.6 1.44,0 2.68,-0.6 1.28,-0.6 2.24,-1.64 0.96,-1.08 1.48,-2.4800001 0.56,-1.44 0.56,-3.08 0,-1.6 -0.56,-3 -0.52,-1.44 -1.48,-2.48 -0.96,-1.08 -2.24,-1.68 -1.24,-0.6 -2.68,-0.6 -1.44,0 -2.72000001,0.64 -1.23999999,0.6 -2.19999999,1.68 -0.92,1.04 -1.48,2.48 -0.52,1.4 -0.52,3.04 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4678"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 45.614461,16.47248 h -3.52 V 4.7924799 q 0,-3.24 -1.12,-4.8 -1.12,-1.6 -3.28,-1.6 -1.04,0 -2.08,0.44 -1.04,0.4 -1.96,1.12 -0.88,0.72 -1.6,1.72 -0.68,1 -1.04,2.2 V 16.47248 h -3.52 v -29.2 h 3.52 V 0.0724799 q 1.24,-2.28 3.36,-3.5599999 2.12,-1.28 4.64,-1.28 1.84,0 3.12,0.68 1.28,0.68 2.04,1.8399999 0.76,1.16 1.08,2.8 0.36,1.6 0.36,3.44 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4680"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 56.448211,16.87248 q -1.48,0 -2.76,-0.48 -1.28,-0.52 -2.24,-1.4 -0.92,-0.88 -1.48,-2.04 -0.52,-1.2 -0.52,-2.6 0,-1.4400001 0.64,-2.6000001 0.64,-1.2 1.8,-2.04 1.2,-0.84 2.8,-1.32 1.64,-0.48 3.56,-0.48 1.52,0 3.08,0.28 1.56,0.28 2.76,0.76 v -1.68 q 0,-2.56 -1.44,-4 -1.44,-1.48 -4.08,-1.48 -3.16,0 -6.64,2.44 l -1.16,-2.28 q 4.04,-2.7199999 8.12,-2.7199999 4.12,0 6.4,2.2 2.32,2.1999999 2.32,6.1999999 V 12.15248 q 0,1.24 1.12,1.28 v 3.04 q -0.56,0.08 -0.92,0.12 -0.36,0.04 -0.76,0.04 -1.04,0 -1.68,-0.6 -0.6,-0.64 -0.72,-1.52 l -0.08,-1.48 q -1.4,1.88 -3.56,2.88 -2.12,0.96 -4.56,0.96 z m 0.92,-2.64 q 1.88,0 3.48,-0.68 1.64,-0.72 2.48,-1.88 0.76,-0.76 0.76,-1.56 V 7.0324799 q -2.56,-1 -5.32,-1 -2.64,0 -4.32,1.12 -1.64,1.12 -1.64,2.9200001 0,0.88 0.32,1.64 0.36,0.76 0.96,1.32 0.64,0.56 1.48,0.88 0.84,0.32 1.8,0.32 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4682"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 78.612581,16.47248 -8.24,-20.88 h 3.64 l 6.6,17.8 6.64,-17.8 h 3.36 l -8.24,20.88 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4684"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 102.59383,16.87248 q -2.36,0 -4.319999,-0.84 -1.96,-0.88 -3.36,-2.36 -1.4,-1.48 -2.2,-3.44 -0.76,-2.0000001 -0.76,-4.2000001 0,-2.2 0.76,-4.16 0.8,-1.96 2.2,-3.44 1.44,-1.4799999 3.4,-2.3199999 1.959999,-0.88 4.319999,-0.88 2.36,0 4.28,0.88 1.96,0.88 3.32,2.3599999 1.36,1.44 2.08,3.4 0.76,1.92 0.76,4 0,0.44 -0.04,0.8 0,0.36 -0.04,0.56 H 95.673831 q 0.12,1.56 0.72,2.8400001 0.6,1.28 1.56,2.2 0.96,0.92 2.159999,1.44 1.24,0.52 2.6,0.52 0.96,0 1.88,-0.24 0.92,-0.28 1.72,-0.72 0.8,-0.44 1.4,-1.08 0.64,-0.64 0.96,-1.44 l 3.04,0.84 q -0.52,1.16 -1.44,2.12 -0.88,0.96 -2.08,1.68 -1.16,0.68 -2.6,1.08 -1.44,0.4 -3,0.4 z m 7.16,-12.2400001 q -0.12,-1.48 -0.76,-2.72 -0.6,-1.28 -1.56,-2.16 -0.92,-0.88 -2.16,-1.36 -1.24,-0.52 -2.64,-0.52 -1.4,0 -2.639999,0.52 -1.24,0.48 -2.2,1.4 -0.92,0.88 -1.52,2.12 -0.56,1.24 -0.68,2.72 z"
//           style="font-style:normal;font-variant:normal;font-weight:500;font-stretch:normal;font-family:Raleway;-inkscape-font-specification:'Raleway Medium';fill:#808080;fill-opacity:1"
//           id="path4686"
//           inkscape:connector-curvature="0"
//         />
//       </g>
//       <flowRoot
//         xml:space="preserve"
//         id="flowRoot865"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none"
//         transform="matrix(0.26458333,0,0,0.26458333,0,87)"
//       >
//         <flowRegion id="flowRegion867">
//           <rect
//             id="rect869"
//             width="413.54953"
//             height="40.274422"
//             x="90.371872"
//             y="90.371887"
//           />
//         </flowRegion>
//         <flowPara id="flowPara871">short te</flowPara>
//       </flowRoot>{" "}
//       <flowRoot
//         xml:space="preserve"
//         id="flowRoot2371"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:none;fill-opacity:1;stroke:none"
//         transform="matrix(0.26458333,0,0,0.26458333,-0.25102486,105.53139)"
//       >
//         <flowRegion id="flowRegion2373" style="fill:none">
//           <rect
//             id="rect2375"
//             width="198.65361"
//             height="76.405235"
//             x="154.19966"
//             y="83.684616"
//             style="fill:none"
//           />
//         </flowRegion>
//         <flowPara
//           id="flowPara2377"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:18.66666603px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:none;fill-opacity:1"
//         />
//       </flowRoot>{" "}
//       <path
//         style="fill:none;stroke:#d3d3d3;stroke-width:0.22171938px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
//         d="M 61.755733,107.78386 V 239.19218"
//         id="path1847-3"
//         inkscape:connector-curvature="0"
//       />
//       <rect
//         style="fill:#d0d92f;fill-opacity:0.94117647;stroke:none;stroke-width:0.48540422;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
//         id="rect2213"
//         width="270.35147"
//         height="20.792078"
//         x="-8.257144"
//         y="106.38032"
//       />
//       <g
//         aria-label="Short Term"
//         transform="matrix(0.25227239,0,0,0.25227239,14.254503,72.300428)"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none"
//         id="flowRoot2379"
//       >
//         <path
//           d="m 136.76337,162.04255 q -0.224,-0.224 -0.832,-0.608 -0.576,-0.384 -1.44,-0.736 -0.832,-0.384 -1.824,-0.64 -0.992,-0.256 -2.016,-0.256 -1.824,0 -2.71999,0.672 -0.896,0.672 -0.896,1.888 0,0.704 0.31999,1.184 0.35201,0.448 0.992,0.8 0.64,0.352 1.6,0.64 0.992,0.288 2.27201,0.608 1.66399,0.448 3.00799,0.96 1.376,0.512 2.304,1.28 0.96,0.768 1.472,1.856 0.512,1.056 0.512,2.624 0,1.824 -0.704,3.136 -0.672,1.28 -1.856,2.08 -1.152,0.8 -2.688,1.184 -1.504,0.352 -3.168,0.352 -2.56,0 -5.056,-0.768 -2.49599,-0.768 -4.48,-2.176 l 1.95201,-3.808 q 0.288,0.288 1.024,0.768 0.768,0.448 1.79199,0.928 1.024,0.448 2.272,0.768 1.248,0.32 2.56,0.32 3.648,0 3.648,-2.336 0,-0.736 -0.416,-1.248 -0.416,-0.512 -1.184,-0.896 -0.768,-0.384 -1.856,-0.704 -1.088,-0.32 -2.432,-0.704 -1.63199,-0.448 -2.848,-0.96 -1.184,-0.544 -1.98399,-1.248 -0.8,-0.736 -1.216,-1.664 -0.384,-0.96 -0.384,-2.272 0,-1.728 0.64,-3.072 0.64,-1.344 1.75999,-2.24 1.152,-0.896 2.65601,-1.344 1.50399,-0.48 3.23199,-0.48 2.4,0 4.41601,0.768 2.01599,0.736 3.51999,1.76 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2511"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 158.02037,178.81055 h -4.288 v -9.408 q 0,-1.984 -0.736,-2.912 -0.736,-0.96 -2.08,-0.96 -0.576,0 -1.216,0.256 -0.64,0.256 -1.216,0.736 -0.576,0.448 -1.056,1.088 -0.48,0.64 -0.704,1.408 v 9.792 h -4.288 v -23.36 h 4.288 v 9.696 q 0.928,-1.632 2.496,-2.496 1.60001,-0.896 3.52,-0.896 1.632,0 2.656,0.576 1.024,0.544 1.6,1.472 0.576,0.928 0.8,2.112 0.224,1.184 0.224,2.432 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2513"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 169.49287,179.13055 q -2.048,0 -3.68,-0.704 -1.63199,-0.704 -2.784,-1.888 -1.12,-1.216 -1.728,-2.784 -0.608,-1.568 -0.608,-3.296 0,-1.76 0.608,-3.328 0.608,-1.568 1.728,-2.752 1.15201,-1.216 2.784,-1.92 1.632,-0.704 3.68,-0.704 2.048,0 3.648,0.704 1.632,0.704 2.752,1.92 1.152,1.184 1.76,2.752 0.608,1.568 0.608,3.328 0,1.728 -0.608,3.296 -0.608,1.568 -1.728,2.784 -1.12,1.184 -2.752,1.888 -1.632,0.704 -3.68,0.704 z m -4.384,-8.672 q 0,1.12 0.32,2.048 0.352,0.896 0.928,1.568 0.608,0.672 1.408,1.056 0.8,0.352 1.728,0.352 0.928,0 1.728,-0.352 0.8,-0.384 1.376,-1.056 0.608,-0.672 0.928,-1.6 0.352,-0.928 0.352,-2.048 0,-1.088 -0.352,-2.016 -0.32,-0.928 -0.928,-1.6 -0.576,-0.672 -1.376,-1.024 -0.8,-0.384 -1.728,-0.384 -0.928,0 -1.728,0.384 -0.8,0.384 -1.408,1.056 -0.576,0.672 -0.928,1.6 -0.32,0.928 -0.32,2.016 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2515"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 191.10787,165.75455 q -1.952,0.032 -3.488,0.768 -1.536,0.704 -2.208,2.144 v 10.144 h -4.288 v -16.768 h 3.936 v 3.584 q 0.44801,-0.864 1.056,-1.536 0.608,-0.704 1.312,-1.216 0.704,-0.512 1.408,-0.768 0.736,-0.288 1.408,-0.288 0.352,0 0.512,0 0.192,0 0.352,0.032 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2517"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 203.54687,177.94655 q -0.864,0.384 -2.112,0.768 -1.248,0.384 -2.624,0.384 -0.896,0 -1.696,-0.224 -0.768,-0.224 -1.376,-0.704 -0.57599,-0.512 -0.928,-1.28 -0.352,-0.8 -0.352,-1.92 v -9.632 h -2.208 v -3.296 h 2.208 v -5.44 h 4.288 v 5.44 h 3.52 v 3.296 h -3.52 v 8.192 q 0,0.896 0.448,1.28 0.48,0.352 1.152,0.352 0.672,0 1.312,-0.224 0.64,-0.224 1.024,-0.384 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2519"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 230.03188,159.96255 h -7.26401 v 18.848 h -4.384 v -18.848 h -7.264 v -3.872 h 18.91201 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2521"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 236.58737,179.13055 q -2.016,0 -3.648,-0.672 -1.632,-0.704 -2.784,-1.888 -1.152,-1.184 -1.792,-2.752 -0.608,-1.568 -0.608,-3.296 0,-1.792 0.608,-3.36 0.608,-1.6 1.76,-2.784 1.152,-1.216 2.784,-1.92 1.664,-0.704 3.712,-0.704 2.048,0 3.648,0.704 1.632,0.704 2.752,1.888 1.152,1.184 1.728,2.752 0.608,1.568 0.608,3.264 0,0.416 -0.032,0.8 0,0.384 -0.064,0.64 h -12.96 q 0.096,0.992 0.48,1.76 0.384,0.768 0.992,1.312 0.608,0.544 1.376,0.832 0.768,0.288 1.6,0.288 1.28,0 2.4,-0.608 1.152,-0.64 1.568,-1.664 l 3.68,1.024 q -0.928,1.92 -2.976,3.168 -2.016,1.216 -4.832,1.216 z m 4.352,-10.112 q -0.16,-1.888 -1.408,-3.008 -1.216,-1.152 -2.976,-1.152 -0.864,0 -1.632,0.32 -0.736,0.288 -1.312,0.832 -0.576,0.544 -0.96,1.312 -0.352,0.768 -0.416,1.696 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2523"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 257.98287,165.75455 q -1.952,0.032 -3.488,0.768 -1.536,0.704 -2.208,2.144 v 10.144 h -4.288 v -16.768 h 3.936 v 3.584 q 0.44801,-0.864 1.056,-1.536 0.608,-0.704 1.312,-1.216 0.704,-0.512 1.408,-0.768 0.736,-0.288 1.408,-0.288 0.352,0 0.512,0 0.192,0 0.352,0.032 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2525"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 286.42187,178.81055 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.28,0 -2.39999,0.992 -1.12,0.96 -1.60001,2.528 v 9.76 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.24799,0 -2.4,0.96 -1.11999,0.96 -1.6,2.528 v 9.792 h -4.288 v -16.768 h 3.872 v 3.104 q 0.928,-1.632 2.528,-2.496 1.632,-0.896 3.71201,-0.896 2.11199,0 3.26399,1.024 1.15201,1.024 1.472,2.528 1.024,-1.728 2.592,-2.624 1.568,-0.928 3.584,-0.928 1.536,0 2.52801,0.576 0.99199,0.576 1.536,1.504 0.54399,0.928 0.73599,2.112 0.224,1.184 0.224,2.4 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2527"
//           inkscape:connector-curvature="0"
//         />
//       </g>
//       <g
//         aria-label="Medium Term"
//         transform="matrix(0.25227239,0,0,0.25227239,97.417463,72.300428)"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none"
//         id="flowRoot2379-3"
//       >
//         <path
//           d="m 141.75538,178.81055 v -15.04 l -5.85601,11.2 h -2.4 l -5.85599,-11.2 v 15.04 h -4.41601 v -22.72 h 4.73601 l 6.71999,12.928 6.784,-12.928 h 4.704 v 22.72 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2490"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 158.02487,179.13055 q -2.016,0 -3.648,-0.672 -1.632,-0.704 -2.784,-1.888 -1.152,-1.184 -1.792,-2.752 -0.608,-1.568 -0.608,-3.296 0,-1.792 0.608,-3.36 0.608,-1.6 1.76,-2.784 1.152,-1.216 2.784,-1.92 1.664,-0.704 3.712,-0.704 2.048,0 3.648,0.704 1.632,0.704 2.752,1.888 1.152,1.184 1.728,2.752 0.608,1.568 0.608,3.264 0,0.416 -0.032,0.8 0,0.384 -0.064,0.64 h -12.96 q 0.096,0.992 0.48,1.76 0.384,0.768 0.992,1.312 0.608,0.544 1.376,0.832 0.768,0.288 1.6,0.288 1.28,0 2.4,-0.608 1.152,-0.64 1.568,-1.664 l 3.68,1.024 q -0.928,1.92 -2.976,3.168 -2.016,1.216 -4.832,1.216 z m 4.352,-10.112 q -0.16,-1.888 -1.408,-3.008 -1.216,-1.152 -2.976,-1.152 -0.864,0 -1.632,0.32 -0.736,0.288 -1.312,0.832 -0.576,0.544 -0.96,1.312 -0.352,0.768 -0.416,1.696 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2492"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 176.38038,179.13055 q -1.72801,0 -3.20001,-0.672 -1.472,-0.672 -2.528,-1.856 -1.056,-1.184 -1.664,-2.752 -0.576,-1.6 -0.576,-3.424 0,-1.824 0.544,-3.392 0.576,-1.568 1.568,-2.752 0.992,-1.184 2.368,-1.856 1.376,-0.672 3.008,-0.672 1.856,0 3.328,0.896 1.504,0.896 2.336,2.336 v -9.536 h 4.288 v 18.432 q 0,0.672 0.224,0.96 0.224,0.288 0.76801,0.32 v 3.648 q -1.12001,0.224 -1.82401,0.224 -1.15199,0 -1.888,-0.576 -0.736,-0.576 -0.832,-1.504 l -0.096,-1.056 q -0.928,1.6 -2.528,2.432 -1.568,0.8 -3.29599,0.8 z m 1.11999,-3.648 q 0.608,0 1.248,-0.192 0.64,-0.224 1.184,-0.608 0.544,-0.384 0.96,-0.896 0.448,-0.512 0.672,-1.12 v -4 q -0.256,-0.704 -0.736,-1.28 -0.44799,-0.608 -1.056,-1.024 -0.576,-0.448 -1.248,-0.704 -0.64,-0.256 -1.28,-0.256 -0.96,0 -1.792,0.416 -0.8,0.416 -1.37599,1.152 -0.57601,0.704 -0.89601,1.632 -0.32,0.928 -0.32,1.92 0,1.056 0.352,1.952 0.352,0.896 0.96,1.568 0.608,0.672 1.44,1.056 0.864,0.384 1.888,0.384 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2494"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 190.06137,178.81055 v -16.768 h 4.288 v 16.768 z m 0,-19.104 v -4.256 h 4.288 v 4.256 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2496"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 203.36887,179.13055 q -2.592,0 -3.936,-1.664 -1.344,-1.664 -1.344,-4.928 v -10.496 h 4.288 v 9.568 q 0,3.872 2.784,3.872 1.248,0 2.4,-0.736 1.184,-0.768 1.92,-2.304 v -10.4 h 4.288 v 11.84 q 0,0.672 0.224,0.96 0.256,0.288 0.8,0.32 v 3.648 q -0.64,0.128 -1.08799,0.16 -0.41601,0.032 -0.76801,0.032 -1.152,0 -1.888,-0.512 -0.704,-0.544 -0.832,-1.472 l -0.096,-1.344 q -1.12,1.728 -2.88,2.592 -1.76,0.864 -3.872,0.864 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2498"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 244.04687,178.81055 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.28,0 -2.4,0.992 -1.12,0.96 -1.6,2.528 v 9.76 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.672,-0.928 -1.888,-0.928 -1.248,0 -2.4,0.96 -1.12,0.96 -1.6,2.528 v 9.792 h -4.288 v -16.768 h 3.872 v 3.104 q 0.928,-1.632 2.528,-2.496 1.632,-0.896 3.712,-0.896 2.112,0 3.264,1.024 1.152,1.024 1.472,2.528 1.024,-1.728 2.592,-2.624 1.568,-0.928 3.584,-0.928 1.536,0 2.528,0.576 0.992,0.576 1.536,1.504 0.544,0.928 0.736,2.112 0.224,1.184 0.224,2.4 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2500"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 272.03188,159.96255 h -7.26401 v 18.848 h -4.384 v -18.848 h -7.264 v -3.872 h 18.91201 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2502"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 278.58737,179.13055 q -2.016,0 -3.648,-0.672 -1.632,-0.704 -2.784,-1.888 -1.152,-1.184 -1.79199,-2.752 -0.608,-1.568 -0.608,-3.296 0,-1.792 0.608,-3.36 0.608,-1.6 1.75999,-2.784 1.152,-1.216 2.784,-1.92 1.664,-0.704 3.712,-0.704 2.048,0 3.64801,0.704 1.632,0.704 2.752,1.888 1.15199,1.184 1.72799,2.752 0.608,1.568 0.608,3.264 0,0.416 -0.032,0.8 0,0.384 -0.064,0.64 h -12.96 q 0.096,0.992 0.48001,1.76 0.38399,0.768 0.99199,1.312 0.608,0.544 1.376,0.832 0.768,0.288 1.6,0.288 1.28,0 2.4,-0.608 1.152,-0.64 1.568,-1.664 l 3.68,1.024 q -0.928,1.92 -2.976,3.168 -2.016,1.216 -4.832,1.216 z m 4.352,-10.112 q -0.15999,-1.888 -1.40799,-3.008 -1.216,-1.152 -2.976,-1.152 -0.86401,0 -1.632,0.32 -0.73601,0.288 -1.31201,0.832 -0.576,0.544 -0.96,1.312 -0.352,0.768 -0.416,1.696 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2504"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 299.98287,165.75455 q -1.952,0.032 -3.488,0.768 -1.536,0.704 -2.208,2.144 v 10.144 h -4.288 v -16.768 h 3.936 v 3.584 q 0.44801,-0.864 1.05601,-1.536 0.608,-0.704 1.31199,-1.216 0.704,-0.512 1.408,-0.768 0.736,-0.288 1.408,-0.288 0.352,0 0.512,0 0.192,0 0.352,0.032 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2506"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 328.42187,178.81055 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.28,0 -2.39999,0.992 -1.12,0.96 -1.60001,2.528 v 9.76 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.24799,0 -2.4,0.96 -1.11999,0.96 -1.6,2.528 v 9.792 h -4.288 v -16.768 h 3.872 v 3.104 q 0.928,-1.632 2.528,-2.496 1.632,-0.896 3.71201,-0.896 2.11199,0 3.26399,1.024 1.15201,1.024 1.472,2.528 1.024,-1.728 2.592,-2.624 1.568,-0.928 3.584,-0.928 1.536,0 2.52801,0.576 0.99199,0.576 1.536,1.504 0.54399,0.928 0.73599,2.112 0.224,1.184 0.224,2.4 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2508"
//           inkscape:connector-curvature="0"
//         />
//       </g>
//       <g
//         aria-label="Long Term"
//         transform="matrix(0.25227239,0,0,0.25227239,177.91141,72.138974)"
//         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none"
//         id="flowRoot2379-3-5"
//       >
//         <path
//           d="m 123.22737,178.81055 v -22.72 h 4.41601 v 18.848 h 11.58399 v 3.872 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2473"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 148.55537,179.13055 q -2.048,0 -3.68,-0.704 -1.63199,-0.704 -2.784,-1.888 -1.12,-1.216 -1.728,-2.784 -0.608,-1.568 -0.608,-3.296 0,-1.76 0.608,-3.328 0.608,-1.568 1.728,-2.752 1.15201,-1.216 2.784,-1.92 1.632,-0.704 3.68,-0.704 2.048,0 3.648,0.704 1.632,0.704 2.752,1.92 1.152,1.184 1.76,2.752 0.608,1.568 0.608,3.328 0,1.728 -0.608,3.296 -0.608,1.568 -1.728,2.784 -1.12,1.184 -2.752,1.888 -1.632,0.704 -3.68,0.704 z m -4.384,-8.672 q 0,1.12 0.32,2.048 0.352,0.896 0.928,1.568 0.608,0.672 1.408,1.056 0.8,0.352 1.728,0.352 0.928,0 1.728,-0.352 0.8,-0.384 1.376,-1.056 0.608,-0.672 0.928,-1.6 0.352,-0.928 0.352,-2.048 0,-1.088 -0.352,-2.016 -0.32,-0.928 -0.928,-1.6 -0.576,-0.672 -1.376,-1.024 -0.8,-0.384 -1.728,-0.384 -0.928,0 -1.728,0.384 -0.8,0.384 -1.408,1.056 -0.576,0.672 -0.928,1.6 -0.32,0.928 -0.32,2.016 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2475"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 175.77037,178.81055 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.704,-0.928 -1.95199,-0.928 -0.64001,0 -1.31201,0.256 -0.672,0.256 -1.28,0.736 -0.576,0.448 -1.056,1.088 -0.48,0.64 -0.704,1.408 v 9.792 h -4.288 v -16.768 h 3.872 v 3.104 q 0.928,-1.6 2.688,-2.496 1.76,-0.896 3.968,-0.896 1.568,0 2.56,0.576 0.992,0.576 1.536,1.504 0.544,0.928 0.736,2.112 0.224,1.184 0.224,2.4 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2477"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 186.05887,178.90655 q -1.696,0 -3.072,-0.672 -1.376,-0.672 -2.4,-1.824 -0.992,-1.184 -1.536,-2.72 -0.544,-1.536 -0.544,-3.264 0,-1.824 0.576,-3.392 0.576,-1.568 1.6,-2.752 1.024,-1.184 2.464,-1.856 1.44,-0.672 3.168,-0.672 1.952,0 3.424,0.896 1.472,0.864 2.432,2.336 v -2.944 h 3.744 v 15.968 q 0,1.856 -0.704,3.328 -0.704,1.472 -1.952,2.496 -1.216,1.024 -2.944,1.568 -1.696,0.544 -3.712,0.544 -2.752,0 -4.64,-0.928 -1.856,-0.896 -3.2,-2.56 l 2.336,-2.272 q 0.96,1.184 2.4,1.856 1.472,0.672 3.104,0.672 0.992,0 1.888,-0.288 0.92801,-0.256 1.632,-0.832 0.704,-0.576 1.088,-1.472 0.416,-0.896 0.416,-2.112 v -2.112 q -0.832,1.44 -2.336,2.24 -1.504,0.768 -3.232,0.768 z m 1.44,-3.424 q 0.704,0 1.344,-0.224 0.64,-0.224 1.184,-0.608 0.544,-0.384 0.96,-0.896 0.416,-0.512 0.64,-1.088 v -4 q -0.576,-1.472 -1.824,-2.368 -1.216,-0.896 -2.56,-0.896 -0.992,0 -1.792,0.448 -0.79999,0.416 -1.376,1.152 -0.576,0.704 -0.896,1.632 -0.288,0.928 -0.288,1.92 0,1.024 0.352,1.92 0.352,0.896 0.96,1.568 0.64,0.672 1.472,1.056 0.832,0.384 1.824,0.384 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2479"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 224.03188,159.96255 h -7.26401 v 18.848 h -4.384 v -18.848 h -7.264 v -3.872 h 18.91201 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2481"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 230.58737,179.13055 q -2.016,0 -3.648,-0.672 -1.632,-0.704 -2.784,-1.888 -1.152,-1.184 -1.792,-2.752 -0.608,-1.568 -0.608,-3.296 0,-1.792 0.608,-3.36 0.608,-1.6 1.76,-2.784 1.152,-1.216 2.784,-1.92 1.664,-0.704 3.712,-0.704 2.048,0 3.648,0.704 1.632,0.704 2.752,1.888 1.152,1.184 1.728,2.752 0.608,1.568 0.608,3.264 0,0.416 -0.032,0.8 0,0.384 -0.064,0.64 h -12.96 q 0.096,0.992 0.48,1.76 0.384,0.768 0.992,1.312 0.608,0.544 1.376,0.832 0.768,0.288 1.6,0.288 1.28,0 2.4,-0.608 1.152,-0.64 1.568,-1.664 l 3.68,1.024 q -0.928,1.92 -2.976,3.168 -2.016,1.216 -4.832,1.216 z m 4.352,-10.112 q -0.16,-1.888 -1.408,-3.008 -1.216,-1.152 -2.976,-1.152 -0.864,0 -1.632,0.32 -0.736,0.288 -1.312,0.832 -0.576,0.544 -0.96,1.312 -0.352,0.768 -0.416,1.696 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2483"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 251.98287,165.75455 q -1.952,0.032 -3.488,0.768 -1.536,0.704 -2.208,2.144 v 10.144 h -4.288 v -16.768 h 3.936 v 3.584 q 0.44801,-0.864 1.056,-1.536 0.608,-0.704 1.312,-1.216 0.704,-0.512 1.408,-0.768 0.736,-0.288 1.408,-0.288 0.352,0 0.512,0 0.192,0 0.352,0.032 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2485"
//           inkscape:connector-curvature="0"
//         />
//         <path
//           d="m 280.42187,178.81055 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.28,0 -2.39999,0.992 -1.12,0.96 -1.60001,2.528 v 9.76 h -4.288 v -9.408 q 0,-2.016 -0.704,-2.944 -0.67199,-0.928 -1.888,-0.928 -1.24799,0 -2.4,0.96 -1.11999,0.96 -1.6,2.528 v 9.792 h -4.288 v -16.768 h 3.872 v 3.104 q 0.928,-1.632 2.528,-2.496 1.632,-0.896 3.71201,-0.896 2.11199,0 3.26399,1.024 1.15201,1.024 1.472,2.528 1.024,-1.728 2.592,-2.624 1.568,-0.928 3.584,-0.928 1.536,0 2.52801,0.576 0.99199,0.576 1.536,1.504 0.54399,0.928 0.73599,2.112 0.224,1.184 0.224,2.4 z"
//           style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:32px;font-family:Raleway;-inkscape-font-specification:'Raleway Bold';fill:#ffffff"
//           id="path2487"
//           inkscape:connector-curvature="0"
//         />
//       </g>
//       <path
//         style="fill:none;stroke:#ffffff;stroke-width:0.49000001;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
//         d="m 114.87395,106.05046 v 21.60982"
//         id="path1847-6"
//         inkscape:connector-curvature="0"
//       />
//       <path
//         style="fill:none;stroke:#ffffff;stroke-width:0.49000001;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
//         d="m 193.85339,105.9748 v 21.60982"
//         id="path1847-6-7"
//         inkscape:connector-curvature="0"
//       />
//       <text
//         xml:space="preserve"
//         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.58333302px;line-height:1.25;font-family:Montserrat;-inkscape-font-specification:Montserrat;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"
//         x="28.186066"
//         y="123.8783"
//         id="text995"
//       >
//         <tspan
//           sodipodi:role="line"
//           id="tspan993"
//           x="28.186066"
//           y="123.8783"
//           style="font-size:3.88055563px;fill:#ffffff;stroke-width:0.26458332"
//         >
//           0-2 years
//         </tspan>
//       </text>
//       <text
//         xml:space="preserve"
//         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.58333302px;line-height:1.25;font-family:Montserrat;-inkscape-font-specification:Montserrat;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"
//         x="80.044418"
//         y="123.8783"
//         id="text995-5"
//       >
//         <tspan
//           sodipodi:role="line"
//           id="tspan993-3"
//           x="80.044418"
//           y="123.8783"
//           style="font-size:3.88055563px;fill:#ffffff;stroke-width:0.26458332"
//         >
//           2-5 years
//         </tspan>
//       </text>
//       <text
//         xml:space="preserve"
//         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.58333302px;line-height:1.25;font-family:Montserrat;-inkscape-font-specification:Montserrat;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"
//         x="146.19022"
//         y="123.8783"
//         id="text995-5-5"
//       >
//         <tspan
//           sodipodi:role="line"
//           id="tspan993-3-6"
//           x="146.19022"
//           y="123.8783"
//           style="font-size:3.88055563px;fill:#ffffff;stroke-width:0.26458332"
//         >
//           6-12 years
//         </tspan>
//       </text>
//       <text
//         xml:space="preserve"
//         style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.58333302px;line-height:1.25;font-family:Montserrat;-inkscape-font-specification:Montserrat;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"
//         x="220.27362"
//         y="123.8783"
//         id="text995-5-5-2"
//       >
//         <tspan
//           sodipodi:role="line"
//           id="tspan993-3-6-9"
//           x="220.27362"
//           y="123.8783"
//           style="font-size:3.88055563px;fill:#ffffff;stroke-width:0.26458332"
//         >
//           12+ years
//         </tspan>
//       </text>
//     </g>
//   </svg>;
// };

export default GoalMap;
