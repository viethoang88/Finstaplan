import SideNav from "./side-nav";
import UpdateInputForm from "./update-input-form";

import FactFindLayout from "./ff-layout";

import AdvisorLayout from "../ui/adviser-layout";
import DataError from "../ui/data-error";
import EditableTable from "../ui/editable-table";
import SimpleCrudTable from "../ui/simple-crud-table";
import ConfigureVariables from "../advisor/configure-variables";
import { useSession } from "next-auth/client";
import { useEffect } from "react";

const Layout = (props) => {
  // const [session, loading] = useSession();

  // useEffect(() => {
  //   console.log(session);
  //   console.log(loading);
  //   console.log(props.session);
  // }, [loading, session]);

  return (
    <>
      {/* <SideNav /> */}
      {/* <UpdateInputForm currentValue="5" minAllowed="2.5" maxAllowed="7.75" /> */}
      {/* <UserInfo /> */}

      {/* <PersonItem
        src="/assets/images/6-man.svg"
        height={60}
        width={55}
        role={"adult"}
      /> */}

      {/* <AdvisorLayout> */}
      {/* <DataError /> */}
      {/* <EditableTable /> */}
      {/* <SimpleCrudTable /> */}
      {/* <Dependents /> */}
      {/* <br /> */}
      {/* <br /> */}
      {/* <ConfigureVariables /> */}
      {/* </AdvisorLayout> */}

      {props.children}
    </>
  );
};

export default Layout;
