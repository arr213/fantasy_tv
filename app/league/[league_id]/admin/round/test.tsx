// "use client";
// import { useEffect, useState } from 'react';
// import { createClient } from "@/utils/supabase/client";
// import { AgGridReact } from '@ag-grid-community/react';
// import '@ag-grid-community/styles/ag-grid.css';
// import '@ag-grid-community/styles/ag-theme-alpine.css';

// const RoundsAdmin = () => {
//   const [rounds, setRounds] = useState([]);
//   const [contestants, setContestants] = useState([]);
//   const [gridApi, setGridApi] = useState(null);
//   const supabase = createClient();

//   useEffect(() => {
//     const fetchRounds = async () => {
//       const { data: roundsData, error: roundsError } = await supabase
//         .from('round')
//         .select('*');
//       if (roundsError) console.error('Error fetching rounds:', roundsError);
//       else setRounds(roundsData);
//     };

//     const fetchContestants = async () => {
//       const { data: contestantsData, error: contestantsError } = await supabase
//         .from('contestant')
//         .select('*');
//       if (contestantsError) console.error('Error fetching contestants:', contestantsError);
//       else setContestants(contestantsData);
//     };

//     const fetchEvictions = async () => {
//       const { data: evictionsData, error: evictionsError } = await supabase
//         .from('fantasy_event')
//         .select('round_id, contestant_id')
//         .eq('event_type', 'eviction');
//       if (evictionsError) console.error('Error fetching evictions:', evictionsError);
//       else {
//         setRounds(prevRounds => prevRounds.map(round => ({
//             ...round,
//             evicted_contestant: evictionsData.find(e => e.round_id === round.id)?.contestant_id || null,
//           }))
//         );
//       }
//     };

//     fetchRounds();
//     fetchContestants();
//     fetchEvictions();
//   }, []);

//   const onGridReady = params => {setGridApi(params.api);};

//   const onCellValueChanged = async params => {
//     const { data, colDef, newValue, oldValue } = params;
//     if (newValue !== oldValue) {
//       if (colDef.field === 'evicted_contestant') {
//         const { data: existingEvent, error: fetchError } = await supabase
//           .from('fantasy_event')
//           .select('id')
//           .eq('round_id', data.id)
//           .eq('event_type', 'eviction')
//           .single();

//         if (fetchError) {
//           console.error('Error fetching existing event:', fetchError);
//           return;
//         }

//         if (existingEvent) {
//           const { error: updateError } = await supabase
//             .from('fantasy_event')
//             .update({ contestant_id: newValue })
//             .eq('id', existingEvent.id);
//           if (updateError) console.error('Error updating event:', updateError);
//         } else {
//           const { error: insertError } = await supabase
//             .from('fantasy_event')
//             .insert({
//               round_id: data.id,
//               contestant_id: newValue,
//               event_type: 'eviction',
//             });
//           if (insertError) console.error('Error inserting event:', insertError);
//         }
//       } else {
//         const { error: updateRoundError } = await supabase
//           .from('round')
//           .update({ [colDef.field]: newValue })
//           .eq('id', data.id);
//         if (updateRoundError) console.error('Error updating round:', updateRoundError);
//       }
//     }
//   };

//   const columnDefs = [
//     { headerName: 'ID', field: 'id', editable: false },
//     { headerName: 'Round Number', field: 'round_number', editable: true },
//     { headerName: 'Display Name', field: 'display_name', editable: true },
//     {
//       headerName: 'Evicted Contestant',
//       field: 'evicted_contestant',
//       editable: true,
//       cellEditor: 'agSelectCellEditor',
//       cellEditorParams: {
//         values: contestants.map(contestant => contestant.id),
//       },
//       valueFormatter: params => {
//         const contestant = contestants.find(c => c.id === params.value);
//         return contestant ? contestant.display_name : '';
//       },
//       valueParser: params => {
//         const contestant = contestants.find(c => c.display_name === params.newValue);
//         return contestant ? contestant.id : null;
//       },
//     },
//   ];

//   return (
//     <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
//       <AgGridReact
//         columnDefs={columnDefs}
//         rowData={rounds}
//         onGridReady={onGridReady}
//         onCellValueChanged={onCellValueChanged}
//         defaultColDef={{ flex: 1, minWidth: 150, editable: true }}
//       />
//     </div>
//   );
// };

// export default RoundsAdmin;
