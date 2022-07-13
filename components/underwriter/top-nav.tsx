import classes from "./top-nav.module.css";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Toolbar } from "primereact/toolbar";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const TopNav = ({ firstName, setActiveClient }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {}, []);

  const items = [
    {
      label: "Account",
      icon: "pi pi-cog",
      command: () => {},
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {},
    },
    {
      label: "Sign out",
      icon: "pi pi-sign-out",
      command: () => {},
    },
  ];

  const leftContents = (
    <>
      <div onClick={() => setActiveClient(undefined)}>
        <i
          style={{
            fontSize: "1.45rem",
            position: "relative",
            top: ".25rem",
            left: ".65rem",
            cursor: "pointer",
          }}
          className="pi pi-home"
        ></i>
      </div>
      <div
        style={{
          position: "relative",
          left: "1.5rem",
        }}
      >
        Welcome {firstName}
      </div>
    </>
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
    <div
      style={{
        padding: "0.5rem",
        paddingLeft: "2rem",
        position: "relative",
        top: "0.25rem",
        right: "0.25rem",
        paddingBottom: "1rem",
      }}
    >
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
