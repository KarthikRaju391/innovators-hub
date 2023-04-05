import BackButton from '../../../../components/BackButton';
import LoginHeader from '../../../../components/LoginHeader';

export default function investmentHistoryId() {

  //get data regarding the project & set them accordingly in the `var initial` at Line10
  var initial ={
    projectName: 'Project',
    projectId: 10,
    ownerEmail: "s@g.co",
    startupName: "Company",
    amount: "5000",
    investmentDate: "18/12/2022",
    backers: [{name: "Karthik", amount: 2000}, {name: "Harsha", amount: 1000}, {name: "Ram", amount: 2000},],
    // pdf blob format for file
    // not sure
    file: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
}



var tblContent = initial?.backers?.map((e,i)=>( <tr key={i} className={`row animate__animated animate__fadeInUp`}> <td className='col'>{e.name}</td> <td className='col'>{e.amount}</td> </tr> )) 

  return (
    <>
        <BackButton/>
        <LoginHeader/>
          <h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">{initial.projectName}</h2>
          <h2 className="select-none my-[.5rem] py-[.5rem] text-2xl cursor-default text-center animate__animated animate__fadeInUp">Startup: {initial.startupName}</h2>
          <h2 className="select-none text-lg cursor-default text-center animate__animated animate__fadeInUp">Invested Amount:{initial.amount}</h2>
          <h2 className="select-none text-lg cursor-default text-center animate__animated animate__fadeInUp">Investment Date:{initial.investmentDate}</h2>
          <h2 className="select-none text-lg cursor-default text-center animate__animated animate__fadeInUp">Contact:{initial.ownerEmail}</h2>

        <embed className='mx-auto mt-3 pt-3 w-[90%] h-[100vh] ' src={`data:application/pdf;base64,${initial.file}`} />
        
        <p className='mt-5 cursor-default text-center text-lg underline'>List of backers</p>

        {initial?.backers?.length > 0 ? (
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
        {/* <p className='mt-5 cursor-default text-center underline'>No file to display</p> */}
    </>
  )
}