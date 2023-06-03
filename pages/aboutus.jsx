import * as React from "react";
import Header from "../components/Header";
import SideNavUser from "../components/SideNav/SideNavUser";
// import { useSession } from "next-auth/react";
import Link from "next/link";

function aboutus() {
    const [isOpen, setIsOpen] = React.useState(false);

    var handleOpen = () =>{
        setIsOpen(false)
    }

    return (
        <>
            <SideNavUser open={isOpen} handleOpen={handleOpen}/>
            <Header/>
            <div className="">
            <h2 className="select-none my-[1rem] py-[1rem] text-4xl cursor-default text-center" style={{fontFamily: "Syncopate"}}>About Us</h2>
                <p className="pl-[15%] mr-[2rem] text-lg font-semibold mb-[2rem] cursor-default">
                    I am excited to announce the launch of my new venture,
                    <br/><span className="font-bold tracking-wider text-2xl">Innovators' Hub -</span>
                    <br/>A crowd funding application for projects of startups and e-commerce for selling products of startups.
                    <br/>Our focus is to help get new and innovative projects off the ground and help them succeed.
                    <br/> We will be using the <span className="font-bold tracking-wider text-2xl">Indian Postal Service</span> to deliver products to customers in <span className="font-bold tracking-wider text-2xl">India</span>.
                    <br/>We understand how difficult it can be for new startups to get the funding they need to get their business up and running. 
                    <br/>That's why our team is dedicated to making sure our application is easy to use and provides the best possible resources for businesses to get the <span className="font-bold tracking-wider text-2xl">Funds</span> they need. 
                    <br/>We're confident that our application will be the <span className="font-bold tracking-wider text-2xl">Perfect Platform</span> for innovators to get their projects off the ground and into the hands of customers.
                </p>
            </div>

            <Link href={"/termsandconditions"} className="text-blue-800 text-center cursor-pointer select-none mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">Click Here To View TERMS & CONDITIONS</Link>
        </>
    );
}

export default aboutus;