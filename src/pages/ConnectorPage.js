import React, {useState} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {Box, Button, OutlinedInput, Typography} from "@material-ui/core";
import {Header} from "../components/header/header";

import useConnectorOwner from "../hooks/useConnectorOwner";

const styles = theme => ({
    container: {
        textAlign: "center"
    },
    heroText: {
        color: "#FFFFFF",
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "4rem",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    root: {
        background: "#FFFFFF",
        boxShadow: "0px 0px 35px 0px rgba(94, 85, 126, 0.15)",
        borderRadius: "12px",
        textAlign: "left",

        "& Button": {},
        "& p": {
            margin: "8px 0"
        }
    },
    subTitle: {
        // margin: "8px 0",
        fontWeight: "500"
    },
    addressInput: {
        width: "100%"
    },
    button: {
        background: "linear-gradient(135deg, #42D9FE 0%, #2872FA 100%, #42D9FE)",
        borderRadius: "26px",
        // fontFamily: "Noto Sans SC",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        color: "#FFFFFF",
        width: "100%",
        margin: "26px auto 0 auto",
        "&:hover": {
            background: "linear-gradient(315deg, #4DB5FF 0%, #57E2FF 100%, #4DB5FF)"
        },
        "&.Mui-disabled": {
            background:
                "linear-gradient(135deg, rgb(66, 217, 254, 0.12) 0%, rgb(40, 114, 250,0.12) 100%, rgb(66, 217, 254, 0.12))",
            color: "#FFFFFF"
        }
    }
});

const ConnectorOwner = ({classes}) => {
    const [connectorAddress, setConnectorAddress] = useState();
    const [ownerAddress, setOwnerAddress] = useState();

    const connectorOwner = useConnectorOwner();

    const addressChange = event => {
        setConnectorAddress(event.target.value);
    };

    const confirm = async () => {
        console.log({connectorAddress});
        const owner = await connectorOwner(connectorAddress);
        console.log({owner});

        setOwnerAddress(owner);
    };
    return (
        <>
            <Header />
            <Box maxWidth="60rem" marginX="auto" marginY="2rem" p={6} className={classes.root}>
                <Typography className={classes.subTitle}>{ownerAddress}</Typography>
                <OutlinedInput
                    className={classes.addressInput}
                    id="outlined-adornment-password"
                    type={"text"}
                    value={connectorAddress}
                    onChange={addressChange}
                />
                <Button className={classes.button} onClick={confirm}>
                    OK
                </Button>
            </Box>
        </>
    );
};

export default withRouter(withStyles(styles)(ConnectorOwner));
