import LoginHeader from "../../components/LoginHeader";
import { useRouter } from 'next/router';
import React from "react";
import Card from "../../components/Card";

function index() {

    //get user data(access type) from server
    const user={
        type: ["user", "investor", "entrepreneur"] //  
    }

    const [hydrated, setHydrated] = React.useState(false);
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    const router = useRouter();

    var handleTheme = () =>{
        var currentTheme = JSON.parse(localStorage.getItem("theme"))
        localStorage.setItem("theme",JSON.stringify(currentTheme === 1 ? 0 : 1))
        router.replace(router.asPath);
      }

      var nowTheme
      if (typeof window !== 'undefined') {
        // Perform localStorage action
        nowTheme = JSON.parse(localStorage.getItem("theme")) === 0 ? "Light" : "Dark";
      }

    return (
        <>
            <LoginHeader/>
            <p className="select-none mt-[1rem] pt-[1rem] mb-[1rem] pb-[1rem] text-3xl text cursor-default text-center">Postal Service</p>

            <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                <Card head={"View Orders"} para={"Show List Of Orders"} url={"/postalservice/vieworders"}/>
                <Card head={"History"} para={"Details About All Activities"} url={"/postalservice/history"} />
                <Card head={"Access Control"} para={"Add Or Remove Accessability"} url={"/postalservice/accesscontrol"} />
                <span onClick={handleTheme}>
                    <Card head={"Change Theme"} para={`Convert To ${ nowTheme } Theme`} />
                </span>
            </div>

        </>
    );
}

export default index;