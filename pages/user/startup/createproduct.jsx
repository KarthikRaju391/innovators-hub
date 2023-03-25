import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { FileUploader } from "baseui/file-uploader";
import { useEffect, useRef, useState } from "react";
import BackButton from "../../../components/BackButton";
import LoginHeader from "../../../components/LoginHeader";

function useInterval(callback, delay) {
    const savedCallback = useRef(() => {});

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  function useFakeProgress() {
    const [fakeProgress, setFakeProgress] = useState(0);
    const [isActive, setIsActive] = useState(false);
    function stopFakeProgress() {
      setIsActive(false);
      setFakeProgress(0);
    }
    function startFakeProgress() {
      setIsActive(true);
    }
    useInterval(
      () => {
        if (fakeProgress >= 100) {
          stopFakeProgress();
        } else {
          setFakeProgress(fakeProgress + 10);
        }
      },
      isActive ? 500 : null,
    );
    return [fakeProgress, startFakeProgress, stopFakeProgress];
  }

function createproduct() {

    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [build, setBuild] = useState("")
    const [quality, setQuality] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [file, setFile] = useState()
    const [errorMessage, setErrorMessage] = useState("");
    const [ progressAmount, startFakeProgress, stopFakeProgress, ] = useFakeProgress();

    const fileHandler = (e) =>{
        let f = e[0]
        // console.log(f)
        if(f.type !== 'image/*'){//application/pdf
            let readFile = new FileReader()
            readFile.readAsDataURL(f)
            readFile.onload=e=>{
                var fd = {...f,"file": e.target.result}
                setFile(fd)
                // sessionStorage.setItem('file', fd.file)
                // fread = fd;
                console.log(fd)
            }
        }
        else{
            setErrorMessage('Please upload .pdf format only')
        }
    }

    return (
        <>
            <LoginHeader/>
            <BackButton/>
            <h2 className="select-none my-[1rem] py-[1rem] text-3xl cursor-default text-center">Create Product</h2>

            <form>

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
                />
            </FormControl>

            <FormControl label={() => "Product Build: "} >
                <Textarea
                    value={build}
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

            <FormControl label={() => "Category Of The Product: "} >
                <Textarea
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder={`Eg. Hardware Device, Hand Pump, Pump, Portable Device.`}
                    clearOnEscape
                />
            </FormControl>

            <FormControl label={() => "Image 1 Of The Product: "} >
                <FileUploader
                    accept="image/*"
                    onCancel={stopFakeProgress}
                    errorMessage={errorMessage}
                    value = {file}
                    onDropAccepted= {fileHandler}
                    onDropRejected={e=> setErrorMessage('Please upload images only')}
                    onRetry={e=>setErrorMessage('')}
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        // handle file upload...
                        startFakeProgress();
                    }}
                    progressAmount={progressAmount}
                    progressMessage={
                        progressAmount
                            ? `Uploading... ${progressAmount}% of 100%`
                            : ''
                        }
                />
            </FormControl>

            <FormControl label={() => "Image 2 Of The Product: "} >
                <FileUploader
                    accept="image/*"
                    onCancel={stopFakeProgress}
                    errorMessage={errorMessage}
                    value = {file}
                    onDropAccepted= {fileHandler}
                    onDropRejected={e=> setErrorMessage('Please upload images only')}
                    onRetry={e=>setErrorMessage('')}
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        // handle file upload...
                        startFakeProgress();
                    }}
                    progressAmount={progressAmount}
                    progressMessage={
                        progressAmount
                            ? `Uploading... ${progressAmount}% of 100%`
                            : ''
                        }
                />
            </FormControl>

            <FormControl label={() => "Image 3 Of The Product: "} >
                <FileUploader
                    accept="image/*"
                    onCancel={stopFakeProgress}
                    errorMessage={errorMessage}
                    value = {file}
                    onDropAccepted= {fileHandler}
                    onDropRejected={e=> setErrorMessage('Please upload images only')}
                    onRetry={e=>setErrorMessage('')}
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        // handle file upload...
                        startFakeProgress();
                    }}
                    progressAmount={progressAmount}
                    progressMessage={
                        progressAmount
                            ? `Uploading... ${progressAmount}% of 100%`
                            : ''
                        }
                />
            </FormControl>

            <FormControl label={() => "Image 4 Of The Product: "} >
                <FileUploader
                    accept="image/*"
                    onCancel={stopFakeProgress}
                    errorMessage={errorMessage}
                    value = {file}
                    onDropAccepted= {fileHandler}
                    onDropRejected={e=> setErrorMessage('Please upload images only')}
                    onRetry={e=>setErrorMessage('')}
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        // handle file upload...
                        startFakeProgress();
                    }}
                    progressAmount={progressAmount}
                    progressMessage={
                        progressAmount
                            ? `Uploading... ${progressAmount}% of 100%`
                            : ''
                        }
                />
            </FormControl>

            </form>
        </>
    );
}

export default createproduct;