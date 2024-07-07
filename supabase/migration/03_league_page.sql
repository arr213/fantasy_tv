

CREATE OR REPLACE FUNCTION get_team_summary(the_league_id bigint)
RETURNS TABLE(
    team_name text,
    team_id bigint,
    league_name text,
    league_id bigint,
    team_manager_first_name text,
    team_manager_last_name text,
    team_manager_email text,
    team_line_up_so_far bigint[],
    remaining_player_count bigint,
    mistake_count bigint,
    rounds_with_mistakes bigint
) AS $$
BEGIN
    RETURN QUERY
    WITH team_lineups AS (
        SELECT 
            l.id AS lineup_id,
            l.created_at AS lineup_created_at,
            l.team_id,
            array_agg(p.contestant_id ORDER BY p.position_number ASC) AS contestant_ids
        FROM 
            public.team_lineup l
        JOIN 
            public.team_member_placement p ON p.lineup_id = l.id
        GROUP BY 
            l.id
    ),
    selected_lineups AS (
        SELECT 
            r.id AS round_id,
            t.id AS team_id,
            r.round_number,
            lu.contestant_ids[round_number] AS contestant_id,
            r.deadline_date_time
        FROM 
            public.round r
        JOIN 
            public.team t ON t.league_id = the_league_id
        JOIN 
            team_lineups lu ON lu.team_id = t.id
        WHERE 
            r.deadline_date_time < NOW()
            AND r.deadline_date_time > lu.lineup_created_at
        ORDER BY 
            r.deadline_date_time DESC
    ),
    mistakes AS (
        SELECT 
            sl.team_id,
            COUNT(*) AS mistake_count,
            COUNT(DISTINCT sl.round_id) AS rounds_with_mistakes
        FROM 
            selected_lineups sl
        JOIN 
            public.fantasy_event fe ON fe.contestant_id = sl.contestant_id AND fe.event_type = 'eviction'
        GROUP BY 
            sl.team_id
    ),
    remaining_players AS (
        SELECT 
            t.id AS team_id,
            COUNT(c.id) AS remaining_player_count
        FROM 
            public.team t
        JOIN 
            public.contestant c ON c.season_id = (
                SELECT season_id FROM public.league WHERE id = the_league_id
            )
        LEFT JOIN 
            selected_lineups sl ON sl.contestant_id = c.id AND sl.team_id = t.id
        LEFT JOIN 
            public.fantasy_event fe ON fe.contestant_id = c.id AND fe.event_type = 'eviction'
        WHERE 
            t.league_id = the_league_id
            AND sl.contestant_id IS NULL
            AND fe.id IS NULL
        GROUP BY 
            t.id
    )
    SELECT 
        t.team_name,
        t.id AS team_id,
        l.league_name,
        l.id AS league_id,
        au.first_name AS team_manager_first_name,
        au.last_name AS team_manager_last_name,
        au.email AS team_manager_email,
        array_agg(sl.contestant_id ORDER BY sl.round_number) AS team_line_up_so_far,
        rp.remaining_player_count,
        COALESCE(m.mistake_count, 0) AS mistake_count,
        COALESCE(m.rounds_with_mistakes, 0) AS rounds_with_mistakes
    FROM 
        public.team t
    JOIN 
        public.league l ON t.league_id = l.id
    JOIN 
        public.app_user au ON au.email = t.manager_email
    JOIN 
        selected_lineups sl ON sl.team_id = t.id
    LEFT JOIN 
        remaining_players rp ON rp.team_id = t.id
    LEFT JOIN 
        mistakes m ON m.team_id = t.id
    WHERE 
        l.id = the_league_id
    GROUP BY 
        t.id, l.id, au.first_name, au.last_name, au.email, rp.remaining_player_count, m.mistake_count, m.rounds_with_mistakes
    ORDER BY 
        t.team_name;
END;
$$ LANGUAGE plpgsql;
