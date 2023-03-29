//dummy page do not work on this

import * as React from "react";
import { FileUploader } from "baseui/file-uploader";

function useInterval(callback, delay) {
    const savedCallback = React.useRef(() => {});

    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    React.useEffect(() => {
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
    const [fakeProgress, setFakeProgress] = React.useState(0);
    const [isActive, setIsActive] = React.useState(false);
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

function sample() {

    const [file, setFile] = React.useState()
    const [errorMessage, setErrorMessage] = React.useState("");
    const [ progressAmount, startFakeProgress, stopFakeProgress, ] = useFakeProgress();

    const fileHandler = (e) =>{
        let f = e[0]
        // console.log(f)
        if(f.type !== ''){//application/pdf
            let readFile = new FileReader()
            readFile.readAsDataURL(f)
            readFile.onload=e=>{
                var fd = {...f,"file": e.target.result}
                setFile(fd)
                sessionStorage.setItem('file', fd.file)
                // fread = fd;
                console.log(fd)
            }
        }
        else{
            setErrorMessage('Please upload .pdf format only')
        }
    }

    return (
        <FileUploader
                        accept=".pdf"
                        onCancel={stopFakeProgress}
                        errorMessage={errorMessage}
                        value = {file}
                        onDropAccepted= {fileHandler}
                        onDropRejected={e=> setErrorMessage('Please upload .pdf format only')}
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
    );
}

export default sample;