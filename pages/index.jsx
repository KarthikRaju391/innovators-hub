import * as React from "react";
import Header from "../components/Header";
import SideNavUser from "../components/SideNav/SideNavUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CgQuote } from "react-icons/cg";

function Home() {
	const [isOpen, setIsOpen] = React.useState(false);
	const router = useRouter();

	var handleOpen = () => {
		setIsOpen(false);
	};

	var openDraw = () => {
		setIsOpen(true);
	};

    return (
        <div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
            <SideNavUser open={isOpen} handleOpen={handleOpen}/>
            <Header/>
            {/* <button className="text-2xl flex mx-auto" onClick={() => openDraw()}>Sign-In</button> */}
            <h2 className="select-none my-[1rem] py-[1rem] text-4xl cursor-default text-center" onClick={() => openDraw()} style={{fontFamily: "Syncopate"}}>Home</h2>
            <h3 className="pl-[15%] font-extrabold tracking-wider text-2xl pt-[.5rem] cursor-default">Come and maximize yourself <br/> because when you maximize, we maximize</h3>
                <br/>
                <p className="pl-[15%] mr-[2rem] text-lg font-semibold mb-[2rem] cursor-default">
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
            <hr className="w-[90%] mx-auto mb-[1rem]"/>
            <h1 className="text-3xl mb-[2rem] text-center cursor-default">CUSTOMER REVIEWS</h1>
                <div className="select-none cursor-default mb-[2rem] flex justify-around flex-wrap text-black">

                    <div class="box-border bg-white border border-gray-300 px-[2rem] pb-[2rem] mb-[1rem]">
                        <CgQuote fontSize={"3rem"}/>
                        <p className="text-center">Great quality, and showed they can <br/>work through a problem and <br/>maintain excellent customer service!!<br/></p>
                        <br/><p className="text-right pr-[2rem] mt-[1rem]">- Susana <br/>Santos</p>
                    </div>

				<div className="box-border bg-white border border-gray-300 px-[2rem] pb-[2rem] mb-[1rem]">
					<CgQuote fontSize={"3rem"} />
					<p className="text-center">
						What an amazing shopping <br />
						experience! I tried other jewelers and <br />
						didn't find anything <br />I liked. Thank you so much.
						<br />
					</p>
					<p className="text-right pr-[2rem] mt-[1rem]">
						- Tracy <br />
						Willis
					</p>
				</div>

                    <div class="box-border bg-white border border-gray-300 px-[2rem] pb-[2rem] mb-[1rem]">
                        <CgQuote fontSize={"3rem"}/>
                        <p className="text-center">Great variety of cuts and amazing <br/>customer service. Helped to find the <br/>perfect chair and helped me to <br/>personalize it a little more.<br/></p>
                        <p className="text-right pr-[2rem] mt-[1rem]">- Nico <br/>Jones</p>
                    </div>
                </div>
        </div>
    );
}

export default Home;
