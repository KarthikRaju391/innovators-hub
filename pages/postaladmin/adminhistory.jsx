import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";

function adminhistory() {
    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">Admin History</h2>
        </>
    );
}

export default adminhistory;