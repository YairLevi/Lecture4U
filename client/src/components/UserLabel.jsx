import { Card } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";

const dim = {
    small: {
        avatarSize: '32px',
        fontSize: '1rem',
        margins: 'ms-2 mt-1'
    },
    regular: {
        avatarSize: '40px',
        fontSize: '1.1rem',
        margins: 'ms-3 mt-2'
    }
}

export default function UserLabel(props) {
    return (
        <div className={`d-flex ${props.noMargin ? '' : 'mt-3'}`}>
            <Avatar src={props.profileImage?.url[0]} style={{
                width: dim[props.size].avatarSize,
                height: dim[props.size].avatarSize
            }}/>
            <p className={dim[props.size].margins} style={{
                fontSize: dim[props.size].fontSize,
                fontWeight: 'bold'
            }}>
                {props.firstName} {props.lastName}
            </p>
        </div>
    )
}