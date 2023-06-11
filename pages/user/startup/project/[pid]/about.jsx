import BackButton from "../../../../../components/BackButton";
import LoginHeader from "../../../../../components/LoginHeader";

function about() {

    var backers= [{name: "Karthik", amount: 2000}, {name: "Harsha", amount: 1000}, {name: "Ram", amount: 2000},];
    var tblContent = backers?.map((e,i)=>( <tr key={i} className="row animate__animated animate__fadeInUp"> <td className='col'>{e.name}</td> <td className='col'>{e.amount}</td> </tr> )) 

    return (
        <>
            <LoginHeader />
			<BackButton />
			<p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">
				About Project
			</p>
            <div className="flex flex-wrap justify-around gap-4 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
                <div>
                    <div>
                        <p className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center"> Project Details </p>
                        <p className="select-none mt-[.5rem] pt-[.5rem] text-lg cursor-default animate__animated animate__fadeInUp">Startup: {"initial.startupName"}</p>
                        <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">Investment Requirement:{"initial.investmentRequired"}</p>
                        <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">Publish Date:{"initial.publishDate"}</p>
                        <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">Contact:{"initial.ownerEmail"}</p>
                        {/* add more */}
                    </div>
                    <br/> <br/>
                    <div>
                        <p className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center"> Project Report Over View </p>
                        {/* add more */}
                    </div>
                    <br/> <br/>
                    <div>
                        <p className='mt-5 cursor-default text-center text-lg underline'>List of backers</p>

                        {backers?.length > 0 ? (
                        <div className='grid justify-center'>
                        <table className='mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>
                            <thead>
                            <tr className='animate__animated animate__fadeInUp'>
                                <th>Name</th>
                                <th>Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                                {tblContent}
                            </tbody>
                        </table>
                        </div>
                        ) : <p className='mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>No Backers Yet</p> }
                    </div>
                </div>

                <embed className='min-w-[40%] h-[100vh]' src={`data:application/pdf;base64,${""}`} />
                {/* change the src according to requirement. if the report is in base64 the just add the paramater inside `${}` | else replace complete src */}
            </div>
        </>
    );
}

export default about;