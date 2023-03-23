import LoginHeader from "../../../components/LoginHeader";
import * as React from "react";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { makeSerializable } from "../../../lib/util";
import BackButton from "../../../components/BackButton";

function viewprofile({user}) {

    //get user data & place them in data variable at line14
    const data = {
        name: "Suraj",
        bio: "Hi",
        phno: "9844722941",
        phnoVerified: true,
        emailVerified: true,
        email: "s@g.co",
        address: "f17",
        ppanNumber: "1234567890",
        ppanVerified: false,
        gender: "Male",
        type: ["user", "investor", "entrepreneur"],
        startupName: "Jingal-lala",
        startupAddress: "f17",
        startupPanNumber:"1234567890",
        startupPanNumberVerified: true,
        gstin: "123456789012345",
        gstinVerified: false,
    }

    return (
        <>
            <BackButton/>
            <LoginHeader/>
            <h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">View Profile</h2>
            <div className="mb-[0rem] pb-[0rem]"  >
                <p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">Customer Details:</p> 
                <div className="flex flex-wrap gap-2 grid-cols-2">
                    <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl
                            label={() => "Name: "}
                            caption={() => "Name as per PAN Card"}
                            >
                            <Input
                                value={user.name}
                                disabled={true}
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>
                    
                        <FormControl
                            label={() => "Bio: "}
                            >
                            <Textarea
                                value={data.bio}
                                disabled={true}
                            />
                        </FormControl>
                    
                        <FormControl
                            label={() => "Phone Number: "}
                            caption={() => "Phone Number as per PAN Card"}
                            >
                            <Input
                                endEnhancer={<div className={`${data.phnoVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}
                                value={data.phno}
                                disabled={true}
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>

                    </div>

                    <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl label={() => "Email: "} >
                            <Input
                                endEnhancer={<div className={`${data.emailVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}
                                value={user.email}
                                disabled={true}
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl label={() => "Address:"}>
                            <Textarea
                                value={data.address}
                                disabled={true}
                            />
                        </FormControl>

                        <FormControl label={() => "Gender:"}>
                        <Input
                                value={data.gender}
                                disabled={true}
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>
                    </div>
                </div>
            </div>
            {data.type.includes("investor") && (<div className="mb-[0rem] pb-[0rem]"  >
                <p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">Investor Details:</p> 
                <div className="grid justify-center">
                        <FormControl
                            label={() => "Personal PAN Card Number: "}
                            caption={() => "10-digit alphanumeric code issued by the Income Tax Department of India"}
                            >
                            <Input
                                value={data.ppanNumber}
                                endEnhancer={<div className={`${data.ppanVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}
                                clearable
                                disabled
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>
                </div>
            </div>)}
            
            {data.type.includes("entrepreneur") && (<div className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]"  >
                <p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">Startup Details:</p> 
                <div className="grid flex-wrap gap-2 grid-cols-2">
                        <div className="mx-auto" style={{width: "18rem"}}>
                            <FormControl label={() => "Startup Name: "} >
                                <Input
                                    value={data.startupName}
                                    disabled
                                    overrides={{
                                        Root: {
                                        style: ({ $theme }) => ({ width: "18rem" })
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormControl label={() => "Startup Address:"}>
                                <Textarea
                                    value={data.startupAddress}
                                    disabled
                                />
                            </FormControl>
                        </div>
                        <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl
                                label={() => "Startup PAN Number: "}
                                caption={() => "10-digit alphanumeric code issued by the Income Tax Department of India"}
                                >
                                <Input
                                    value={data.startupPanNumber}
                                    endEnhancer={<div className={`${data.startupPanNumberVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}                                    
                                    disabled
                                    overrides={{
                                        Root: {
                                        style: ({ $theme }) => ({ width: "18rem" })
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormControl
                                label={() => "GSTIN Number: "}
                                caption={() => "15-digit alphanumeric code issued by Goods and Services Tax Network of India"}
                                >
                                <Input
                                    value={data.gstin}
                                    endEnhancer={<div className={`${data.gstinVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}                                    
                                    disabled
                                    overrides={{
                                        Root: {
                                        style: ({ $theme }) => ({ width: "18rem" })
                                        }
                                    }}
                                />
                            </FormControl>
                        </div>
                    </div>
            </div>)}
        </>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    console.log(session)
    const res = await fetch(`http://localhost:3000/api/users/${session.user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const user = await res.json(); 

    return {
        props: {
            user: makeSerializable(user)
        }
    }
}

export default viewprofile;
{/* <p className="select-none my-[1rem] py-[1rem] text-2xl cursor-default text-center">Fill Startup Details:</p> */}