import React, { useState } from "react";


export default function DeleteButton(props) {
    const [hover, setHover] = useState(false)

    return (
        <i style={{
            fontSize: props.fontSize ? props.fontSize : '1.5rem',
            backgroundColor: hover ? 'lightgray' : 'white',
            borderRadius: '20px',
            width: 'fit-content',
            height: 'fit-content',
            cursor: 'pointer',
        }}
           onMouseEnter={() => setHover(true)}
           onMouseLeave={() => setHover(false)}
           onClick={e => {
               e.stopPropagation()
               props.onClick()
           }}
           className={'d-flex align-items-center bx bx-trash p-2'}
        />
    )
}