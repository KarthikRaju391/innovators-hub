import BackButton from '../../../../components/BackButton';
import LoginHeader from '../../../../components/LoginHeader';


export default function investmentHistoryId() {

  var initial ={
    projectName: 'Project',
    startupName: "Company",
    amount: "5000",
    investmentDate: "18/12/2022",
    file: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
}

  return (
    <>
        <BackButton/>
        <LoginHeader/>
          <h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">{initial.projectName}</h2>
          <h2 className="select-none my-[.5rem] py-[.5rem] text-2xl cursor-default text-center">Startup: {initial.startupName}</h2>
          <h2 className="select-none text-lg cursor-default text-center">Invested Amount:{initial.amount}</h2>
          <h2 className="select-none text-lg cursor-default text-center">Investment Date:{initial.investmentDate}</h2>
  
        <embed className='mx-auto w-[90%] h-[100vh] my-[3rem] py-[3rem] md:my-[1rem] md:py-[1rem]' src={`data:application/pdf;base64,${initial.file}`} />
        {/* <p className='mt-5 cursor-default text-center underline'>No file to display</p> */}
    </>
  )
}