import React, { useEffect } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Alert, Button, FormControl, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const Calender = () => {
    const [newValue, setValue] = useState({
        Name: '',
    });

    const [isNameAdded, setIsNameAdded] = useState(false);
    const [isDateAdded, setIsDateAdded] = useState(false);
    const [showError, setShowError] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const header = document.getElementById('Box'); 
        if (header) {
            setHeaderHeight(header.clientHeight);
        }

        const handleResize = () => {
            setHeaderHeight(header.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); 

    const handleInput = (e) => {
        setValue({
            ...newValue,
            ['Name']: e.target.value,
        });

        e.target.value === '' ? setIsNameAdded(false) : setIsNameAdded(true);
    };

    const handleSubmit = (e) => {
        if (isNameAdded && isDateAdded) {
            setShowError(false);
            // send data to server
        } else {
            setShowError(true);
        }
    };

    return (
        <Stack width={['90%', '90%', '90%', '40%']} alignItems={"center"} justifyContent={"center"}   height={`calc(100vh - ${headerHeight}px)`} >
            <Stack direction="column" spacing={5} width="100%">
                <Typography variant="h3" color="initial">
                    Post an Event
                </Typography>

                {showError ? <Alert severity="error">Please fill in both the boxes</Alert> : null}

                <FormControl>
                    <Stack spacing={4}>
                        <TextField required label="Enter Event name" onChange={(e) => handleInput(e)} />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Select date"
                                onChange={(date) => {
                                    setValue({
                                        ...newValue,
                                        Date: date.$D,
                                        Month: date.$M,
                                        Year: date.$y,
                                    });
                                    date.$D === '' ? setIsDateAdded(false) : setIsDateAdded(true);
                                }}
                            />
                        </LocalizationProvider>

                        <Button type="submit" variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Stack>
                </FormControl>
            </Stack>
        </Stack>
    );
};

export default Calender;
