import React, { useState, useEffect } from 'react'
import { createAPIEndpoint, ENDPIONTS } from "../../api";
import { List, ListItem, ListItemText, Paper, InputBase, IconButton, makeStyles, ListItemSecondaryAction } from '@material-ui/core';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles(theme => ({
    searchPaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    searchInput: {
        marginLeft: theme.spacing(1.5),
        flex: 1,
    },
    listRoot: {
        marginTop: theme.spacing(1),
        maxHeight: 450,
        overflow: 'auto',
        '& li:hover': {
            cursor: 'pointer',
            backgroundColor: '#E3E3E3'
        },
        '& li:hover .MuiButtonBase-root': {
            display: 'block',
            color: '#000',
        },
        '& .MuiButtonBase-root': {
            display: 'none'
        },
        '& .MuiButtonBase-root:hover': {
            backgroundColor: 'transparent'
        }
    }
}))

export default function SearchDevices(props) {

    const { values, setValues } = props;
    let orderedDevices = values.feedbackDetails;

    const [Devices, setDevices] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [searchKey, setSearchKey] = useState('');
    const classes = useStyles();

    useEffect(() => {
        createAPIEndpoint(ENDPIONTS.DEVICE).fetchDevice('R001')
            .then(res => {
                setDevices(res.data);
                setSearchList(res.data);
            })
            .catch(err => console.log(err))

    }, [])


    const addDevice = Device => {
        let x = {
            orderMasterId: values.orderMasterId,
            orderDetailId: 0,
            DeviceId: Device.deviceId,
            DeviceName: Device.name
        }
        setValues({
            ...values,
            feedbackDetails: [...values.feedbackDetails, x]
        })
    }

    return (
        <>
            {/* <Paper className={classes.searchPaper}>
                <InputBase
                    className={classes.searchInput}
                    value={searchKey}
                    onChange={e => setSearchKey(e.target.value)}
                    placeholder="Search devices" />
                <IconButton>
                    <SearchTwoToneIcon />
                </IconButton>
            </Paper> */}
            <h3>
                List Device
            </h3>
            <List className={classes.listRoot}>
                {
                    searchList.map((item, idx) => (
                        <ListItem
                            key={idx}
                           >
                            <ListItemText
                                primary={item.DeviceName}
                                secondary={item.name} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={e => addDevice(item)}>
                                    <PlusOneIcon />
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                }
            </List>
        </>
    )
}
