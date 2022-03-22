import React from 'react';
import {Button} from "react-bootstrap";


const FileUploader = () => {
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        //props.handleFile(fileUploaded);
    };
    return (
        <>
            <Button variant="outline-light" onClick={handleClick}>Upload</Button>
            <input type="file"
                   ref={hiddenFileInput}
                   multiple={false}
                   accept={".m4a"}
                   onChange={handleChange}
                   style={{display:'none'}}
            />
        </>
    );
};
export default FileUploader;
