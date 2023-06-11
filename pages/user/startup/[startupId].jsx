import { Badge, COLOR } from "baseui/badge";
import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";
import ProductCard from "../../../components/ProductCard";
import Card from "../../../components/Card";

function startupId() {

    var startup = {
        name: "Startup name",
        id: "SID1234",
        bio: "a",
        gstin:"a",
        category: "asd",
        team: ["Shan", "Rahul", "Manoj"],
        projects: [{ projectName: "projectName", projectId: "5", startupName: "startupName", status: "Seeding" }, { projectName: "DEF", projectId: "6", startupName: "DEF", status: "Completed"  }, { projectName: "EF", projectId: "7", startupName: "EF", status: "Seeding"  }, { projectName: "DF", projectId: "8", startupName: "DF", status: "Seeding"  }, { projectName: "DE", projectId: "9", startupName: "DE", status: "Seeding"  },{ projectName: "10", projectId: "10", startupName: "10", status: "Seeding"  },],
        products: [{ "id": "clgpd2cnh000cuzvsg4kv98je", "name": "kajdiaudiausgdi", "description": "asdasdjasiasdiuasdiuadiuasdiausdaiussadaiudysiudyuasdyiuasdyiuadyiuasdyuisdysiudyaiusdyaiudysiudysauidyaiusyasiudysiudysiudyiusdysiudyasiudyasiudyasiudyiuasdyiusdyuiasdyiuasydiusadiuasydiuasydiusydiuadyuisydis", "startupId": "clg3d014m0001uzl0yubaql19", "price": 123123, "image": [], "createdAt": "2023-04-20T16:52:42.507Z", "updatedAt": "2023-04-20T16:52:42.507Z", "category": [ { "id": "clgpd2cnm000duzvsf5w4892q", "name": "sdadasdhash", "createdAt": "2023-04-20T16:52:42.507Z", "updatedAt": "2023-04-20T16:52:42.507Z" } ], "startup": { "id": "clg3d014m0001uzl0yubaql19", "name": "GaSciTech", "description": null, "images": [], "panNumber": "ABCE12345F", "gstNumber": "22ABCDE1234F1Z5", "industry": [], "stage": null, "location": "Andrahalli, Bangalore", "website": null, "email": null, "social": [], "createdAt": "2023-04-05T07:19:58.390Z", "updatedAt": "2023-04-05T07:19:58.390Z" } },{ "id": "clgpd2cnh000cuzvsg4kv98jj", "name": "kajdiaudiausgdi", "description": "asdasdjasiasdiuasdiuadiuasdiausdaiussadaiudysiudyuasdyiuasdyiuadyiuasdyuisdysiudyaiusdyaiudysiudysauidyaiusyasiudysiudysiudyiusdysiudyasiudyasiudyasiudyiuasdyiusdyuiasdyiuasydiusadiuasydiuasydiusydiuadyuisydis", "startupId": "clg3d014m0001uzl0yubaql19", "price": 123123, "image": [], "createdAt": "2023-04-20T16:52:42.507Z", "updatedAt": "2023-04-20T16:52:42.507Z", "category": [ { "id": "clgpd2cnm000duzvsf5w4892q", "name": "sdadasdhash", "createdAt": "2023-04-20T16:52:42.507Z", "updatedAt": "2023-04-20T16:52:42.507Z" } ], "startup": { "id": "clg3d014m0001uzl0yubaql19", "name": "GaSciTech", "description": null, "images": [], "panNumber": "ABCE12345F", "gstNumber": "22ABCDE1234F1Z5", "industry": [], "stage": null, "location": "Andrahalli, Bangalore", "website": null, "email": null, "social": [], "createdAt": "2023-04-05T07:19:58.390Z", "updatedAt": "2023-04-05T07:19:58.390Z" } }, ]
    }
    
	

    return (
        <>
            <LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				{startup.name}
			</p>

            <div className="mb-[2rem]">
                <h3 className="text-2xl cursor-default ml-[20%] font-semibold">About {startup.name}:</h3>
                {(startup.bio!=="" || startup.bio!=undefined || startup.bio!= null) && <p className="cursor-default text-center break-all">{startup.bio}</p>}
                {(startup.category!=="" || startup.category!=undefined || startup.category!= null) && <p className="cursor-default text-center break-all">Category: {startup.category}</p>}
                {(startup.gstin!=="" || startup.gstin!=undefined || startup.gstin!= null) && <p className="cursor-default text-center break-all">GSTIN: {startup.gstin}</p>}
            </div>

            { startup.projects.length > 0 && <> <hr className="w-[90%] mx-auto mb-[1rem]"/>
                <div className="mb-[2rem]">
                    <h3 className="text-2xl cursor-default ml-[20%] font-semibold mb-4">Our Projects:</h3>
                    <div className="ml-[5%] pl-[5%] flex flex-wrap gap-4 grid-cols-2">
                    {startup.projects.map((i) => (
                        <Badge content={ i.status || ""} color={ i.status === "Seeding" ? COLOR.accent : COLOR.negative }>
                            <Card head={i.projectName || "-"} key={i.projectId} para={i.startupName || "-"} url={`/user/investments/invest/${i.projectId}`} />   
                        </Badge>
                    ))}
                </div>
                </div>
            </>}

            { startup.products.length > 0 && <> <hr className="w-[90%] mx-auto mb-[1rem]"/>
                <div className="mb-[2rem]">
                    <h3 className="text-2xl cursor-default ml-[20%] font-semibold mb-4">Our Products:</h3>
                    <div className="flex justify-center flex-wrap gap-4 grid-cols-2">
                        {startup.products.map((product) => (
                            <ProductCard
                                key={product.id}
                                data={product}
                                url={`/products/${product.id}`}
                            />
                        ))}
                    </div>
                </div>
            </>}

            { startup.team.length > 0 && <> <hr className="w-[90%] mx-auto mb-[1rem]"/>
                <div className="mb-[1rem] pb-[1rem] ">
                    <h3 className="text-2xl cursor-default ml-[20%] font-semibold mb-4">Our Team:</h3>
                    <div className="ml-[5%] pl-[5%] flex flex-wrap ">
                        {startup.team.map((e, i)=>(<p className="cursor-default break-all">{ `${i!==0 ? "," : ""} ${e.trim()}` }</p>))}
                    </div>
                </div>
            </>}
            <div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]" />
        </>
    );
}

export default startupId;