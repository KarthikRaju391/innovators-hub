import * as React from "react";
import Header from "../components/header";
import SideNavUser from "../components/SideNav/SideNavUser";

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
