"use client";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import {Database} from "@/database.types";

export default function RoundGrid({rounds}: {
    rounds: Database['public']['Functions']['get_rounds_with_evictions']['Returns']
}) {
    "use client";


    return (
        <div className={`h-96 w-90 ag-theme-quartz p-4`}>
            <AgGridReact 
                rowData={rounds}
                columnDefs={[
                    { headerName: "Round #", field: "round_number", editable: true},
                    { headerName: "Round Name", field: "display_name", editable: true },
                    { headerName: "Due Date", field: "deadline_date_time", editable: true },
                    { headerName: "Evicted Contestant", field: "evicted_contestant", editable: true },
                ]}
                // Must create the onEdit functions to make this usable.
                onCellEditingStopped={(event) => {
                    console.log(event);
                }}
            />
        </div>
    )
}