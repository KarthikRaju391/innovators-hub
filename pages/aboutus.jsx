import * as React from "react";
import Header from "../components/Header";
import SideNavUser from "../components/SideNav/SideNavUser";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function aboutus() {
    const [isOpen, setIsOpen] = React.useState(false);
    const router = useRouter();

    var handleOpen = () =>{
        setIsOpen(false)
    }

    var openDraw = () =>{
        setIsOpen(true)
    }

    return (
        <>
            <SideNavUser open={isOpen} handleOpen={handleOpen}/>
            <Header/>
            <div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
            <h2 className="select-none my-[1rem] py-[1rem] text-4xl cursor-default text-center" style={{fontFamily: "Syncopate"}}>About Us</h2>
                <h3 className="pl-[15%] font-extrabold tracking-wider text-2xl pt-[.5rem]">Come and maximize yourself <br/> because when you maximize, we maximize</h3>
                <br/>
                <p className="pl-[15%] mr-[2rem] text-lg font-semibold">
                    Our culture of care extends to our people, 
                    <br/>stakeholders, customers and the planet! We do not
                    <br/> believe in a one size fits all strategy. Our benefits
                    <br/>and
                    <br/>care policies are driven by empathy and
                    <br/>customized
                    <br/>to the unique needs of individuals . Because 
                    <br/>when they and their families are cared for, they 
                    <br/>can focus on doing their best work. We put your 
                    <br/>hopes, dreams and endeavors first - always. 
                </p>
            </div>
        </>
    );
}

export default aboutus;