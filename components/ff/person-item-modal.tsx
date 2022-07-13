import { Button, Icon, Image, Modal, Header } from "semantic-ui-react";
import PersonItemModalForm from "./person-item-modal-form";
import React, { forwardRef, useRef, useState } from "react";

const PersonItemModal = (props) => {
  const {
    showModal,
    setShowModal,
    src,
    role,
    type,
    name,
    gender,
    firstName,
    lastName,
    legacyNominee,
    health,
    relatedTo,
    assets,
    expenses,
    incomes,
    liabilities,
    updatePerson,
    binContains,
    dateOfBirth,
    idx,
    binStateIndex,
  } = props;

  const handleSaveChanges = () => setShowModal(false);

  console.log(role);

  const inputForm = (
    <PersonItemModalForm
      role={role}
      type={type}
      name={name}
      gender={gender}
      firstName={firstName}
      lastName={lastName}
      legacyNominee={legacyNominee}
      health={health}
      relatedTo={relatedTo}
      assets={assets}
      expenses={expenses}
      incomes={incomes}
      liabilities={liabilities}
      updatePerson={updatePerson}
      binContains={binContains}
      dateOfBirth={dateOfBirth}
      binStateIndex={binStateIndex}
      idx={idx}
      handleSaveChanges={handleSaveChanges}
      closeModal={() => setShowModal(false)}
    />
  );

  return (
    <Modal size={"large"} onClose={() => setShowModal(false)} open={showModal}>
      <Modal.Header>Edit {firstName ? firstName : "Person"}</Modal.Header>
      <Modal.Content image scrolling>
        <Modal.Description style={{ width: "100%" }}>
          {inputForm}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default PersonItemModal;
