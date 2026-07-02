create policy "public_select_sub_events"
  on public.sub_events
  for select
  using (true);
