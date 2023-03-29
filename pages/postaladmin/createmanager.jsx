import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import React from "react";
import { Select } from "baseui/select";

function createmanager() {

    const router = useRouter()

    const [name, setName] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [email, setEmail] = React.useState( "");
    const [gender, setGender] = React.useState("");
    const [load, setLoad] = React.useState(false);

    const genderdrop=[
        { label: "Male", id: "Male" },
        { label: "Female", id: "Female" },
        { label: "Others", id: "Other" },
    ]


    const handleSubmit = async ( e ) =>{ //submit from here
        e.preventDefault()
        setLoad(true)
        console.log({name, email, phoneNumber, gender: gender[0]?.id})
        router.back()
      }

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">Create Manager</h2>

            <form className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]" onSubmit={handleSubmit}>
                <div className="flex flex-wrap gap-2 grid-cols-2 ">
                    <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl label={() => "Name: "} >
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

                        <FormControl label={() => "Phone Number: "} >
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

                    </div>

                    <div className="mx-auto" style={{width: "18rem"}}>
                        <FormControl label={() => "Email: "} >
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
                    </div>
                </div>
                            
                <div className="flex justify-center">
                    <Button type="Submit" shape={SHAPE.pill} isLoading={load} title="Submit Form">Submit</Button>
                </div>
            </form>
        </>
    );
}

export default createmanager;