import BackButton from "../../components/BackButton";
import LoginHeader from "../../components/LoginHeader";
import React from "react";
import { Select } from "baseui/select";
import { Button, SHAPE } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { useRouter } from "next/router";

function renamemanager() {

    const router = useRouter()

    const [from, setFrom] = React.useState("");
    const [to, setTo] = React.useState("");
    const [load, setLoad] = React.useState(false);

    const fromdrop=[
        { label: "Harish", id: "harish@post.com" },
        { label: "Ramesh", id: "ramesh@post.com" },
        { label: "Suresh", id: "suresh@post.com" },
    ]
    const todrop = [
        { label: "Harish", id: "harish@post.com" },
        { label: "Ramesh", id: "ramesh@post.com" },
        { label: "Suresh", id: "suresh@post.com" },
    ]

    const handleSubmit = async ( e ) =>{ //submit from here
        e.preventDefault()
        if (from[0]?.id !== to[0]?.id){
            setLoad(true)
            console.log({from: from[0]?.id, to: to[0]?.id})
            router.back()
        }
        else{
            alert("From And To Employee Are Same! Please Verify And Try Again.")
        }
    }

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none mt-[1rem] pt-[1rem] text-3xl cursor-default text-center">Replace Manager</h2>

            <form className="mt-3 pt-3 mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]" onSubmit={handleSubmit}>

                <div className="flex flex-wrap gap-4 mx-auto" style={{width: "18rem"}}>
                    <div>
                    <FormControl label={() => "From Manager:"}>
                        <Select
                            options={fromdrop}
                            required 
                            value={from}
                            placeholder="Select From"
                            onChange={params => setFrom(params.value)}
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

                    <div>
                    <FormControl label={() => "To Employee:"}>
                        <Select
                            options={todrop}
                            required 
                            value={to}
                            placeholder="Select To"
                            onChange={params => setTo(params.value)}
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
                            
                <div className="flex justify-center mt-2 pt-2">
                    <Button type="Submit" shape={SHAPE.pill} isLoading={load} title="Submit Form">Change Manager</Button>
                </div>
            </form>
        </>
    );
}

export default renamemanager;