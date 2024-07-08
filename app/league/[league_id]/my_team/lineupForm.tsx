"use client";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import PersonOffIcon from '@mui/icons-material/PersonOff';

export default function LineupForm({ team, lineup, contestants, rounds, past_submissions, saveLineup }) {

    const [newLineup, setNewLineup] = useState(lineup);
    const [editable, setEditable] = useState(false);

    const isLineupDifferent = newLineup.map(c => c.contestant_id).join() !== lineup.map(c => c.contestant_id).join();


    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newLineupArray = Array.from(newLineup);
        const [movedItem] = newLineupArray.splice(source.index, 1);
        newLineupArray.splice(destination.index, 0, movedItem);

        setNewLineup(newLineupArray);
    };

    const handleEditAndSave = async () => {
        if (editable && isLineupDifferent){
            // Save the new lineup
            await saveLineup(newLineup);

        }
        setEditable(!editable);
    };

    let roundCount = [...contestants];
    roundCount.pop();

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

            
            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    {roundCount.map((c, idx) => (
                        <div key={c.contestant_id} className="bg-slate-200 h-10 w-20 flex align-middle items-center justify-center">
                            <h1>Round {idx + 1}</h1>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {past_submissions.map((ps, idx) => (
                        <div key={ps.contestant_id} className="bg-slate-200 h-10 w-32 flex align-middle items-center pl-2">
                            {ps.is_correct === true && <CheckCircleIcon className="text-green-500 text-2xl" />}
                            {ps.is_correct === false && <CancelIcon className="text-red-500 text-2xl" />}
                            {ps.is_correct === null && <LockIcon className="text-yellow-700" />}
                            <h1 className="mx-auto">{ps.contestant_display_name}</h1>
                        </div>
                    ))}

                    <DragDropContext onDragEnd={onDragEnd}>

                        {(
                        <Droppable droppableId="lineup" className="min-h-96">
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
                        )}
                    </DragDropContext>
                </div>
                <div className="flex flex-col gap-2">
                    {rounds.filter(r => r.evicted_contestant).map((r, idx) => {
                        const c = contestants.find(c => c.contestant_id === r.evicted_contestant);
                        return (
                            <div key={c.contestant_id} className="bg-slate-200 h-10 w-32 flex align-middle items-center pl-2">
                                <PersonOffIcon className="text-red-500 text-2xl" />
                                <h1 className="mx-auto">{c.display_name}</h1>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}




























// "use client";
// import { Button, TextField } from "@mui/material";
// import { useEffect, useState } from "react";
// import DragHandleIcon from '@mui/icons-material/DragHandle';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import LockIcon from '@mui/icons-material/Lock';
// import PersonOffIcon from '@mui/icons-material/PersonOff';

// export default function LineupForm({ team, lineup, saveLineup, contestants, rounds, past_submissions }) {
//     // debugger;
//     const [newLineup, setNewLineup] = useState(lineup);

//     const onDragEnd = (result) => {
//         const { destination, source } = result;

//         // If no destination, do nothing
//         if (!destination) return;

//         // If the item is dropped in the same position, do nothing
//         if (destination.droppableId === source.droppableId && destination.index === source.index) return;

//         // Create a new lineup array
//         const newLineupArray = Array.from(newLineup);
//         // Remove the dragged item from its original position
//         const [movedItem] = newLineupArray.splice(source.index, 1);
//         // Insert the dragged item in its new position
//         newLineupArray.splice(destination.index, 0, movedItem);

//         setNewLineup(newLineupArray);
//     };
//     let roundCount = [...contestants];
//     roundCount.pop();

//     // debugger;

//     return (
//         <div className="flex gap-2">
//             <div className="flex flex-col gap-2">
//                 {roundCount.map((c, idx) => {
//                     return (
//                         <div key={c.contestant_id} className="bg-slate-200 h-10 w-20 flex align-middle items-center justify-center">
//                             <h1>Round {idx + 1}</h1>
//                         </div>
//                     )
//                 })}
//             </div>
//             <div className="flex flex-col gap-2">
//                 {past_submissions.map((ps, idx) => {
//                     return (
//                         <div key={ps.contestant_id} className="bg-slate-200 h-10 w-32 flex align-middle items-center pl-2">
//                             {ps.is_correct === true && <CheckCircleIcon className="text-green-500 text-2xl"/>}
//                             {ps.is_correct === false && <CancelIcon className="text-red-500 text-2xl"/>}
//                             {ps.is_correct === null && <LockIcon className="text-yellow-700"/>}
//                             <h1 className="mx-auto">{ps.contestant_display_name}</h1>
//                         </div>
//                     )
//                 })}

//                 <DragDropContext onDragEnd={onDragEnd}>
//                     <Droppable droppableId="lineup">
//                         {(provided) => (
//                             <div
//                                 ref={provided.innerRef}
//                                 {...provided.droppableProps}
//                                 className="flex flex-col gap-2"
//                             >
//                                 {newLineup.map((c, idx) => {
//                                     console.log("DraggableId", c.contestant_id.toString());
//                                     return (
//                                     <Draggable key={c.contestant_id.toString()} draggableId={c.contestant_id.toString()} index={idx}>
//                                         {(provided) => (
//                                             <div
//                                                 key={c.contestant_id}
//                                                 ref={provided.innerRef}
//                                                 {...provided.draggableProps}
//                                                 {...provided.dragHandleProps}
//                                                 className="bg-slate-200 h-10 w-32 flex align-middle items-center"
//                                             >
//                                                 <DragHandleIcon className="ml-2"/>
//                                                 <h1 className="mx-auto">{c.display_name}</h1>
//                                             </div>
//                                         )}
//                                     </Draggable>
//                                 )}
//                                 )}
//                                 {provided.placeholder}
//                             </div>
//                         )}
//                     </Droppable>
//                 </DragDropContext>
//             </div>
//             <div className="flex flex-col gap-2">
//                 {rounds.filter(r => r.evicted_contestant).map((r, idx) => {
//                     const c = contestants.find(c => c.contestant_id === r.evicted_contestant);
//                     return (
//                         <div key={c.contestant_id} className="bg-slate-200 h-10 w-32 flex align-middle items-center pl-2">
//                             <PersonOffIcon className="text-red-500 text-2xl"/>
//                             <h1 className="mx-auto">{c.display_name}</h1>
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     );
// }
