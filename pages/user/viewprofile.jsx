import LoginHeader from "../../components/LoginHeader";
import * as React from "react";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
// import { Select } from "baseui/select";
// import { Button, SHAPE } from "baseui/button";
// import { useRouter } from "next/router";
import BackButton from "../../components/BackButton";

function viewprofile() {

    // const router = useRouter()

    // const [name, setName] = React.useState("");
    // const [bio, setBio] = React.useState("");
    // const [phno, setPhno] = React.useState("");
    // const [email, setEmail] = React.useState("");
    // const [address, setAddress] = React.useState("");
    // const [pan, setPan] = React.useState("");
    // const [gender, setGender] = React.useState([]);
    // const [load, setLoad] = React.useState(false);

    // var genderdrop=[
    //     { label: "Male", id: "Male" },
    //     { label: "Female", id: "Female" },
    //     { label: "Others", id: "Other" },
    //   ]

    //   var submit = ( e ) =>{
    //     e.preventDefault()
    //     setLoad(true)
    //     console.log({name, bio, phno, email, address, pan, gender})
    //     router.push("/user")
    //   }
    const data = {
        name: "Suraj",
        bio: "Hi",
        phno: "9844722941",
        phnoVerified: true,
        emailVerified: true,
        email: "s@g.co",
        address: "f",
        pan: "1234567890",
        panVerified: false,
        gender: "Male"
    }

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">View Profile</h2>
            <form className="mb-[3rem] pb-[3rem] md:mb-[0rem] md:pb-[0rem]"  >
                <div className="flex flex-wrap gap-2 grid-cols-2">
                    <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl
                            label={() => "Name: "}
                            caption={() => "Name as per PAN Card"}
                            >
                            <Input
                                value={data.name}
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

                        <FormControl
                            label={() => "Email: "}
                            >
                            <>
                            
                            <Input
                                endEnhancer={<div className={`${data.emailVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}
                                value={data.email}
                                disabled={true}
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                            </>
                        </FormControl>
                    </div>

                    <div className="mx-auto" style={{width: "18rem"}}>
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

                        <FormControl
                            label={() => "PAN Card Number: "}
                            caption={() => "10-digit alphanumeric code issued by the Income Tax Department of India"}
                            >
                            <Input
                                endEnhancer={<div className={`${data.panVerified===true? "bg-green-700" : "bg-red-700"} w-[20px] h-[20px] rounded-full`}></div>}
                                value={data.pan}
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
            </form>
        </>
    );
}

export default viewprofile;