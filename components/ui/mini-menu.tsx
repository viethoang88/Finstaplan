import { Button as PRButton } from "primereact/button";
import { useRef, useMemo } from "react";
import { Menu } from "primereact/menu";
import classes from "./mini-menu.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { uiSliceActions } from "../../store/ui";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  PlusSquareOutlined,
  UserAddOutlined,
  SettingOutlined,
  SafetyOutlined,
  OrderedListOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getScopingDocument } from "./adviser-layout";
/*
       <SubMenu key="sub1" icon={<UserOutlined />} title="Client">
            <Menu.Item key="4" icon={<InfoCircleOutlined />}>
              Client details
            </Menu.Item>
            <Menu.Item key="5" icon={<PieChartOutlined />}>
              Benchmark client
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={<SafetyOutlined />}
              onClick={() => router.push(`/auth/${advisorId}/insurance`)}
            >
              Client insurance
            </Menu.Item>
            <Menu.Item key="7" icon={<OrderedListOutlined />}>
              Goal allocation
            </Menu.Item>
            <Menu.Item key="8" icon={<CalculatorOutlined />}>
              Generate report
            </Menu.Item>
*/

export const getMenuItems = (
  router,
  advisorId,
  clientData,
  dispatch,
  showInsuranceCalc
) => [
  {
    label: "Client Summary",
    icon: "pi pi-info-circle",
    command: () => router.push(`/auth/${advisorId}/client`),
  },
  {
    label: "Benchmark Client",
    icon: "pi pi-chart-bar",
    command: () => router.push(`/auth/${advisorId}/benchmarking`),
  },
  {
    label: `${showInsuranceCalc ? "Hide" : "Show"} Insurance Calculator`,
    icon: "pi pi-shield",
    command: () => {
      dispatch(
        uiSliceActions.setAttribute({
          attribute: "showInsuranceCalc",
          newValue: !showInsuranceCalc,
        })
      );
    },
    //command: () => router.push(`/auth/${advisorId}/insurance`),
  },
  {
    label: "Goal Allocation",
    icon: "pi pi-sitemap",
    command: () => router.push(`/auth/${advisorId}/goals`),
  },
  {
    label: "Generate Report",
    icon: "pi pi-file",
    //command: () => router.push(`/auth/${advisorId}/goals`),
  },
  {
    label: "Generate Scoping Document",
    icon: "pi pi-file",
    command: async () => {
      getScopingDocument(advisorId, clientData);
    },
  },
];

const MiniMenu = () => {
  const dispatch = useDispatch();
  const advisorId = useSelector((state) => state.auth.sub);
  const clientData = useSelector((state) => state.factFind);
  const showInsuranceCalc = useSelector((state) => state.ui.showInsuranceCalc);
  const menuRef = useRef();
  const router = useRouter();

  const items = useMemo(() => {
    return getMenuItems(
      router,
      advisorId,
      clientData,
      dispatch,
      showInsuranceCalc
    );
  }, [advisorId, clientData, showInsuranceCalc]);

  return (
    <>
      <Menu model={items} popup ref={menuRef} />
      <PRButton
        onClick={(event) => menuRef.current.toggle(event)}
        className={`p-button-rounded p-button-raised p-button-text p-button-primary ${classes.menu_button}`}
      >
        <span className={classes.menu_button_f}>ƒ</span>
        <span className={classes.menu_button_i}>i</span>
        <span className={classes.menu_button_p}>p</span>
      </PRButton>
    </>
  );
};

export default MiniMenu;
