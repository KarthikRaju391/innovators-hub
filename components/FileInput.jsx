import { FileUploader } from "baseui/file-uploader";
import { useEffect, useRef, useState } from "react";

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

function FileInput(props) {

    const [errorMessage, setErrorMessage] = useState("");
    const [ progressAmount, startFakeProgress, stopFakeProgress, ] = useFakeProgress();

    const fileHandler = (e) =>{
        let f = e[0]
        var pattern = new RegExp(`${props.type}`)
        // console.log(pattern.test(f.type))
        if( pattern.test(f.type)){//application/pdf f.type
            let readFile = new FileReader()
            readFile.readAsDataURL(f)
            readFile.onload=e=>{
                var fd = {...f,"file": e.target.result}
                props.setFiles(fd)
                // console.log(fd)
            }
        }
        else{
            setErrorMessage(`Please upload ${props.type} only`)
        }
    }

    return (
        <FileUploader
                    accept={props.type}
                    onCancel={stopFakeProgress}
                    errorMessage={errorMessage}
                    value = {props.file}
                    onDropAccepted= {fileHandler}
                    onDropRejected={e=> setErrorMessage(`Please upload ${props.type} only`)}
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

export default FileInput;