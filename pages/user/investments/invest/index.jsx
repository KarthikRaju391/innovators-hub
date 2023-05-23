import BackButton from "../../../../components/BackButton";
import LoginHeader from "../../../../components/LoginHeader";
import Card from "../../../../components/Card";
import { Badge, COLOR } from "baseui/badge";

function investmenthistory() {

    const initial = [{ projectName: "projectName", projectId: "5", startupName: "startupName", status: "Seeding" }, { projectName: "DEF", projectId: "6", startupName: "DEF", status: "Completed"  }, { projectName: "EF", projectId: "7", startupName: "EF", status: "Seeding"  }, { projectName: "DF", projectId: "8", startupName: "DF", status: "Seeding"  }, { projectName: "DE", projectId: "9", startupName: "DE", status: "Seeding"  },{ projectName: "10", projectId: "10", startupName: "10", status: "Seeding"  },]

    return (
        <>
            <BackButton/>
            <LoginHeader/>
            <div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
                <h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">Invest Now</h2>
                <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                    {initial.map((i) => (
                        <Badge content={ i.status || ""} color={ i.status === "Seeding" ? COLOR.accent : COLOR.negative }>
                            <Card head={i.projectName} key={i.projectId} para={i.startupName} url={`/user/investments/invest/${i.projectId}`} />   
                        </Badge>
                    ))}
                </div>
        </div>
        </>
    );
}

export default investmenthistory;