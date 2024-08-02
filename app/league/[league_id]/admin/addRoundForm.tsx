'use client';
import { Alert, Button, Dialog, DialogContent, DialogTitle, Input, Snackbar } from "@mui/material";
import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { createRound } from '@/actions/survival_admin';



export default function AddRoundForm({season_id, league_id}: {season_id: number, league_id: number}) {
    const [modalOpen, setmodalOpen] = useState(false);
    const [dt, setDt] =  useState<Dayjs | null>(dayjs(new Date()).startOf('hour'));
    const [alertCopied, setAlertCopied] = useState(false);
    
    function copyText(entryText: string){
        navigator.clipboard.writeText(entryText);
        setAlertCopied(true);
      }

    return (
        <div className='flex gap-4'>
            <Button variant='outlined' onClick={() => setmodalOpen(!modalOpen)}>Add Round</Button>

            <Dialog open={modalOpen} onClose={() => setmodalOpen(false)}>
                <DialogTitle>Add Round</DialogTitle>
                <DialogContent>
                    <form action={createRound.bind(null, season_id, league_id)} className="flex flex-col gap-4 p-4">
                        <Input id="round_number" name="round_number" placeholder='Round Number' />
                        <Input id="display_name" name="display_name" placeholder='Round Display Name' />
                        <Button type="submit">Submit</Button>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )

};