import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import * as React from "react";
import { Modal, ModalHeader, ModalBody, SIZE, ROLE } from "baseui/modal";//ModalFooter, ModalButton,
// import { KIND as ButtonKind } from "baseui/button";
import AccessForm from "../../components/AccessForm";
import { TiUserDelete } from 'react-icons/ti';
import { Button } from "baseui/button";

function createmanager() {

    const [isOpen, setIsOpen] = React.useState(false);

    const closeOpen = () =>{
        setIsOpen(false)
    }

    // fetch postal service data
    var data = [
        {email: 'a@g.co', access: "Edit"},
        {email: 'b@g.co', access: "View"},
        {email: 'c@g.co', access: "Edit"},
        {email: 'd@g.co', access: "View"},
        {email: 'e@g.co', access: "Edit"},
    ]

    var tblContent = data?.map((e,i)=>( <tr key={i} className={`row animate__animated animate__fadeInUp`}> <td className='col'>{e.email}</td> <td className='col'>{e.access}</td> <td className='col flex justify-center cursor-pointer' onClick={() => console.log(e)}><TiUserDelete fontSize={"1.2rem"}/></td> </tr> )) 

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <Modal onClose={() => setIsOpen(false)} closeable isOpen={isOpen} animate autoFocus size={SIZE.default} role={ROLE.dialog} >
            <ModalHeader>Allot Access</ModalHeader>
            <ModalBody>
                <AccessForm closeOpen={closeOpen}/>
            </ModalBody>
            </Modal>
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">Access Control</h2>
            <div className="flex justify-center my-[.5rem] py-[.5rem]"><Button onClick={() => setIsOpen(true)}>Create Access</Button></div>

            {data?.length > 0 ? (
          <div className='grid justify-center overflow-x-auto'>
          <table className='mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>
            <thead>
              <tr className='animate__animated animate__fadeInUp'>
                <th>Email</th>
                <th>Current Access</th>
                <th> Revoke Access </th>
              </tr>
            </thead>
            <tbody>
              {tblContent}
            </tbody>
          </table>
          </div>
        ) : <p className='mt-2 cursor-default text-center mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]'>No Accesses Yet</p> }
           
        </>
    );
}

export default createmanager;