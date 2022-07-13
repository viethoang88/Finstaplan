import { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import NewClientModal from "./new-client-modal";
import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
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
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// <MenuOutlined />

// <CalculatorOutlined />
// <DatabaseOutlined />    (all clients)
// <UnlockOutlined />      (for admins...)
// <LockOutlined />
// <FilePdfOutlined />
// <FilePptOutlined />
// <Html5Outlined />
// <MailOutlined />

const SideNav = (props) => {
  const dispatch = useDispatch();
  const advisorId = useSelector((state) => state.auth.sub);
  const advisor = useSelector((state) => state.auth);
  const showNewClientModal = useSelector(
    (state) => state.ui?.showNewClientModal
  );

  const [collapsed, onCollapsedChange] = useState(true);

  const router = useRouter();

  const onCollapse = (collapsed) => {
    onCollapsedChange(collapsed);
  };

  const _setShowCreateClientModal = (bool) => {
    // setShowCreateClientModal(false);
    dispatchModalBool(bool);
  };

  const dispatchModalBool = (bool) => {
    dispatch(
      uiSliceActions.setAttribute({
        attribute: "showNewClientModal",
        newVal: bool,
      })
    );
  };

  // useEffect(() => {
  //   setShowCreateClientModal(showNewClientModal);
  // }, [showNewClientModal]);

  // https://ant.design/components/menu/
  return (
    <>
      {showNewClientModal && (
        <NewClientModal
          setShowModal={_setShowCreateClientModal}
          showModal={showNewClientModal}
        />
      )}
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
          {collapsed && (
            <Menu.Item
              onClick={() => onCollapse(false)}
              key="0"
              icon={<MenuOutlined />}
            >
              Expand Menu
            </Menu.Item>
          )}
          {!collapsed && (
            <Menu.Item
              onClick={() => onCollapse(true)}
              key="0"
              icon={<MenuFoldOutlined />}
            >
              Close Menu
            </Menu.Item>
          )}
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>

          <Menu.Item
            key="2"
            icon={<SettingOutlined />}
            onClick={() => router.push(`/auth/${advisorId}/assumptions`)}
          >
            Assumptions & Other Variables
          </Menu.Item>

          <Menu.Item
            key="3"
            icon={<PlusSquareOutlined />}
            onClick={() => {
              _setShowCreateClientModal(true);
              // setShowCreateClientModal(true);
              // dispatch(
              //   uiSliceActions.setAttribute({
              //     attribute: "showNewClientModal",
              //     value: true,
              //   })
              //);
            }}
          >
            Create client
          </Menu.Item>

          <SubMenu key="sub1" icon={<UserOutlined />} title="Client">
            <Menu.Item key="4" icon={<InfoCircleOutlined />}>
              Client details
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<PieChartOutlined />}
              onClick={() => router.push(`/auth/${advisorId}/benchmarking`)}
            >
              Benchmark client
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={<SafetyOutlined />}
              onClick={() => router.push(`/auth/${advisorId}/insurance`)}
            >
              Client insurance
            </Menu.Item>
            <Menu.Item
              key="7"
              icon={<SafetyOutlined />}
              onClick={() => router.push(`/auth/${advisorId}/preassessment`)}
            >
              Request Insurance Preassessment
            </Menu.Item>
            <Menu.Item
              key="11"
              icon={<SafetyOutlined />}
              onClick={() =>
                router.push(`/auth/${advisorId}/preassessment/quotes`)
              }
            >
              Insurance Preassessments
            </Menu.Item>
            <Menu.Item
              key="8"
              icon={<OrderedListOutlined />}
              onClick={() => router.push(`/auth/${advisorId}/goals`)}
            >
              Goal allocation
            </Menu.Item>
            <Menu.Item key="9" icon={<CalculatorOutlined />}>
              Generate report
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="10"
            icon={<TeamOutlined />}
            onClick={() => router.push(`/auth/${advisorId}/clients`)}
          >
            Clients
          </Menu.Item>
          {/* <SubMenu key="sub2" icon={<TeamOutlined />} title="Clients">
            <Menu.Item key="9">Team 1</Menu.Item>
            <Menu.Item key="10">Team 2</Menu.Item>
          </SubMenu> */}
        </Menu>
      </Sider>
    </>
  );
};
export default SideNav;

// #components-layout-demo-side .logo {
//   height: 32px;
//   margin: 16px;
//   background: rgba(255, 255, 255, 0.3);
// }

// .site-layout .site-layout-background {
//   background: #fff;
// }
