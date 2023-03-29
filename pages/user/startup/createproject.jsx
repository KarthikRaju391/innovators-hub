import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";

function createProject() {
    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">Create Project</h2>
        </>
    );
}

export default createProject;