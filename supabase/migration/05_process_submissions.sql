-- Survival records must be unique per team-round
ALTER TABLE public.survival_record
ADD CONSTRAINT unique_team_round UNIQUE (team_id, round_id);


CREATE OR REPLACE FUNCTION get_all_lineups(the_league_id BIGINT)
RETURNS TABLE(
    lineup_id BIGINT,
    lineup_created_at TIMESTAMP WITH TIME ZONE,
    team_id BIGINT,
    contestant_ids BIGINT[],
    round_id BIGINT,
    round_number SMALLINT
) AS $$
BEGIN
    RETURN QUERY
    WITH team_info AS (
        SELECT t.id AS team_id
        FROM public.team t
        WHERE t.league_id = the_league_id
    ),
    eligible_lineups AS (
        SELECT 
            l.id AS lineup_id,
            l.created_at AS lineup_created_at,
            l.team_id,
            r.id AS round_id,
            r.round_number,
            array_agg(p.contestant_id ORDER BY p.position_number ASC) AS contestant_ids
        FROM 
            public.team_lineup l
        JOIN 
            public.team_member_placement p ON p.lineup_id = l.id
        JOIN 
            public.round r ON r.season_id = (
                SELECT le.season_id 
                FROM public.league le 
                WHERE le.id = the_league_id
                AND r.deadline_date_time < NOW()
            )
        JOIN 
            team_info ti ON ti.team_id = l.team_id
        WHERE 
            l.created_at <= r.deadline_date_time
        GROUP BY 
            l.id, l.created_at, l.team_id, r.id, r.round_number
    ),
    latest_lineups AS (
        SELECT 
            el.lineup_id,
            el.lineup_created_at,
            el.team_id,
            el.contestant_ids,
            el.round_id,
            el.round_number,
            ROW_NUMBER() OVER (PARTITION BY el.team_id, el.round_id ORDER BY el.lineup_created_at DESC) AS rn
        FROM 
            eligible_lineups el
    )
    SELECT 
        ll.lineup_id,
        ll.lineup_created_at,
        ll.team_id,
        ll.contestant_ids, 
        ll.round_id,
        ll.round_number
    FROM 
        latest_lineups ll
    WHERE 
        ll.rn = 1
    ORDER BY 
        ll.round_number ASC, 
        ll.lineup_created_at DESC;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION create_survival_submissions(
    the_league_id BIGINT,
    survival_records JSONB
)
RETURNS VOID AS $$
BEGIN
    -- Delete old survival records for the given league
    DELETE FROM public.survival_record
    WHERE team_id IN (
        SELECT t.id
        FROM public.team t
        JOIN public.league l ON t.league_id = l.id
        WHERE l.id = the_league_id
    );

    -- Insert new survival records
    INSERT INTO public.survival_record (team_id, contestant_id, round_id)
    SELECT 
        (value->>'team_id')::BIGINT,
        (value->>'contestant_id')::BIGINT,
        (value->>'round_id')::BIGINT
    FROM jsonb_array_elements(survival_records) AS value
    ON CONFLICT (team_id, round_id) DO UPDATE
    SET contestant_id = EXCLUDED.contestant_id;
END;
$$ LANGUAGE plpgsql;