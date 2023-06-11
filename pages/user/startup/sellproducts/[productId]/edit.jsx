import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { useState } from "react";
import BackButton from "../../../../../components/BackButton";
import LoginHeader from "../../../../../components/LoginHeader";
import { Button, SHAPE } from "baseui/button";
import { useRouter } from "next/router";
import {MdOutlineDeleteForever} from 'react-icons/md';

function edit() {

    const router = useRouter()

    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [build, setBuild] = useState("")
    const [quality, setQuality] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [file1, setFile1] = useState()
    const [file2, setFile2] = useState()
    const [file3, setFile3] = useState()
    const [file4, setFile4] = useState()
    const [load, setLoad] = useState(false);

    var img1 = (f) =>{
        setFile1(f)
    }
    var img2 = (f) =>{
        setFile2(f)
    }
    var img3 = (f) =>{
        setFile3(f)
    }
    var img4 = (f) =>{
        setFile4(f)
    }

    const submit = ( e ) =>{ //submit from here
        e.preventDefault()
        if (file1!==undefined){
            setLoad(true)
            console.log({productName, productDescription, build, quality, price, category, images: [file1.file, file2?.file, file3?.file, file4?.file],})
            router.back()
        }
        else
            alert('Inserting image 1 is compulsory') //modal
      }

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <p className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">Edit Product - {router.query.productId}</p>

            <form onSubmit={e=>submit(e)} className="mb-[3rem] pb-[3rem] md:mb-[1rem] md:pb-[1rem]">
            
            <div className="flex flex-wrap gap-2 grid-cols-2">
            <div className="mx-auto" style={{width: "18rem"}}>
            <FormControl label={() => "Product Name: "} >
                <Input
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    placeholder="Eg. Hand Pump"
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

            <FormControl label={() => "Product Description: "} >
                <Textarea
                    value={productDescription}
                    onChange={e => setProductDescription(e.target.value)}
                    placeholder={`Modern day hand pump that can work manually by hand as well as on electricity.`}
                    clearOnEscape
                    required
                />
            </FormControl>

            <FormControl label={() => "Product Build: "} >
                <Textarea
                    value={build}
                    required
                    onChange={e => setBuild(e.target.value)}
                    placeholder={`Instead of a garden hose any hose of similar size can be used, Instead of an adapter any other method for attaching the foot valve to the hose can be used as long as an appropriate seal is made between the two, Any other hook can be used as opposed to the open eye-hook, Instead of the nylon cord any other rope could be used, Any other bolts could be used instead of carriage bolts, Any other 2" pipe could be used instead of the PVC schedule 40 pipe, Any other pipe cap could be used as long as it fits the appropriate pipe being used`}
                    clearOnEscape
                />
            </FormControl>

            <FormControl label={() => "Product Quality: "} >
                <Textarea
                    value={quality}
                    onChange={e => setQuality(e.target.value)}
                    placeholder={`Safe and suitable for human use due to a purification property of the soil.`}
                    clearOnEscape
                />
            </FormControl>

            <FormControl label={() => "Price Of The Product: "} >
                <Input
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="Eg. Hand Pump"
                    type="number"
                    min={1}
                    pattern="^[0-9]$"
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

            <FormControl label={() => "Category Of The Product: "} >
                <Textarea
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder={`Eg. Hardware Device, Hand Pump, Pump, Portable Device.`}
                    clearOnEscape
                    required
                />
            </FormControl>
            </div>
            
            <div className="mx-auto" style={{width: "18rem"}}>
            {/* <FormControl label={() => "Image 1 Of The Product: "} caption={() => "Required*"}>
            <>
                <FileInput file={file1} setFiles={img1} type={"image/*"} />
                <p className="flex justify-center gap-4">{file1 && <>{file1.path} <MdOutlineDeleteForever title="Delete Image" style={{fontSize: "1.5rem",}} onClick={()=>{setFile1(undefined)}} /></>}</p>
            </>
            </FormControl>
            
            <FormControl label={() => "Image 2 Of The Product: "} >
            <>
                <FileInput file={file2} setFiles={img2} type={"image/*"} />
                <p className="flex justify-center gap-4">{file2 && <>{file2.path} <MdOutlineDeleteForever title="Delete Image" style={{fontSize: "1.5rem",}} onClick={()=>{setFile2(undefined)}} /></>}</p>
            </>
            </FormControl>

            <FormControl label={() => "Image 3 Of The Product: "} >
            <>
                <FileInput file={file3} setFiles={img3} type={"image/*"} />
                <p className="flex justify-center gap-4">{file3 && <>{file3.path} <MdOutlineDeleteForever title="Delete Image" style={{fontSize: "1.5rem",}} onClick={()=>{setFile3(undefined)}} /></>}</p>
            </>
            </FormControl>

            <FormControl label={() => "Image 4 Of The Product: "} >
            <>
                <FileInput file={file4} setFiles={img4} type={"image/*"} />
                <p className="flex justify-center gap-4">{file4 && <>{file4.path} <MdOutlineDeleteForever title="Delete Image" style={{fontSize: "1.5rem",}} onClick={()=>{setFile4(undefined)}} /></>}</p>
            </>
            </FormControl> */}
            </div>
            </div>
            <div className="grid justify-center">
                <Button type="Submit" shape={SHAPE.pill} isLoading={load} title="Submit Form">Submit</Button>
            </div>
            </form>
        </>
    );
}

export default edit;