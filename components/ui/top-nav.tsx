import { Button } from "primereact/button";
import { signOut } from "next-auth/client";
import classes from "./top-nav.module.css";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Toolbar } from "primereact/toolbar";
import { SplitButton } from "primereact/splitbutton";
// import { Breadcrumb } from "antd";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Auth } from "aws-amplify";
import { useDispatch } from "react-redux";
import { asyncLogout, authSliceActions } from "../../store/auth";

const TopNav = (props) => {
  const activeClient = useSelector((state) => state.auth.activeClient);
  const advisorId = useSelector((state) => state.auth.sub);
  // const partnerName = useSelector((state => state.factFind.partner.firstName));
  // const primaryName = useSelector((state) => state.factFind.primary.firstName));

  const defaultActive =
    activeClient?.lastName === undefined
      ? "Unknown Last Name"
      : `${activeClient.lastName} Family`;
  const primaryName =
    activeClient?.primary === undefined
      ? "Unnamed Client"
      : activeClient?.primary;
  const partnerName =
    activeClient?.partner === undefined
      ? "Unnamed Partner"
      : activeClient?.partner;
  const [activeFamilyMember, setActiveFamilyMember] = useState(defaultActive);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(
  //     authSliceActions.setAttribute({
  //       attribute: "activeClient",
  //       value: {
  //         lastName: "van der Westhuizen",
  //         primary: "Tjaart",
  //         partner: "Cecille",
  //         children: ["Nikolas", "Lienke"],
  //         activeMember: "van der Westhuizen",
  //       },
  //     })
  //   );
  // }, []);
  useEffect(() => {
    if (activeClient?.lastName !== undefined)
      setActiveFamilyMember(`${activeClient.lastName} Family`);
  }, [activeClient?.id, activeClient?.lastName]);

  useEffect(() => {
    if (activeClient !== undefined && activeFamilyMember !== undefined) {
      dispatch(
        authSliceActions.updateClientDataNested({
          newValue: activeFamilyMember,
          action: "UPDATE",
          path: ["activeClient", "activeMember"],
        })
      );
    }
  }, [activeFamilyMember]);

  let activeClientItems = [];

  const [search, setSearch] = useState();
  const router = useRouter();

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  const breadcrumbItems = [];

  if (activeClient) {
    activeClientItems.push({
      label: defaultActive,
      icon: "pi pi-users",
      command: () => setActiveFamilyMember(activeClient?.lastName),
    });
    activeClientItems.push({
      label: primaryName,
      icon: "pi pi-user",
      command: () => setActiveFamilyMember(activeClient?.primary),
    });
    if (activeClient?.partner) {
      activeClientItems.push({
        label: partnerName,
        icon: "pi pi-user",
        command: () => setActiveFamilyMember(activeClient?.partner),
      });
    }
    if (activeClient?.children && activeClient.children.map !== undefined) {
      activeClient.children.map((child) => {
        activeClientItems.push({
          label: child,
          icon: "pi pi-user",
          command: () => setActiveFamilyMember(child),
        });
      });
    }

    activeClientItems.push({
      label: "Clear Active Client",
      icon: "pi pi-refresh",
      command: () => {
        dispatch(
          authSliceActions.updateClientData({
            newValue: undefined,
            action: "SET",
            key: "activeClient",
          })
        );
      },
    });

    breadcrumbItems.push({
      label: "Clients",
      command: () => router.push(`/auth/${advisorId}/clients`),
    });
    breadcrumbItems.push({
      label: (
        <SplitButton
          label={
            activeFamilyMember === activeClient?.lastName
              ? `${activeFamilyMember} Family`
              : activeFamilyMember
          }
          icon="pi pi-users"
          // onClick={}
          model={activeClientItems}
        ></SplitButton>
      ),
      command: () => console.log("hi"),
    });
  }

  const home = {
    icon: "pi pi-home",
    command: () => router.push(`/auth/${advisorId}/`),
  };

  const items = [
    {
      label: "Account",
      icon: "pi pi-cog",
      command: () => {
        router.push(`/auth/${advisorId}/account`);
      },
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        router.push(`/auth/${advisorId}/profile`);
      },
    },
    {
      label: "Sign out",
      icon: "pi pi-sign-out",
      command: () => {
        dispatch(asyncLogout());
        router.push("/auth/login");
      },
    },
  ];

  const leftContents = (
    <div className={classes.left}>
      {breadcrumbItems.length === 0 && (
        <Button
          icon="pi pi-home"
          tooltip={"Home"}
          className="p-button-rounded p-button-primary"
          style={{
            position: "relative",
            left: ".85rem",
            top: ".75rem",
          }}
          onClick={() => {
            router.push(`/auth/${advisorId}/`);
          }}
        />
        // <i
        //   style={{
        //     fontSize: "1.35rem",
        //     position: "relative",
        //     top: "1rem",
        //     left: ".65rem",
        //     cursor: "pointer",
        //   }}
        //   className="pi pi-home"
        //   onClick={() => router.push("/")}
        // ></i>
      )}
      {breadcrumbItems.length > 0 && (
        <BreadCrumb model={breadcrumbItems} home={home} />
      )}
      <div className={classes.search}>
        <span className={`p-input-icon-left`}>
          <i className={`pi pi-search ${classes.search_icon}`} />
          <InputText
            value={search}
            onChange={searchHandler}
            placeholder="Search clients..."
            className="p-inputtext-lg p-d-block"
            style={{ paddingLeft: "3rem" }}
          />
        </span>
      </div>
    </div>
  );
  const rightContents = (
    <>
      <Avatar
        label="S"
        size="xlarge"
        style={{
          backgroundColor: "#4caf4f",
          color: "#ffffff",
          position: "relative",
          left: "2.7rem",
          zIndex: 1001,
        }}
        className="p-overlay-badge"
        // image=""
        // shape="circle"
      >
        <Badge value="12" />
      </Avatar>
      <SplitButton label="" model={items}></SplitButton>
    </>
  );

  return (
    <div className={classes.container}>
      <Toolbar
        left={leftContents}
        right={rightContents}
        style={{ backgroundColor: "transparent", maxHeight: "4rem" }}
      />

      {/* Signed in as {session.user.email} <br /> */}
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
};

export default TopNav;
