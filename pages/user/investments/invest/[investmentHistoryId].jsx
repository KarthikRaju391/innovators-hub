import BackButton from '../../../../components/BackButton';
import LoginHeader from '../../../../components/LoginHeader';
import { Button } from "baseui/button";
import { useState } from 'react';
import { FaHandsHelping } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import {FiEdit} from 'react-icons/fi'
import {MdOutlineVideoCameraFront} from 'react-icons/md'
import { useRouter } from 'next/router';


export default function investmentHistoryId() {

  const session = useSession()

  //get data regarding the project & set them accordingly in the `var initial` at Line16
  var initial ={
    projectName: 'Project',
    projectId: 10,
    startupName: "Company",
    ownerEmail: "s@g.co",
    creatorId: "d56909a0-daeb-44be-acb9-eb52392065cb",
    investmentRequired: "5000",
    publishDate: "18/12/2022",
    backers: [{name: "Karthik", amount: 2000}, {name: "Harsha", amount: 1000}, {name: "Ram", amount: 2000},],
    file: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
}

const [load1, setLoad1] = useState(false);
const [load2, setLoad2] = useState(false);

const router = useRouter()

const buyHandler = async() =>{
  setLoad1(true)
  await console.log(initial.projectId + " investing")
  setLoad1(false)
}

const meethandler = async() =>{
  setLoad2(true)
  await console.log(initial.projectId + " setup meet")
  setLoad2(false)
}

var tblContent = initial?.backers?.map((e,i)=>( <tr key={i} className="row animate__animated animate__fadeInUp"> <td className='col'>{e.name}</td> <td className='col'>{e.amount}</td> </tr> )) 
  return (
    <>
        <BackButton/>
        <LoginHeader/>
          <h2 className="select-none flex my-[.5rem] py-[.5rem] text-3xl cursor-default justify-center gap-4">{initial.projectName} {session.data?.user?.id === initial.creatorId && <FiEdit className='animate__animated animate__fadeInRight' title='Edit The Information' style={{cursor: "pointer"}} onClick={()=>router.push(`http://localhost:3000/user/startup/project/${initial?.projectId}/edit`)} />}</h2>
  
          <div className="flex flex-wrap justify-around gap-4 mb-[1rem] pb-[1rem]">
                <div>
                    <div>
                        <h2 className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center"> Project Details </h2>
                        <div className='text-justify'>
                          <p className="select-none mt-[.5rem] pt-[.5rem] text-lg cursor-default animate__animated animate__fadeInUp">Startup: {initial.startupName}</p>
                          <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">Investment Requirement:{initial.investmentRequired}</p>
                          <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">Publish Date:{initial.publishDate}</p>
                          <p className="select-none text-lg cursor-default animate__animated animate__fadeInUp">Contact:{initial.ownerEmail}</p>
                        </div>
                        {/* add more */}
                    </div>
                    <br/> <br/>
                    <div>
                        <h2 className="select-none mt-[1rem] pt-[1rem] text-2xl cursor-default text-center"> Project Report Over View </h2>
                        {/* add more */}
                    </div>
                    <br/> <br/>
                    <div>
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
                    </div>
                </div>

                <embed className='min-w-[40%] h-[100vh]' src={`data:application/pdf;base64,${""}`} />
                {/* change the src according to requirement. if the report is in base64 the just add the paramater inside `${}` | else replace complete src */}
            </div>

        <div className="flex justify-center mt-3 pt-3 mb-[1rem] pb-[1rem] gap-x-[2rem]">
          <Button onClick={buyHandler} isLoading={load1}  overrides={{ BaseButton: { style: ({ $theme }) => ({ backgroundColor: $theme.colors.positive400, }) } }} startEnhancer={<FaHandsHelping style={{fontSize: "1.5rem"}}/>} >Contribute</Button>
          <Button onClick={meethandler} isLoading={load2}  overrides={{ BaseButton: { style: ({ $theme }) => ({ backgroundColor: $theme.colors.positive400, }) } }} startEnhancer={<MdOutlineVideoCameraFront style={{fontSize: "1.5rem"}}/>} >Setup Meeting</Button>
        </div>
        {/* <p className='mt-5 cursor-default text-center underline'>No file to display</p> */}
    </>
  )
}