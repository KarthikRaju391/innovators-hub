 import { useState } from "react";

interface FileInputProps {
  type: string;
  setFiles: (file: any) => void;
  file?: any;
}

function FileInput({ type, setFiles, file }: FileInputProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const fileHandler = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const pattern = new RegExp(type);
    if (pattern.test(f.type)) {
      const readFile = new FileReader();
      readFile.readAsDataURL(f);
      readFile.onload = (e) => {
        if (e.target) {
          const fd = { ...f, file: e.target.result };
          setFiles(fd);
        }
      };
    } else {
      setErrorMessage(`Please upload ${type} only`);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={type}
        onChange={(e) => fileHandler(e.target.files)}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default FileInput;