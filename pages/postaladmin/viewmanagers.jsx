import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";

function viewmanager() {
    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">View Managers</h2>
        </>
    );
}

export default viewmanager;