import React, { useState, useEffect } from 'react'
import { createAPIEndpoint, ENDPIONTS } from "../../api";
import Table from "../../layouts/Table";
import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';

export default function OrderList(props) {

    const { setOrderId, setOrderListVisibility, resetFormControls, setNotify } = props;

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        createAPIEndpoint(ENDPIONTS.FEEDBACK).fetchAll()
            .then(res => {
                setOrderList(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const showForUpdate = id => {
        setOrderId(id);
        setOrderListVisibility(false);
    }

    const deleteOrder = id => {
        if (window.confirm('Are you sure to delete this feedback?')) {
            createAPIEndpoint(ENDPIONTS.FEEDBACK).delete(id)
                .then(res => {
                    setOrderListVisibility(false);
                    setOrderId(0);
                    resetFormControls();
                    setNotify({ isOpen: true, message: 'Deleted successfully.' });
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Feedback No.</TableCell>
                        <TableCell>Location Name</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        orderList.map(item => (
                            <TableRow key={item.orderMasterId}>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.feedbackId}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.device.location.locatitonName}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.name}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.gTotal}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.gTotal}
                                </TableCell>
                                <TableCell>
                                    <DeleteOutlineTwoToneIcon
                                        color="secondary"
                                        onClick={e => deleteOrder(item.orderMasterId)} />
                                </TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}
