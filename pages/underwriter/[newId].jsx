import CreateUnderwriter from "../../components/underwriter/create";
import { useRouter } from "next/router";
// import { useEffect } from "react";

const UnderwriterPage = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   console.log("ON [newId].jsx");
  //   console.log(router.query);
  // }, []);

  return (
    <div>
      <CreateUnderwriter />
    </div>
  );
};

export default UnderwriterPage;
