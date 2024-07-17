CREATE OR REPLACE FUNCTION get_all_lineups(the_league_id BIGINT)
RETURNS TABLE(
    lineup_id BIGINT,
    lineup_created_at TIMESTAMP WITH TIME ZONE,
    team_id BIGINT,
    contestant_ids BIGINT[]
) AS $$
BEGIN
    RETURN QUERY
    WITH team_info AS (
        SELECT t.id AS team_id
        FROM public.team t
        JOIN public.league l ON t.league_id = l.id
        WHERE l.id = the_league_id
    ),
    latest_lineups AS (
        SELECT 
            l.id AS lineup_id,
            l.created_at AS lineup_created_at,
            l.team_id,
            array_agg(p.contestant_id ORDER BY p.position_number ASC) AS contestant_ids,
            r.id AS round_id,
            r.round_number,
            ROW_NUMBER() OVER (PARTITION BY l.team_id, r.id ORDER BY l.created_at DESC) AS rn
        FROM 
            public.team_lineup l
        JOIN 
            public.team_member_placement p ON p.lineup_id = l.id
        JOIN 
            public.round r ON l.created_at <= r.deadline_date_time
        JOIN 
            team_info ti ON ti.team_id = l.team_id
        GROUP BY 
            l.id, l.created_at, l.team_id, r.id
    )
    SELECT 
        lineup_id,
        lineup_created_at,
        team_id,
        contestant_ids, 
        round_id,
        round_number
    FROM 
        latest_lineups
    WHERE 
        rn = 1
    ORDER BY 
        lineup_created_at DESC;
END;
$$ LANGUAGE plpgsql;


