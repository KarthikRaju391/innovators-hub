import * as React from "react";
import Header from "../components/Header";
import SideNavUser from "../components/SideNav/SideNavUser";
import { useSession } from "next-auth/react";

function Home() {

    const [isOpen, setIsOpen] = React.useState(false);

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
            <div className="home">
                <button onClick={() => openDraw()}>Sign-In</button>
            </div>
        </>
    );
}

export default Home;
