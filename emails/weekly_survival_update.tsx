

// import { Button, Tailwind, Hr, Link, Section, Row, Column, Head, Text } from "@react-email/components";
// import * as React from "react";
// import { DateTime } from 'luxon';

// interface Team {
//   id: number;
//   team_name: string;
//   app_user: {
//     first_name: string;
//     last_name: string;
//   };
//   submissions: string[];
// };

// interface EmailProps {
//   league: {
//     id: number;
//     league_name: string;
//   };
//   teams: Team[];
//   rounds: {
//     round_id: number;
//     round_number: number;
//     display_name: string;
//     evicted_contestant: string;
//     deadline_date_time: string;
//   }[];
// }

// export default function Email(props: EmailProps) {
//   const { 
//     league, 
//     teams, 
//     rounds,
//   } = props;

//   return (
//     <Tailwind>
//       <Head />
//       <Section className="container">
//         <Section>
//           <Text className='text-2xl'>{league?.league_name}</Text>
//           <Text className="text-base">
//             For the most up-to date information, go to <Link href={`https://fantasybigbrother.com/league/${league?.id}`}>fantasybigbrother.com</Link>
//           </Text>
//         </Section>

//         {rounds && rounds.map(r => {

//           let roundState: 'due_soon'|'pending'|'complete' = 'due_soon';
//           if (DateTime.fromISO(r.deadline_date_time) < DateTime.now()) roundState = 'pending';
//           if (r.evicted_contestant) roundState = 'complete';

//           let earlierRoundPending = rounds
//             .filter(ro => ro.round_number < r.round_number - 1)
//             .some(ro => ro.evicted_contestant === null);

//           return (
//             <Section>
//               <h2>{r.display_name}</h2>
//               {roundState === 'due_soon' && (
//                 <Text>Be sure to set your lineup by {DateTime.fromISO(r.deadline_date_time, {zone: 'America/New_York'}).toLocaleString(DateTime.DATETIME_SHORT)}.</Text>
//               )}

//               {roundState === 'pending' && (
//                 <Section>
//                   <Text>Your lineup is locked in for this round. See </Text>
//                   {earlierRoundPending && (
//                     <Text>Please note: If a submitted player in this list was evicted in an earlier round, their next player in the lineup will be used for this round.</Text>
//                   )}
//                   <Row>
//                     <Column>
//                       <Text>Team</Text>
//                     </Column>
//                     <Column>
//                       <Text>Chosen Survivor</Text>
//                     </Column>
//                   </Row>
//                   {teams.map(t => {
//                     // let isStrike = t.submissions[r.round_number - 1] === r.evicted_contestant;
//                     return (
//                       <Row>
//                         <Column>
//                           <Row><Text>{t.team_name}</Text></Row>
//                           <Row><Text>{`${t.app_user.first_name} ${t.app_user.last_name}`}</Text></Row>
//                         </Column>
//                         <Column><Text>{t.submissions[r.round_number - 1]}</Text></Column>
//                       </Row>
//                   )})}
//                 </Section>
//               )}

//               {roundState === 'complete' && (
//                 <Section>
//                   <Text>Lineups are locked for this round.</Text>
//                   {earlierRoundPending && (
//                     <Text>Please note: If a submitted chosen survivor in this list was evicted in an earlier round, their next player in the lineup will be used for this round.</Text>
//                   )}
//                   <Row>
//                     <Column>
//                       <Text>Team</Text>
//                     </Column>
//                     <Column>
//                       <Text>Chosen Survivor</Text>
//                     </Column>
//                   </Row>
//                   {teams.map(t => (
//                     <Row>
//                       <Column>
//                         <Row>{t.team_name}</Row>
//                         <Row>{`${t.app_user.first_name} ${t.app_user.last_name}`}</Row>
//                       </Column>
//                       <Column>
//                         <Row>
//                           <Text>{t.submissions[r.round_number - 1] === r.evicted_contestant ? "✅" : "❌"}</Text>
//                           <Text>{t.submissions[r.round_number - 1]}</Text>
//                         </Row>
//                       </Column>
//                     </Row>
//                   ))}
//                 </Section>
//               )}

//               <Section>
//                 <Row>
//                   <Column>Test</Column>
//                 </Row>
//               </Section>
//             </Section>
//           );
//         })}

//       </Section>
//     </Tailwind>
//   );
// }

