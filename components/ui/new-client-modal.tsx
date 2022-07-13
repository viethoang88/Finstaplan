import { useDispatch, useSelector } from "react-redux";
import {
  createNewClient,
  authSliceActions,
  createNewClientAsync,
  createNewClientAsyncPromise,
} from "../../store/auth";
import { factFindActions } from "../../store/fact-find";
import { Modal, Button } from "semantic-ui-react";
import { Form, DatePicker, TimePicker } from "antd";
// import { prefixSelector } from "../../components/ff/person-item-modal-form";
import GetBasicInfo from "./get-basic-info";
import { v4 as uuidv4 } from "uuid";
import { Input, Select, AutoComplete, Divider } from "antd";
const { Option } = Select;
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import FFHeaderItem from "../ff//ff-header-item";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    l: { span: 14 },
    xl: { span: 14 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    l: { span: 14 },
    xl: { span: 14 },
  },
};

const man = {
  gender: "male",
  height: 68,
  name: "man",
  src: "/assets/images/6-man.svg",
  type: "adult",
  role: "parent",
  width: 62,
};
const woman = {
  gender: "female",
  height: 68,
  name: "woman",
  src: "/assets/images/7-woman.svg",
  type: "adult",
  role: "parent",
  width: 62,
};
const other = {
  gender: "other",
  height: 68,
  name: "woman",
  src: "/assets/images/12-neutral.svg",
  type: "adult",
  role: "parent",
  width: 62,
};

const uiDataFromGender = {
  male: man,
  female: woman,
  other: other,
};

const shapeDataForStore = (fields) => {
  const newPrimary = {
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    relationshipStatus: "",
    gender: "",
    expenses: [],
    liabilities: [],
    assets: [],
    incomes: [],
    healthStatus: "",
  };

  const newPartner = {};

  for (let [k, v] of Object.entries(fields)) {
    let newV = v;
    const [target, key] = k.split("_");
    // if (key === "dateOfBirth") newV = new Date(v).toDateString();
    if (key === "gender") {
      const uiData = uiDataFromGender[newV];
      if (target === "primary") newPrimary["uiData"] = uiData;
      else if (target === "partner") newPartner["uiData"] = uiData;
    }

    if (key === "dateOfBirth" && v) {
      // console.log("----- IN DATE OF BIRTH ---");
      // console.log(key);
      // console.log(v);
      // console.log(new Date(v).toDateString());
      if (target === "primary")
        newPrimary["dateOfBirth"] = new Date(v).toDateString();
      else if (target === "partner")
        newPartner["dateOfBirth"] = new Date(v).toDateString();
    }

    if (target === "primary") {
      newPrimary[key] = newV;
    } else if (target === "partner") {
      newPartner[key] = newV;
    }
  }
  return [newPrimary, newPartner];
};

const updatePartnerForStore = (newPartner, newPrimary) => {
  const updatedPartner = { ...newPartner };
  updatedPartner["expenses"] = [];
  updatedPartner["liabilities"] = [];
  updatedPartner["assets"] = [];
  updatedPartner["incomes"] = [];
  updatedPartner["healthStatus"] = "";
  return updatedPartner;
};

const NewClientModal = ({ setShowModal, showModal }) => {
  //date of birth, partners name, emails, name, last name, phone number
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const advisorId = useSelector((state) => state.auth.sub);
  const newClient = useSelector((state) => state.factFind);
  const router = useRouter();
  const [relationshipStatus, setRelationshipStatus] = useState(undefined);
  const [primaryNumber, setPrimaryNumber] = useState();
  const [partnerNumber, setPartnerNumber] = useState();
  const [clientCreated, setClientCreated] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);
  const [newPartner, setNewPartner] = useState(undefined);
  const [newPrimary, setNewPrimary] = useState(undefined);
  const [blankFFLoading, setBlankFFLoading] = useState(false);
  const newClientId = useMemo(() => {
    return uuidv4();
  }, []);
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  useEffect(() => {
    dispatch(factFindActions.reset());
  }, []);

  const [clientLinkGenerated, setClientLinkGenerated] = useState(false);
  const [clientLink, setClientLink] = useState("");
  const createClientLink = () => {
    setClientLinkGenerated(true);
    setClientLink(`${process.env.SITE_URL}/client/${newClientId}`);
  };

  const handleCreateClient = async (callback) => {
    // console.log("CLIENT IS CREATED");
    // console.log(clientCreated);

    if (clientCreated && callback) {
      if (newPrimary) {
        updateStore(
          newPrimary,
          newPartner,
          newClientId,
          showPartnerForm,
          advisorId
        );
      }
      return callback(newClientId);
    }

    setClientLoading(true);
    form
      .validateFields()
      .then((values) => {
        const hasPartner = showPartnerForm;
        const [newPrimary, newPartner] = shapeDataForStore(values);
        const _newClient = {
          ...newClient,
          id: newClientId,
          primary: newPrimary,
          partner: newPartner,
          advisorID: advisorId,
          hasPartner: hasPartner,
        };
        delete _newClient["advisor"];

        setNewPrimary(newPrimary);
        setNewPartner(newPartner);

        if (!clientCreated) {
          createNewClientAsyncPromise(advisorId, _newClient, newClientId)
            .then((success) => {
              // console.log(success);
              if (success) {
                setClientCreated(true);
                setClientLoading(false);
                if (typeof callback === "function") callback(newClientId);
              } else {
                setClientLoading(false);
              }
            })
            .catch((e) => {
              setClientLoading(false);
            });
        }
      })
      .catch((e) => console.log(e));
  };

  // useEffect(() => {
  //   console.log("WE HAVE A NEW CLIENT");
  //   console.log(newClient);
  // }, [newClient]);

  const updateStore = (
    newPrimary,
    newPartner,
    newClientId,
    hasPartner,
    advisorId
  ) => {
    // console.log("--- DISPATCHING CHANGES ---");
    dispatch(
      factFindActions.updatePerson({
        action: "ADD_PARTNER",
        key: "primary",
        person: newPrimary,
      })
    );

    dispatch(
      factFindActions.updateClientData({
        action: "SET",
        key: "id",
        newVal: newClientId,
      })
    );
    dispatch(
      factFindActions.updateClientData({
        action: "SET",
        key: "advisorID",
        newVal: advisorId,
      })
    );

    if (hasPartner) {
      const partnerReadyForStore = updatePartnerForStore(
        newPartner,
        newPrimary
      );
      dispatch(
        factFindActions.updateClientData({
          action: "SET",
          key: "hasPartner",
          newVal: true,
        })
      );
      dispatch(
        factFindActions.updateClientData({
          action: "SET",
          key: "id",
          newVal: newClientId,
        })
      );
      dispatch(
        factFindActions.updatePerson({
          action: "ADD_PARTNER",
          key: "partner",
          person: partnerReadyForStore,
        })
      );
    }
  };

  const onRelationshipStatusChange = (status) => {
    setRelationshipStatus(status);
    if (
      status !== undefined &&
      status !== "single" &&
      status !== "divorced" &&
      status !== "engaged"
    ) {
      setShowPartnerForm(true);
    } else {
      setShowPartnerForm(false);
    }
  };

  const createBlankFactFind = () => {
    setBlankFFLoading(true);
    setClientCreated(true);
    setTimeout(() => {
      router.push(`/auth/${advisorId}/ff/${uuidv4()}`);
    }, 2000);
  };

  return (
    <>
      <Modal onClose={() => setShowModal(false)} open={showModal}>
        <Modal.Header>
          Create New Client or&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            content="Start a Blank Fact-Find"
            labelPosition="right"
            icon="edit"
            className={"ui inverted purple button"}
            onClick={() => createBlankFactFind()}
            positive
            loading={blankFFLoading}
          />
        </Modal.Header>
        <Modal.Content image scrolling>
          <Modal.Description style={{ width: "100%" }}>
            <h2>Select Fact-Find Order</h2>
            {!clientCreated && (
              <div style={{ marginBottom: "2rem", marginLeft: "4.5rem" }}>
                <DndProvider backend={HTML5Backend}>
                  <FFHeaderItem />
                </DndProvider>
              </div>
            )}

            <Form {...formItemLayout} form={form}>
              <GetBasicInfo
                label="Primary Client Information"
                target="primary"
                onRelationshipStatusChange={onRelationshipStatusChange}
                number={primaryNumber}
                setNumber={setPrimaryNumber}
              />
              {showPartnerForm && (
                <GetBasicInfo
                  label="Partner Information"
                  target="partner"
                  number={partnerNumber}
                  setNumber={setPartnerNumber}
                />
              )}
            </Form>
            <div
              style={{
                background: "#f9fafb",
                // float: "right",
                borderTop: "2px solid rgba(34,36,38,.15)",
                padding: "1rem 1rem",
                textAlign: "right",
                width: "100%",
              }}
            >
              <Button
                content="Close"
                labelPosition="right"
                icon="cancel"
                color="black"
                onClick={() => setShowModal(false)}
                negative
              />

              {/* <Button
                  htmlType="submit"
                  content="Save changes"
                  labelPosition="right"
                  icon="checkmark"
                  // onClick={handleSaveChanges}
                  positive
                /> */}
              <Button
                content={clientCreated ? "Client Created" : "Create Client"}
                disabled={clientCreated}
                labelPosition="right"
                icon="plus"
                onClick={() => handleCreateClient(false)}
                // onClick={handleSaveChanges}
                loading={clientLoading}
                positive={clientLoading}
              />
              <Button
                basic
                color="blue"
                content={"Create Client With Link"}
                labelPosition="right"
                icon="linkify"
                onClick={() => {
                  // handleCreateClient(false);
                  createClientLink();
                }}
              />
              <Button
                htmlType="submit"
                content={
                  clientLoading ? "Starting Fact Find" : "Start Fact-Find"
                }
                labelPosition="right"
                icon="edit"
                className={"ui inverted purple button"}
                onClick={() => {
                  handleCreateClient((newClientId) =>
                    router.replace(`/auth/${advisorId}/ff/${newClientId}`)
                  );
                }}
                loading={clientLoading}
                positive
              />
            </div>
            {clientLinkGenerated && (
              <div
                style={{
                  paddingLeft: "3rem",
                  paddingRight: "3rem",
                  paddingTop: ".5rem",
                }}
              >
                Email this link to your client and they can commence the
                fact-find process: <a>{clientLink}</a>
              </div>
            )}
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default NewClientModal;
