import React, { useState, useEffect } from 'react'
import Form from "../../layouts/Form";
import { Grid, InputAdornment, makeStyles, ButtonGroup, MenuItem, Button as MuiButton, TextField } from '@material-ui/core';
import { Input, Select, Button, ListItemCustom, HiddenField } from "../../controls";
import ReorderIcon from '@material-ui/icons/Reorder';
import { createAPIEndpoint, callAPI, ENDPIONTS } from "../../api";
import Popup from '../../layouts/Popup';
import OrderList from './OrderList';
import Notification from "../../layouts/Notification";
import { List, ListItem, ListItemText, Paper, InputBase, IconButton, ListItemSecondaryAction } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        }
    },
    submitButtonGroup: {
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    },
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

export default function OrderForm(props) {

    const { values, setValues, errors, setErrors,
        handleInputChange, resetFormControls } = props;
    const classes = useStyles();
    const [locationList, setlocationList] = useState([]);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [notify, setNotify] = useState({ isOpen: false })
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(0);

    const handleChangeSelected = e => {
        const { name, value } = e.target;
        loadListDeviceByLocationId(e.target.value);
        setValues({
            ...values,
            [name]: value
        });
    }

    const handleListItemClick = (index, item) => {
        setSelectedDevice(index);
        setValues({
            ...values,
            deviceId: item.deviceId
        });
    }

    useEffect(() => {
        createAPIEndpoint(ENDPIONTS.LOCATION).fetchAll()
            .then(res => {
                let list = res.data.map(item => ({
                    id: item.locationId,
                    title: item.locatitonName
                }));
                setlocationList(list);
                setErrors({});
            })
            .catch(err => console.log(err))
    }, [])

    const loadListDeviceByLocationId = (locationId) => {
        (locationId === '' || locationId === undefined || locationId === null) ? resetFormControls() :
            createAPIEndpoint(ENDPIONTS.DEVICE).fetchListDeviceById(locationId)
                .then(res => {
                    let devices = res.data.map(item => {
                        setValues({
                            ...values,
                            locationId: locationId,
                            deviceId: res.data[0].deviceId
                        });
                        return {
                            deviceId: item.deviceId,
                            name: item.name
                        }
                    });
                    setDevices(devices);
                    console.log(devices);
                    setErrors({});
                })
                .catch(err => console.log(err));
    }

    const validateForm = () => {
        let temp = {};
        temp.locationId = values.locationId != 0 ? "" : "This field is required.";
        temp.description = values.description != "" ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const submitOrder = e => {
        e.preventDefault();
        if (validateForm()) {
            createAPIEndpoint(ENDPIONTS.FEEDBACK).create(values)
                .then(res => {
                    setDevices([]);
                    resetFormControls();
                    setNotify({ isOpen: true, message: 'New feedback is created.' });
                })
                .catch(err => console.log(err));
        }
    }

    const openListOfOrders = () => {
        setOrderListVisibility(true);
    }

    console.log(values);

    return (
        <>
            <Form onSubmit={submitOrder}>
                <Grid container>
                    <Grid item xs={6}>
                        <Input
                            disabled
                            label="Feedback Number"
                            name="feedbackId"
                            value={values.feedbackId}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">#</InputAdornment>
                            }}
                        />
                        <Select
                            placeholder="Please select location"
                            label="Location"
                            name="locationId"
                            value={values.locationId}
                            onChange={handleChangeSelected}
                            options={locationList}
                            error={errors.locatitonName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Input
                            label='Description'
                            name='description'
                            value={values.description}
                            type='text'
                            onChange={handleInputChange}
                        />
                        <ButtonGroup className={classes.submitButtonGroup}>
                            <MuiButton
                                size="large"
                                type="submit">Submit</MuiButton>
                        </ButtonGroup>
                        <Button
                            size="large"
                            onClick={openListOfOrders}
                            startIcon={<ReorderIcon />}
                        >Feedback History</Button>

                    </Grid>
                    <Grid item xs={6}>
                        <h3>
                            List Device
                        </h3>
                        <List className={classes.listRoot}>
                            {
                                devices.map((item, idx) => (
                                    <ListItemCustom
                                        key={idx}
                                        name='deviceId'
                                        value={values.deviceId}
                                        selected={selectedDevice === idx}
                                        onClick={() => handleListItemClick(idx, item)}
                                    >
                                        <ListItemText
                                            primary={item.name} />
                                    </ListItemCustom>
                                ))
                            }
                        </List>
                    </Grid>
                    <HiddenField
                        name='customerName'
                        value={values.customerName}
                    />
                </Grid>
            </Form>
            <Popup
                title="List of Feedbacks"
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}>
                <OrderList
                    {...{ setOrderListVisibility, resetFormControls, setNotify }} />
            </Popup>
            <Notification
                {...{ notify, setNotify }} />
        </>
    )
}
