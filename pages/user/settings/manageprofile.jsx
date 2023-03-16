import LoginHeader from "../../../components/LoginHeader";
import * as React from "react";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { Textarea } from "baseui/textarea";
import { Select } from "baseui/select";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import BackButton from "../../../components/BackButton";

function manage({data}) {
    const router = useRouter()
    
    const user = {...data}
    const [name, setName] = React.useState(user.name);
    const [bio, setBio] = React.useState(user.bio ? user.bio : "");
    const [phoneNumber, setPhoneNumber] = React.useState(user.phoneNumber);
    const [email, setEmail] = React.useState(user.email);
    const [address, setAddress] = React.useState(user.address ? user.address : "");
    const [panNumber, setpanNumber] = React.useState(user.panNumber ? user.panNumber : "");
    const [gender, setGender] = React.useState(user.gender ? user.gender : "");
    const [load, setLoad] = React.useState(false);

    const genderdrop=[
        { label: "Male", id: "Male" },
        { label: "Female", id: "Female" },
        { label: "Others", id: "Other" },
      ]

      const submit = async ( e ) =>{
        e.preventDefault()
        setLoad(true)
        console.log({name, bio, phno, email, address, pan, gender: gender[0]?.id})
        router.back()
        //push("/user")
      }
    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">Manage Profile</h2>
            <form className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]" onSubmit={(e) => submit(e)} >
                <div className="flex flex-wrap gap-2 grid-cols-2">
                    <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl
                            label={() => "Name: "}
                            caption={() => "Name as per PAN Card"}
                            >
                            <Input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Eg. Suresh Kumar"
                                pattern="^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
                                autoFocus
                                clearable
                                required
                                clearOnEscape
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
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                placeholder={`Giving is not just about make a donation, it's about making a difference.`}
                                clearOnEscape
                            />
                        </FormControl>
                    
                        <FormControl
                            label={() => "Phone Number: "}
                            caption={() => "Phone Number as per PAN Card"}
                            >
                            <Input
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="Eg. 9656732560"
                                clearable
                                required
                                pattern="^[6-9]\d{9}$"
                                type='tel'
                                clearOnEscape
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
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Eg. suresh@gmail.com"
                                clearable
                                required
                                type="email"
                                pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
                                clearOnEscape
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
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder={`F-17, Jangpura Extn, Delhi 110014, India`}
                                clearOnEscape
                                required
                            />
                        </FormControl>

                        <FormControl label={() => "Gender:"}>
                            <Select
                                options={genderdrop}
                                required 
                                value={gender}
                                placeholder="Select Gender"
                                onChange={params => setGender(params.value)}
                                overrides={{
                                    ControlContainer: {
                                        style: ({ $theme }) => ({
                                            borderRadius: '10px',
                                            width: '18rem'
                                        })
                                    }
                                }}
                            />
                        </FormControl>

                        <FormControl
                            label={() => "PAN Card Number: "}
                            caption={() => "10-digit alphanumeric code issued by the Income Tax Department of India"}
                            >
                            <Input
                                value={panNumber}
                                onChange={e => setpanNumber(e.target.value)}
                                placeholder="XXXXXXXXXX"
                                pattern="^[A-Za-z0-9]{10}$"
                                clearable
                                required
                                clearOnEscape
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>
                    </div>
                </div>
                <div className="flex justify-center ">
                    <Button shape={SHAPE.pill} isLoading={load} title="Submit the form">Submit</Button>
                </div>
            </form>
        </>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
    
    const res = await fetch(`http://localhost:3000/api/users/${session.user.id}`)
    const data = await res.json(); 
 
    return {
        props: {
            data: makeSerializable(data)
        }
    }
}

export default manage;
//<div className="bg-red-700 w-[20px] h-[20px] rounded-full"></div>