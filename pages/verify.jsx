import { Input } from "baseui/input";
import Header from "../components/Header";
import { FormControl } from "baseui/form-control";
import { useState } from "react";
import { Button, SHAPE } from "baseui/button";

function verify() {

    const [tnxId, setTnxId] = useState("")
    const [load, setLoad] = useState(false)

    const initial = {
        transactionId: "230401-ABC123-3",
        from: "Suraj",
        to: "Karthik",
        date: "12-12-2022",
        time: "15:12:22",
    }

    const submit = (e) =>{
        e.preventDefault()
        setLoad(true)
        console.log(tnxId)
        setLoad(false)
        setTnxId("")
    }

    return (
        <>
            <Header/>
            <h2 className="select-none my-[1rem] py-[1rem] text-4xl cursor-default text-center" style={{fontFamily: "Syncopate"}}>Verify Transaction</h2>

            <form onSubmit={e=>submit(e)} className="mb-[2rem] pb-[2rem] grid justify-center">
                <FormControl label={() => "Transaction ID: "} >
                    <Input
                        value={tnxId}
                        onChange={e => setTnxId(e.target.value)}
                        placeholder="Eg. 230401-ABC123-3"
                        pattern="^[A-Za-z0-9_-]{10,30}$"
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

                <Button type="Submit" shape={SHAPE.pill} isLoading={load} title="Submit Form">Get Transaction Data</Button>
            </form>

            <div className="flex justify-center flex-wrap gap-4 md:gap-12">
                <div>
                    <FormControl label={() => "Transaction ID: "} >
                        <p>{initial.transactionId}</p>
                    </FormControl>
                </div>
                <div>
                    <FormControl label={() => "From: "} >
                        <p>{initial.from}</p>
                    </FormControl>
                </div>
                <div>
                    <FormControl label={() => "To: "} >
                        <p>{initial.to}</p>
                    </FormControl>
                </div>
                <div>
                    <FormControl label={() => "Date: "} >
                        <p>{initial.date}</p>
                    </FormControl>
                </div>
                <div>
                    <FormControl label={() => "Time: "} >
                        <p>{initial.time}</p>
                    </FormControl>
                </div>
            </div>

        </>
    );
}

export default verify;