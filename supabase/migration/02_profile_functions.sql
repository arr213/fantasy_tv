create or replace function get_my_leagues(user_email text) 
  return setof public.league
  language plpgsql
  as $$
    select l.*
    from public.leagues l
    join public.team t on t.league_id = l.id
      where t.manager_email = user_email
  $$;

create or replace function get_available_leagues (user_email text) 
  returns setof public.league
  language plpgsql
  as $$ 
    begin
      select l.* 
      from public.leagues l 
      where l.status = 'public_signup' 
        and not exists ( 
          select 1 
          from public.team t 
          where t.league_id = l.id 
            and t.manager_email = user_email 
        ); 
    end 
  $$;


