import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

/// https://mui.com/components/pickers/

export default function MaterialUIPickers() {
    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                label="Date & Time picker"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} sx={{width: '120%'}} />}
            />

        </LocalizationProvider>

    );
}
