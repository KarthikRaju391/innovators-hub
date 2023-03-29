import LoginHeader from "../../components/LoginHeader";
import { useRouter } from 'next/router';
import React from "react";
import Card from "../../components/Card";

function index() {

    //get user data(type) from server
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
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">Dashboard</h2>

            <h3 className="select-none mx-[2rem] px-[2rem] mt-[1rem] pt-[1rem] ml-[0.5rem] pb-[.5rem] text-2xl cursor-default">Postal Service</h3>
            <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                <Card head={"Create Manager"} para={"Add A Manager To The Service"} url={"/postaladmin/createmanager"} />
                <Card head={"View Managers"} para={"Show List Of Manager"} url={"/postaladmin/viewmanagers"}/>
                <Card head={"Admin History"} para={"Details About Admin Activities"} url={"/postaladmin/adminhistory"} />
                <Card head={"Replace Manager"} para={"Change A Manager"} url={"/postaladmin/replacemanager"} />
            </div>

            <h3 className="select-none mx-[2rem] px-[2rem] mt-[1rem] pt-[1rem] ml-[0.5rem] pb-[.5rem] text-2xl cursor-default">Settings</h3>
            <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
                <Card head={"View Profile"} para={"Visit Your Profile"} url={"/postaladmin/settings/viewprofile"}/>
                <Card head={"Manage Profile"} para={"Edit Your Profile"} url={"/postaladmin/settings/manageprofile"}/>
                <span onClick={handleTheme}>
                    <Card head={"Change Theme"} para={`Convert To ${ nowTheme } Theme`} />
                </span>
            </div>
        </>
    );
}

export default index;