import { useSelector, useDispatch } from "react-redux";
import { factFindActions } from "../../../store/fact-find";
import { useState } from "react";
import ExistingStructureDetails from "./existing-structures-details";
import { useEffect } from "react";
import { constructKeytip } from "@fluentui/react";
const structuresToCareAbout = ["smsf", "trust", "company"];

const generateExistingStructuresOptions = (
  existingStructuresPrimary = [],
  existingStructuresPartner = []
) => {
  if (existingStructuresPrimary === null && existingStructuresPartner === null)
    return [];

  console.log(existingStructuresPrimary);
  console.log(existingStructuresPartner);
  let newOptions = existingStructuresPrimary
    ?.filter((struct) => structuresToCareAbout.includes(struct))
    ?.map((struct) => ({
      createdBy: "primary",
      structure: struct,
      name: "",
      owner: null,
    }));
  if (existingStructuresPartner !== null && newOptions !== undefined) {
    newOptions = newOptions.concat(
      existingStructuresPartner
        ?.filter((struct) => structuresToCareAbout.includes(struct))
        ?.map((struct) => ({
          createdBy: "partner",
          structure: struct,
          name: "",
          owner: null,
        }))
    );
  }
  console.log(newOptions);
  return newOptions;
};

const generateExistingStructuresJSX = (
  hasPartner,
  existingStructureOptions,
  existingStructuresUpdaterFn,
  primaryName,
  partnerName,
  currentPerson
) => {
  if (
    existingStructureOptions === undefined ||
    existingStructureOptions?.length === 0 ||
    !existingStructureOptions?.map
  )
    return;

  //   console.log(primaryName);
  //   const client = primaryName === "primary" ? "Unnamed Client" : primaryName;
  //   const partner =
  //     !partnerName || partnerName === "partner" ? "Unnamed Partner" : partnerName;

  return existingStructureOptions.map(
    ({ createdBy, structure, name, owner }, idx) => (
      <ExistingStructureDetails
        onChangeHandler={existingStructuresUpdaterFn}
        idx={idx}
        createdBy={createdBy}
        structure={structure}
        name={name}
        owner={owner}
        hasPartner={hasPartner}
        primaryName={primaryName}
        partnerName={partnerName}
        currentPerson={currentPerson}
      />
    )
  );
};

const ExistingStructures = ({
  existingStructures,
  currentPerson,
  primaryName,
  partnerName,
}) => {
  const dispatch = useDispatch();

  const hasPartner = useSelector((state) => state.factFind.hasPartner);

  const existingStructuresPrimary = useSelector(
    (state) => state.factFind.primary?.existingStructures
  );
  const existingStructuresPartner = useSelector(
    (state) => state.factFind.partner?.existingStructures
  );

  const existingStructureDetails = useSelector(
    (state) => state.factFind.existingStructureDetails
  );

  const [existingStructureOptions, setExistingStructureOptions] = useState([]);

  const handleUpdateExistingStructureOptions = (idx, name, newValue) => {
    console.log("GOT IT ABOVE");
    console.log("idx");
    console.log(name);
    console.log(newValue);
    const [createdBy, structure, toUpdate] = name.split("-");
    setExistingStructureOptions((prevState) => {
      const newState = [...prevState];
      const updatedOption = { ...prevState[idx] };
      console.log("OLD STATE");
      console.log(newState);
      console.log("OLD OPTION");
      console.log(updatedOption);
      updatedOption[toUpdate] = newValue;
      console.log(updatedOption);
      newState[idx] = updatedOption;
      console.log("NEW STATE");
      console.log(newState);
      dispatch(
        factFindActions.updateState({ existingStructureDetails: newState })
      );
      return newState;
    });
  };

  const buildDetailsBasedOnCurrentPerson = (currentPerson) => {
    if (currentPerson === "primary") {
      return generateExistingStructuresOptions(
        existingStructures,
        existingStructuresPartner
      );
    } else {
      return generateExistingStructuresOptions(
        existingStructuresPrimary,
        existingStructures
      );
    }
  };
  const checkIfElementExists = (es, storedDetails) => {
    for (let sd of storedDetails) {
      console.log(sd);
      console.log(es);
      if (sd.createdBy === es.createdBy && sd.structure === es.structure)
        return false;
    }
  };

  const updateExistingStructures = (existingStructures) => {
    if (existingStructureDetails && existingStructureDetails?.length > 0) {
      // merge changes to existingStructures with the details from the store before proceeding
      const storedDetails = existingStructureDetails.filter(
        (es) =>
          existingStructures.includes(es.structure) ||
          es.createdBy !== currentPerson
      );
      console.log("LOOKING AT STORED DETS");
      console.log(storedDetails);
      const newDetails = buildDetailsBasedOnCurrentPerson(currentPerson).filter(
        (es) => checkIfElementExists(es, storedDetails)
      );
      console.log("Data ready for merge:");
      console.log([...storedDetails, ...newDetails]);
      setExistingStructureOptions([...storedDetails, ...newDetails]);
    } else {
      const _existingStructureOptions =
        buildDetailsBasedOnCurrentPerson(currentPerson);
      setExistingStructureOptions(_existingStructureOptions);
    }
  };

  useEffect(() => {
    console.log(existingStructureDetails);
  }, [existingStructureDetails]);

  useEffect(() => {
    updateExistingStructures(existingStructures);
  }, []);

  useEffect(() => {
    console.log("existingStructures changed");
    console.log(existingStructures);
    updateExistingStructures(existingStructures);
  }, [existingStructures]);

  return (
    <>
      {generateExistingStructuresJSX(
        hasPartner,
        existingStructureOptions,
        handleUpdateExistingStructureOptions,
        primaryName,
        partnerName,
        currentPerson
      )}
    </>
  );
};

export default ExistingStructures;
