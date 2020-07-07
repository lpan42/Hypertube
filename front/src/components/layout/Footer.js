import React from 'react'
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const Footer = () => {
    return (
        <footer style={{
            height:"4vh",
            width:"100%",
            bottom: "0", 
            backgroundColor:"var(--primary-color)",
            color:"white",
        }}>
            <Divider />
            <div style={{display:"flex",justifyContent:"space-between", alignItems:"center", padding:"0 10px"}}>
                <Typography variant="body2">Hypertube 2020</Typography>
                <Typography variant="body2">Lpan && Cchi @ 42Paris</Typography>
            </div>
        </footer>
    )
}

export default Footer
