"use client";
import { Button, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import MuiAlert from '@mui/material/Alert';
import { DateTime } from "luxon";
import _ from "lodash";
import { AccessTime, PersonOff, QuestionMark } from "@mui/icons-material";

import { Database } from '@/database.types'


interface LineupFormProps {
    team: Database['public']['Tables']['team']['Row'];
    lineup: Database['public']['Functions']['get_contestants']['Returns'];
    contestants: Database['public']['Functions']['get_contestants']['Returns'];
    rounds: Database['public']['Functions']['get_rounds_with_evictions']['Returns'];
    past_submissions: Database['public']['Functions']['get_team_submissions']['Returns'];
    saveLineup: (lineup: Database['public']['Functions']['get_contestants']['Returns']) => Promise<void>;
}

export default function LineupForm({ team, lineup, contestants, rounds, past_submissions, saveLineup }: LineupFormProps) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [editable, setEditable] = useState(false);
    const [newLineup, setNewLineup] = useState(lineup);

    const isLineupDifferent = newLineup.map(c => c.contestant_id).join() !== lineup.map(c => c.contestant_id).join();

    const onDragEnd = (result: any) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newLineupArray = Array.from(newLineup);
        const [movedItem] = newLineupArray.splice(source.index, 1);
        newLineupArray.splice(destination.index, 0, movedItem);

        setNewLineup(newLineupArray);
    };

    const handleCloseSnackbar = (event: any, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const handleEditAndSave = async () => {
        if (editable && isLineupDifferent) {
            await saveLineup(newLineup);
            setSnackbarOpen(true);
        }
        setEditable(!editable);
    };

    let roundCount = [...contestants];
    roundCount.pop();
    let blankRoundCount = Math.max(roundCount.length - (newLineup.length + past_submissions.length), 0);
    
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-center text-center gap-2">
                <h2 className='text-xl'>Your Lineup</h2>
                <Button variant="outlined" onClick={handleEditAndSave}>{editable ? "Save" : "Edit"}</Button>
            </div>
            {editable && (
                <div>
                    <h3 className="text-center">Drag and drop to reorder your lineup</h3>
                    {isLineupDifferent && <h3 className="text-center bg-yellow-200">You have unsaved changes!</h3>}
                </div>
            )}
            <div className="flex gap-2 mb-20">
                <div className="flex flex-col gap-2">
                    <h3 className="h-6 text-center">Eviction</h3>
                    {roundCount.map((c, idx) => (
                        <div key={c.contestant_id} className="bg-slate-200 h-10 w-20 md:w-28 flex align-middle items-center justify-center">
                            <h1 className="text-sm md:text-base">Eviction {idx + 1}</h1>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="h-6 text-center">Chosen Survivor</h3>
                    {past_submissions.map((ps, idx) => (
                        <div key={ps.contestant_id} className="bg-slate-200 h-10 w-32 flex align-middle items-center pl-2">
                            {ps.is_correct === true && <CheckCircleIcon className="text-green-500 text-2xl" />}
                            {ps.is_correct === false && <CancelIcon className="text-red-500 text-2xl" />}
                            {ps.is_correct === null && <LockIcon className="text-yellow-700" />}
                            <h1 className="mx-auto">{ps.contestant_display_name}</h1>
                        </div>
                    ))}

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="lineup">
                            {(droppableProvided) => (
                                <div
                                    className="flex flex-col gap-2"
                                    ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                >
                                    {newLineup.map((c, idx) => {
                                        return (
                                            <Draggable 
                                                key={c.contestant_id.toString()} 
                                                draggableId={c.contestant_id.toString()} 
                                                index={idx}
                                                isDragDisabled={!editable}
                                            >
                                                {(draggableProvided) => {
                                                    return (
                                                    <div
                                                        ref={draggableProvided.innerRef}
                                                        className="bg-slate-200 h-10 w-32 flex align-middle items-center"
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                    >
                                                        {editable ? <DragHandleIcon className="ml-2" /> : <></>}
                                                        <h1 className="mx-auto">{c.display_name}</h1>
                                                    </div>
                                                )}}
                                            </Draggable>
                                        );
                                    })}
                                    {droppableProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {_.fill(Array(blankRoundCount), 1).map((_, idx) => (
                        <PersonOff key={`empty-${idx}`} className="bg-slate-200 h-10 w-32 flex align-middle items-center" />
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="h-6 text-center"></div>
                    {rounds.filter(r => r.evicted_contestant).map((r, idx) => {
                        const c = contestants.find(c => c.contestant_id === r.evicted_contestant);
                        return (
                            <div key={c?.contestant_id || `none-${idx}`} className="bg-slate-200 h-10 w-32 flex align-middle items-center pl-2">
                                <PersonOffIcon className="text-red-500 text-2xl" />
                                <h1 className="mx-auto">{c?.display_name || "None"}</h1>
                            </div>
                        );
                    })}
                    {rounds.filter(r => !r.evicted_contestant && !!past_submissions.find(ps => ps.round_id === r.round_id)).map((_, idx) => (
                        <div key={`mystery-${idx}`} className="bg-slate-200 h-10 w-32 flex align-middle items-center justify-center">
                            <QuestionMark key={`empty-${idx}`} className="" />
                        </div>
                    ))}
                    {rounds.filter(r => !r.evicted_contestant && !past_submissions.find(ps => ps.round_id === r.round_id)).map((r, idx) => (
                        <div key={`empty-${idx}`} className="bg-slate-200 h-10 w-32 flex align-middle items-center justify-center">
                            <AccessTime key={`timer-${idx}`} className="text-yellow-700" />
                            <h1 className="text-xs">Due {DateTime.fromISO(r.deadline_date_time, {zone: 'America/New_York'}).toLocaleString(DateTime.DATETIME_SHORT)}</h1>
                        </div>
                    ))}
                </div>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert 
                    severity="success" 
                    sx={{ width: '100%' }} 
                    icon={<CheckCircleIcon fontSize="inherit" />}
                >
                    Successfully saved your new team lineup
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
