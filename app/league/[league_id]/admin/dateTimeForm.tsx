'use client';
import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";



export default function DateTimeForm() {
    const [dtOpen, setDtOpen] = useState(false);
    const [dt, setDt] =  useState<Dayjs | null>(dayjs(new Date()).startOf('hour'));
    const [alertCopied, setAlertCopied] = useState(false);
    
    function copyText(entryText: string){
        navigator.clipboard.writeText(entryText);
        setAlertCopied(true);
      }

    return (
        <div className='flex gap-4'>
            <Button variant='outlined' onClick={() => setDtOpen(!dtOpen)}>Open Date Time Picker</Button>
            {dtOpen && dt && (
                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker value={dt} onChange={v => setDt(v)} />
                    </LocalizationProvider>
                    <Button variant='outlined' onClick={() => copyText(dt?.toISOString() || 'no_date')}>
                        {dt?.toISOString()}
                    </Button>
                </>
            )}
            <Snackbar open={alertCopied} autoHideDuration={6000} onClose={() => setAlertCopied(false)}>
                <Alert severity="success">Copied date-time-string to clipboard!</Alert>
            </Snackbar>
            

        </div>
    )

};