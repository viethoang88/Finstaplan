import {
  FloatingMenu,
  MainButton,
  ChildButton,
  Directions,
} from "react-floating-button-menu";
import { useState } from "react";
import {
  CreditCardOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  FundOutlined,
  CloseOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { Label } from "semantic-ui-react";

const iconStyles = { fontSize: "3rem" };
const tooltipStyles = {
  zIndex: "3000",
  position: "relative",
  display: "flex",
  alignSelf: "flex-end",
  alignContent: "flex-end",
  justifyContent: "flex-end",
  margin: "0.5rem",
  transition: "scale 1.5s, background-color 1.5s",
};
const labelStyles = {
  position: "absolute",
  top: "-8rem",
  left: "-4rem",
};

const UserInfoMenus = ({ setActiveMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [peopleHovered, setPeopleHovered] = useState(false);
  const [incomeHovered, setIncomeHovered] = useState(false);
  const [assetsHovered, setAssetsHovered] = useState(false);
  const [liabilitiesHovered, setLiabilitiesHovered] = useState(false);
  const [expensesHovered, setExpensesHovered] = useState(false);

  return (
    <FloatingMenu
      slideSpeed={500}
      direction={Directions.Left}
      spacing={8}
      isOpen={isOpen}
    >
      <MainButton
        iconResting={<i style={iconStyles} className="pi pi-bars"></i>}
        iconActive={<CloseOutlined style={iconStyles} />}
        background="black"
        onClick={() => setIsOpen((prevState) => !prevState)}
        size={94}
      />

      <li style={tooltipStyles}>
        {/* <span>{role}</span> */}
        {peopleHovered && (
          <Label style={labelStyles} pointing="below">
            Add relations
          </Label>
        )}
      </li>

      <ChildButton
        icon={<UsergroupAddOutlined style={{ ...iconStyles }} />}
        background="rgba(184, 166, 236, 0.60)"
        size={78}
        onClick={() => {
          setIsOpen(false);
          setActiveMenu("people");
        }}
        onMouseEnter={() => setPeopleHovered(true)}
        onMouseLeave={() => setPeopleHovered(false)}
      />
      {/* income */}
      <li style={tooltipStyles}>
        {/* <span>{role}</span> */}
        {incomeHovered && (
          <Label style={labelStyles} pointing="below">
            Add incomes
          </Label>
        )}
      </li>

      <ChildButton
        icon={<DollarOutlined style={iconStyles} />}
        background="rgba(102, 226, 102, 0.60)"
        size={78}
        onClick={() => {
          setIsOpen(false);
          setActiveMenu("income");
        }}
        onMouseEnter={() => setIncomeHovered(true)}
        onMouseLeave={() => setIncomeHovered(false)}
      />
      {/* assets */}
      <li style={tooltipStyles}>
        {/* <span>{role}</span> */}
        {assetsHovered && (
          <Label style={labelStyles} pointing="below">
            Add assets
          </Label>
        )}
      </li>
      <ChildButton
        icon={<FundOutlined style={iconStyles} />}
        background="rgba(102, 226, 102, 0.60)"
        size={78}
        onClick={() => {
          setIsOpen(false);
          setActiveMenu("assets");
        }}
        onMouseEnter={() => setAssetsHovered(true)}
        onMouseLeave={() => setAssetsHovered(false)}
      />
      {/* liabilities */}
      <li style={tooltipStyles}>
        {/* <span>{role}</span> */}
        {liabilitiesHovered && (
          <Label style={labelStyles} pointing="below">
            Add liabilities
          </Label>
        )}
      </li>
      <ChildButton
        icon={<CreditCardOutlined style={iconStyles} />}
        background="rgba(224, 103, 103, 0.60)"
        size={78}
        onClick={() => {
          setIsOpen(false);
          setActiveMenu("liabilities");
        }}
        onMouseEnter={() => setLiabilitiesHovered(true)}
        onMouseLeave={() => setLiabilitiesHovered(false)}
      />
      {/* expenses */}
      <li style={tooltipStyles}>
        {/* <span>{role}</span> */}
        {expensesHovered && (
          <Label style={labelStyles} pointing="below">
            Add expenses
          </Label>
        )}
      </li>
      <ChildButton
        icon={<MinusOutlined style={iconStyles} />}
        background="rgba(224, 103, 103, 0.60)"
        size={78}
        onClick={() => {
          setIsOpen(false);
          setActiveMenu("expenses");
        }}
        onMouseEnter={() => setExpensesHovered(true)}
        onMouseLeave={() => setExpensesHovered(false)}
      />
    </FloatingMenu>
  );
};

export default UserInfoMenus;
