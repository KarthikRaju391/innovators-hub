import Card from "../../components/Card";
import LoginHeader from "../../components/LoginHeader";
import { useRouter } from 'next/router';
import React from "react";

function Dashboard() {

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
            <h3 className="select-none mx-[2rem] px-[2rem] mt-[1rem] pt-[1rem] ml-[0.5rem] pb-[.5rem] text-2xl cursor-default">Investments</h3>
            <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                <Card head={"Investment History"} para={"Previous Investments"} />
                <Card head={"Venture"} para={"Show New Projects"} />
                <Card head={"Community Forum"} para={"Investor's Chat"} />
            </div>
            <h3 className="select-none mx-[2rem] px-[2rem] mt-[1rem] pt-[1rem] ml-[0.5rem] pb-[.5rem] text-2xl cursor-default">Purchase</h3>
            <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                <Card head={"Products"} para={"View Products In The Market"} url={"/user/purchase/products"} />
                <Card head={"Cart"} para={"View Items In Cart"} url={"/user/purchase/cart"}/>
                <Card head={"Live Orders"} para={"Details About Orders"} />
                <Card head={"Orders History"} para={"History Of Orders"} url={"/user/purchase/ordershistory"}/>
            </div>
            <h3 className="select-none mx-[2rem] px-[2rem] mt-[1rem] pt-[1rem] ml-[0.5rem] pb-[.5rem] text-2xl cursor-default">Settings</h3>
            <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
                <Card head={"View Profile"} para={"Visit Your Profile"} url={"/user/settings/viewprofile"}/>
                <Card head={"Manage Profile"} para={"Edit Your Profile"} url={"/user/settings/manageprofile"}/>
                <span onClick={handleTheme}>
                    <Card head={"Change Theme"} para={`Convert To ${ nowTheme } Theme`} />
                </span>
            </div>
        </>
    );
}

export default Dashboard;