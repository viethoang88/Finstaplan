import classes from "./person-item.module.css";
// import Image from "next/image";
import { Button, Transition } from "semantic-ui-react";
import { useState } from "react";
import PersonItemModal from "./person-item-modal";
import { useEffect } from "react";

const propertyExistsToBoolean = (property) => {
  return property !== undefined && property !== "";
};

const moreInfoNeeded = (currentPerson, role, binContains) => {
  if (role === "pet") return false;
  if (binContains === "dependents")
    return [
      propertyExistsToBoolean(currentPerson.firstName),
      propertyExistsToBoolean(currentPerson.lastName),
      propertyExistsToBoolean(currentPerson.gender),
      propertyExistsToBoolean(currentPerson.dateOfBirth),
      // propertyExistsToBoolean(currentPerson.healthStatus),
      propertyExistsToBoolean(currentPerson.relatedTo),
      propertyExistsToBoolean(currentPerson.studying),
    ].some((val) => val === false);
  else
    return [
      propertyExistsToBoolean(currentPerson.firstName),
      propertyExistsToBoolean(currentPerson.lastName),
      propertyExistsToBoolean(currentPerson.gender),
      propertyExistsToBoolean(currentPerson.dateOfBirth),
      // propertyExistsToBoolean(currentPerson.healthStatus),
      propertyExistsToBoolean(currentPerson.employed),
      propertyExistsToBoolean(currentPerson.dateOfBirth),
      propertyExistsToBoolean(currentPerson.email),
      propertyExistsToBoolean(currentPerson.mobile),
      propertyExistsToBoolean(currentPerson.otherAdvisors),
      propertyExistsToBoolean(currentPerson.streetAddress),
      propertyExistsToBoolean(currentPerson.city),
      propertyExistsToBoolean(currentPerson.state),
      propertyExistsToBoolean(currentPerson.zipCode),
      // propertyExistsToBoolean(currentPerson.existingStructures),
      //propertyExistsToBoolean(currentPerson.likeToDo), // TODO: VERIFY THIS
    ].some((val) => val === false);
};

const PersonItem = (props) => {
  const {
    src,
    height,
    width,
    role,
    id,
    removeItem,
    type,
    name,
    gender,
    currentPerson,
    updatePerson,
    binContains,
    binStateIndex,
    idx,
  } = props;

  const needInfo = moreInfoNeeded(currentPerson, role, binContains);

  const [hovered, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [_moreInfoNeeded, _setMoreInfoNeeded] = useState(needInfo || false);

  useEffect(() => {
    _setMoreInfoNeeded(needInfo);
  }, [needInfo]);

  const showModalHandler = (e) => {
    setShowModal(true);
  };

  const { firstName, lastName, legacyNominee, health, relatedTo, dateOfBirth } =
    currentPerson;
  const { assets, expenses, incomes, liabilities } = currentPerson;

  const modal = (
    <PersonItemModal
      showModal={showModal}
      setShowModal={setShowModal}
      src={src}
      role={role}
      type={type}
      name={name}
      gender={gender}
      firstName={firstName || ""}
      lastName={lastName || ""}
      legacyNominee={legacyNominee || false}
      health={health || ""}
      relatedTo={relatedTo || ""}
      assets={assets || []}
      expenses={expenses || []}
      incomes={incomes || []}
      liabilities={liabilities || []}
      updatePerson={updatePerson}
      dateOfBirth={dateOfBirth}
      binContains={binContains}
      binStateIndex={binStateIndex}
      idx={idx}
    />
  );

  console.log("--- PERSON ITEM CURRENT PERSON ---");
  console.log(currentPerson);

  return (
    <div
      key={`${role}_${id}`}
      className={`${classes.person} ${
        needInfo ? classes.person_info_required : ""
      }`}
      style={{ zIndex: 10000 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => showModalHandler(e)}
    >
      {modal}
      <div onClick={() => setShowModal(true)} className={classes.person_name}>
        {firstName !== null ? firstName : ""}
      </div>
      {role !== "pet" && (
        <div
          className={`${classes.person_image} ${
            needInfo ? classes.person_image_info_required : ""
          }`}
          onClick={showModalHandler}
        >
          {needInfo && (
            <div className={classes.thought_container}>
              <div className={classes.thought}>
                <div className={classes.thought_text}>
                  I require more information!
                </div>
              </div>
            </div>
          )}
          {!needInfo && role !== "child" && (
            <i
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                position: "relative",
                top: "14.4rem",
                left: "4rem",
                zIndex: 2555,
                // color: "darkgreen",
              }}
              className={"pi pi-check"}
            />
          )}
          {!needInfo && role === "child" && (
            <i
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                position: "relative",
                top: "-0.5rem",
                left: "7.5rem",
                zIndex: 2555,
                // color: "darkgreen",
              }}
              className={"pi pi-check"}
            />
          )}
          {/* <Image  */}
          <img
            src={src}
            style={{
              minHeight: height * 2.5,
              maxHeight: height * 2.5,
              minWidth: width * 2.5,
              maxWidth: width * 2.5,
              position: "relative",
              top: "-6.2rem",
              right: role === "child" && !needInfo ? "1rem" : "0rem",
            }}
          />
        </div>
      )}
      {role === "pet" && (
        <div className={classes.person_image}>
          <img
            src={src}
            style={{
              minHeight: height * 2.5,
              maxHeight: height * 2.5,
              minWidth: width * 2.5,
              maxWidth: width * 2.5,
              position: "relative",
              top: "-6.1rem",
            }}
          />
        </div>
      )}
      {/* <Transition visible={showModal} animation={"fly right"} duration={"800"}>
        {modal}
      </Transition> */}

      {hovered &&
        binStateIndex !== "primary" &&
        binStateIndex !== "partner" && (
          <Button
            className={classes.delete_button}
            onClick={removeItem}
            circular
            color="google plus"
            icon="user delete"
          />
        )}
    </div>
  );
};

export default PersonItem;
