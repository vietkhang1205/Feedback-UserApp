import React from 'react'
import { Input } from '@material-ui/core';

export default function HiddenField(props) {

    const { name, value, ...other } = props;
    return (
        <Input
            type="hidden"
            name={name}
            value={value}
            {...other}
        />
    )
}