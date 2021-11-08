import React, { useState, useEffect } from 'react'
import Form from "../../layouts/Form";
import { Grid, InputAdornment, makeStyles, ButtonGroup, MenuItem, Button as MuiButton } from '@material-ui/core';
import { Input, Select, Button } from "../../controls";
import ReplayIcon from '@material-ui/icons/Replay';
import ReorderIcon from '@material-ui/icons/Reorder';
import { createAPIEndpoint, ENDPIONTS } from "../../api";
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

    const handleChangeSelected = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        });
        loadListDeviceByLocationId(e.target.value);
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
                    let devices = res.data.map(item => ({
                        id: item.deviceId,
                        name: item.name
                    }));
                    setDevices(devices);
                    setErrors({});
                    console.log(devices);
                })
                .catch(err => console.log(err));
    }

    const validateForm = () => {
        let temp = {};
        temp.locationId = values.locationId != 0 ? "" : "This field is required.";
        temp.description = values.description != "none" ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const resetForm = () => {
        resetFormControls();
    }

    const submitOrder = e => {
        e.preventDefault();
        if (validateForm()) {
            if (values.locationId == '') {
                createAPIEndpoint(ENDPIONTS.ORDER).create(values)
                    .then(res => {
                        resetFormControls();
                        setNotify({ isOpen: true, message: 'New order is created.' });
                    })
                    .catch(err => console.log(err));
            }
            else {
                createAPIEndpoint(ENDPIONTS.ORDER).update(values.locationId, values)
                    .then(res => {
                        setNotify({ isOpen: true, message: 'The order is updated.' });
                    })
                    .catch(err => console.log(err));
            }
        }

    }

    const openListOfOrders = () => {
        setOrderListVisibility(true);
    }

    return (
        <>
            <Form onSubmit={submitOrder}>
                <Grid container>
                    <Grid item xs={6}>
                        <Input
                            disabled
                            label="Feedback Number"
                            name="orderNumber"
                            value={values.orderNumber}
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
                        <Input label='Description' name='description' type='text' />
                        <ButtonGroup className={classes.submitButtonGroup}>
                            <MuiButton
                                size="large"
                                type="submit">Submit</MuiButton>
                            <MuiButton
                                size="small"
                                onClick={resetForm}
                                startIcon={<ReplayIcon />}
                            />
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
                                    <ListItem
                                        key={idx}
                                    >
                                        <ListItemText
                                            primary={item.name} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Grid>
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
