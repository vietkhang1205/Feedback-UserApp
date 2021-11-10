import React from 'react'
import { ListItem } from '@material-ui/core';

export default function ListIemCustom(props) {

    const { name, value, selected, onChange, error = null, ...other } = props;
    return (
        <ListItem
            name={name}
            value={value}
            selected={selected}
            onChange={onChange}
            {...other}
            {...(error && { error: true, helperText: error })}
        />
    )
}
