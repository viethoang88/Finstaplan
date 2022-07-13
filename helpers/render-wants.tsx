export const extractWants = (clientData) => {
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

export const wantsToHtmlList = (wants, names) => {
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
