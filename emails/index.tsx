

import { Button, Tailwind, Hr, Link, Section, Row, Column } from "@react-email/components";
import * as React from "react";

interface Team {
  id: number;
  team_name: string;
  app_user: {
    first_name: string;
    last_name: string;
  };
  submissions: string[];
};

interface EmailProps {
  league_id: number;
  teams: Team[];
  rounds: {
    round_id: number;
    round_number: number;
    display_name: string;
    evicted_contestant: number;
  }[];
}
export default function Email(props: EmailProps) {
  const { league_id, teams, rounds } = props;
  return (
    <Tailwind>
      <div className="container">
        <Section>
          <h1 className='text-2xl'>Fantasy Big Brother: Survival</h1>
          <p className="">
            For the most up-to date information, go to 
            <Link href={`https://fantasybigbrother.com/league/${league_id}`}>fantasybigbrother.com</Link>
          </p>
        </Section>

        {rounds.map(r => {

          return (
            <Section>
              <h2>{r.display_name}</h2>
              <Section>
                <Row>
                  <Column>Test</Column>
                </Row>
              </Section>
            </Section>
          );
        })}

      </div>
    </Tailwind>
  );
}

