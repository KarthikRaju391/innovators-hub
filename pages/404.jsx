import Image from "next/image";
import Link from "next/link";
import BackButton from "../components/BackButton";

function NotFound() {
    return (
        <>
            <BackButton/>
            <Image className="mx-auto" width={500} height={80}  src={"/PageNotFound.svg"} /> 
            <Link href="/" className="select-none grid justify-center text-xl" style={{fontFamily: "Syncopate"}}>Go To Home Page</Link>
        </>
    );
}

export default NotFound;