import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import { Button } from "primereact/button";

/* https://www.npmjs.com/package/react-signature-canvas */

/* signature ref API:
    isEmpty() : boolean, self-explanatory
    clear() : void, clears the canvas using the backgroundColor prop
    fromDataURL(base64String, options) : void, writes a base64 image to canvas
    toDataURL(mimetype, encoderOptions): base64string, returns the signature image as a data URL
    fromData(pointGroupArray): void, draws signature image from an array of point groups
    toData(): pointGroupArray, returns signature image as an array of point groups
    off(): void, unbinds all event handlers
    on(): void, rebinds all event handlers
    getCanvas(): canvas, returns the underlying canvas ref. Allows you to modify the canvas however you want or call methods such as toDataURL()
    getTrimmedCanvas(): canvas, creates a copy of the canvas and returns a trimmed version of it, with all whitespace removed.
    getSignaturePad(): SignaturePad, returns the underlying SignaturePad reference.
*/

const Sign = ({ firstName, lastName, signatureUpdateHandler }) => {
  let signatureRef = useRef(null);
  const updateSignatureHandler = (something) => {
    console.log(something);
  };
  const onSignatureResetHandler = (e) => {
    e.preventDefault();
    console.log(e);
    signatureRef.clear();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <SignatureCanvas
          ref={(ref) => {
            signatureRef = ref;
          }}
          onEnd={updateSignatureHandler}
          penColor="blue"
          canvasProps={{
            width: 250,
            height: 100,
            style: {
              border: "1.1px solid lightslategray",
              margin: "0.7rem",
              marginBottom: "1.1rem",
            },
          }}
        />
        <Button
          icon="pi pi-refresh"
          className="p-button-rounded p-button-outlined p-button-raised p-button-danger"
          onClick={onSignatureResetHandler}
          tooltip={"Reset signature"}
          style={{ position: "relative", top: "-1.5rem", marginRight: "2rem" }}
        />
      </div>
      <div
        style={{
          fontWeight: 700,
          margin: "0.7rem",
          position: "relative",
          left: ".55rem",
          top: "-1.95rem",
        }}
      >
        {firstName} {lastName}
      </div>
    </div>
  );
};

export default Sign;
