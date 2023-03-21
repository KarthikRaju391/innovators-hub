import BackButton from '../../../../components/BackButton';
import LoginHeader from '../../../../components/LoginHeader';
import { Button } from "baseui/button";
import { useState } from 'react';
import { FaHandsHelping } from 'react-icons/fa';


export default function investmentHistoryId() {

  //get data regarding the project & set them accordingly in the `var initial` at Line11
  var initial ={
    projectName: 'Project',
    projectId: 10,
    startupName: "Company",
    investmentRequired: "5000",
    publishDate: "18/12/2022",
    backers: [{name: "Karthik", amount: 2000}, {name: "Harsha", amount: 1000}, {name: "Ram", amount: 2000},],
    file: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
}

const [load1, setLoad1] = useState(false);

const buyHandler = async() =>{
  setLoad1(true)
  await console.log(initial.projectId)
  setLoad1(false)
}

var tblContent = initial?.backers?.map((e,i)=>( <tr key={i} className="row"> <td className='col'>{e.name}</td> <td className='col'>{e.amount}</td> </tr> )) 
  return (
    <>
        <BackButton/>
        <LoginHeader/>
          <h2 className="select-none my-[.5rem] py-[.5rem] text-3xl cursor-default text-center">{initial.projectName}</h2>
          <h2 className="select-none my-[.5rem] py-[.5rem] text-2xl cursor-default text-center">Startup: {initial.startupName}</h2>
          <h2 className="select-none text-lg cursor-default text-center">Investment Requirement:{initial.investmentRequired}</h2>
          <h2 className="select-none text-lg cursor-default text-center">Publish Date:{initial.publishDate}</h2>
  
        <embed className='mx-auto mt-3 pt-3 w-[90%] h-[100vh]' src={`data:application/pdf;base64,${initial.file}`} />

        <div className="flex justify-center mt-3 pt-3 mb-[1rem] pb-[1rem] ">
          <Button onClick={buyHandler} isLoading={load1}  overrides={{ BaseButton: { style: ({ $theme }) => ({ backgroundColor: $theme.colors.positive400, }) } }} startEnhancer={<FaHandsHelping style={{fontSize: "1.5rem"}}/>} >Contribute</Button>
        </div>

        <p className='mt-5 cursor-default text-center underline'>List of backers</p>

        {initial?.backers?.length > 0 ? (
          <table className='table-fixed mx-auto text-left border-separate border-spacing-y-2 border-spacing-x-10 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tblContent}
            </tbody>
          </table>
        ) : <p className='mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>No Backers Yet</p> }
        {/* <p className='mt-5 cursor-default text-center underline'>No file to display</p> */}
    </>
  )
}