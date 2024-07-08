CREATE OR REPLACE FUNCTION get_team_lineup(
    the_league_id BIGINT,
    team_manager_email TEXT,
    deadline TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
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
        WHERE l.id = the_league_id AND t.manager_email = team_manager_email
        LIMIT 1
    )
    SELECT 
        l.id AS lineup_id,
        l.created_at AS lineup_created_at,
        l.team_id,
        array_agg(p.contestant_id ORDER BY p.position_number ASC) AS contestant_ids
    FROM 
        public.team_lineup l
    JOIN 
        public.team_member_placement p ON p.lineup_id = l.id
    JOIN 
        team_info ti ON ti.team_id = l.team_id
    WHERE 
        (deadline IS NULL OR l.created_at <= deadline)
    GROUP BY 
        l.id, l.created_at, l.team_id
    ORDER BY 
        l.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION get_rounds_with_evicted_contestant(the_league_id BIGINT)
RETURNS TABLE(
    round_id BIGINT,
    season_id BIGINT,
    round_number SMALLINT,
    display_name TEXT,
    deadline_date_time TIMESTAMP WITH TIME ZONE,
    evicted_contestant BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.id AS round_id,
        r.season_id,
        r.round_number,
        r.display_name,
        r.deadline_date_time,
        (SELECT e.contestant_id
         FROM public.fantasy_event e
         WHERE e.round_id = r.id
           AND e.event_type = 'eviction'
         LIMIT 1) AS evicted_contestant
    FROM
        public.round r
    JOIN
        public.season s ON r.season_id = s.id
    JOIN
        public.league l ON s.id = l.season_id
    WHERE
        l.id = the_league_id;
END;
$$ LANGUAGE plpgsql;





CREATE OR REPLACE FUNCTION get_contestants(p_league_id BIGINT)
RETURNS TABLE(
    contestant_id BIGINT,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    season_id BIGINT,
    status TEXT,
    rank SMALLINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS contestant_id,
        c.first_name,
        c.last_name,
        c.display_name,
        c.season_id,
        c.status,
        c.rank
    FROM 
        public.contestant c
    JOIN 
        public.season s ON c.season_id = s.id
    JOIN 
        public.league l ON s.id = l.season_id
    WHERE 
        l.id = p_league_id;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION get_team_submissions(the_team_id BIGINT)
RETURNS TABLE(
    round_id BIGINT,
    round_number SMALLINT,
    round_display_name TEXT,
    deadline_date_time TIMESTAMP WITH TIME ZONE,
    contestant_id BIGINT,
    contestant_first_name TEXT,
    contestant_last_name TEXT,
    contestant_display_name TEXT,
    contestant_status TEXT,
    contestant_rank SMALLINT,
    is_correct BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH round_submissions AS (
        SELECT 
            sr.round_id,
            r.round_number,
            r.display_name AS round_display_name,
            r.deadline_date_time,
            sr.contestant_id
        FROM 
            public.survival_record sr
        JOIN 
            public.round r ON sr.round_id = r.id
        WHERE 
            sr.team_id = the_team_id
    ),
    evictions AS (
        SELECT 
            e.round_id,
            e.contestant_id AS evicted_contestant_id
        FROM 
            public.fantasy_event e
        WHERE 
            e.event_type = 'eviction'
    )
    SELECT 
        rs.round_id,
        rs.round_number,
        rs.round_display_name,
        rs.deadline_date_time,
        rs.contestant_id,
        c.first_name AS contestant_first_name,
        c.last_name AS contestant_last_name,
        c.display_name AS contestant_display_name,
        c.status AS contestant_status,
        c.rank AS contestant_rank,
        CASE 
            WHEN e.evicted_contestant_id IS NULL THEN NULL
            WHEN e.evicted_contestant_id = rs.contestant_id THEN FALSE
            ELSE TRUE
        END AS is_correct
    FROM 
        round_submissions rs
    JOIN 
        public.contestant c ON rs.contestant_id = c.id
    LEFT JOIN 
        evictions e ON rs.round_id = e.round_id
    ORDER BY 
        rs.round_number;
END;
$$ LANGUAGE plpgsql;

