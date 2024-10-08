-- inserts a row into public.profiles
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer set search_path = ''
  as $$
  begin
    insert into public.app_user (email)
    values (new.email);
    return new;
  end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();