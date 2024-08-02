"use client";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import {Database} from "@/database.types";
import { updateEvictedContestant, updateRound } from '@/actions/survival_admin';
import _ from 'lodash';
import { useState } from 'react';
import { Button } from '@mui/material';

const editableRoundColumns = ['round_number', 'display_name', 'deadline_date_time'];

export default function RoundGrid({rounds, contestants, dateTimePicker = false}: {
    rounds: Database['public']['Functions']['get_rounds_with_evictions']['Returns'];
    contestants: Database['public']['Functions']['get_contestants']['Returns'];
    dateTimePicker: boolean;
}) {
    const [dtOpen, setDtOpen] = useState(false);



    return (
        <div className={`h-96 w-90 ag-theme-quartz p-4 flex flex-col`}>
            <AgGridReact 
                rowData={rounds}
                columnDefs={[{
                    headerName: "Round ID",
                    field: "round_id",
                    pinned: 'left'
                },{ 
                    headerName: "Round #", 
                    field: "round_number", 
                    pinned: 'left',
                    editable: true
                }, { 
                    headerName: "Round Name",
                    field: "display_name",
                    editable: true 
                }, { 
                    headerName: "Due Date",
                    field: "deadline_date_time",
                    editable: true 
                }, { 
                    headerName: "Evicted Contestant",
                    field: "evicted_contestant",
                    editable: true,
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: [...contestants.map(c => c.contestant_id), null],
                    },
                    valueFormatter: (params) => {
                        console.log
                        return contestants.find(c => c.contestant_id === params.value)?.display_name || params.value
                    }
                }]}
                // Must create the onEdit functions to make this usable.
                onCellEditingStopped={async (event) => {
                    console.log(event);
                    if (
                        editableRoundColumns.includes(event.colDef.field || 'no_column') 
                        && event.data 
                        && event.newValue !== event.oldValue
                    ) {
                        console.log('Update the round', event.data.round_id, event.colDef.field, event.newValue);
                        let r = await updateRound(_.pick(event.data, ['round_id', 'round_number', 'display_name', 'deadline_date_time']))
                        return;
                    }
                    else if (
                        event.colDef.field === 'evicted_contestant' 
                        && event.data
                        && event.newValue !== event.oldValue
                    ) {
                        if (!event.data.evicted_contestant) {
                            let r = await updateEvictedContestant({
                                round_id: event.data.round_id, 
                                evicted_contestant: null
                            });
                        }
                        let r = await updateEvictedContestant({
                            round_id: event.data.round_id, 
                            evicted_contestant: event.data.evicted_contestant
                        });
                        return;
                    }
                }}
            />
        </div>
    )
}