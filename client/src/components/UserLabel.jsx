import { Card } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";


export default function UserLabel(props) {
    return (
        <div className={`d-flex ${props.noMargin ? '' : 'mt-3'}`}>
            <Avatar src={props.profileImage?.url[0]}/>
            <p className={'ms-3 mt-2'} style={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
            }}>
                {props.firstName} {props.lastName}
            </p>
        </div>
    )
}