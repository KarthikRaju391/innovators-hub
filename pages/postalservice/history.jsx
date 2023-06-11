import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";

function adminhistory() {

    // get orders and postal service data
    var data = [
        {email: 'a@g.co', date: "27-02-2023", action: "Collected"},
        {email: 'b@g.co', date: "27-01-2023", action: "Delivered"},
        {email: 'c@g.co', date: "27-12-2022", action: "Access Granted"},
        {email: 'd@g.co', date: "27-11-2022", action: "Access Revoked"},
        {email: 'e@g.co', date: "27-10-2022", action: "Collected"},
    ]

    data?.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

      var tblContent = data?.map((e,i)=>( <tr key={i} className={`row animate__animated animate__fadeInUp`}> <td className='col'>{e.email}</td> <td className='col'>{e.date}</td> <td className='col'>{e.action}</td> </tr> )) 
    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <p className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">History</p>

            {data?.length > 0 ? (
          <div className="mx-4 overflow-x-auto">
						<table className="mx-auto mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
            <thead>
              <tr className='animate__animated animate__fadeInUp'>
                <th>Email</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tblContent}
            </tbody>
          </table>
          </div>
        ) : <p className='mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>No History Yet</p> }
        </>
    );
}

export default adminhistory;