create table game_results (
  id uuid default gen_random_uuid() primary key,
  level_id integer not null,
  stars integer not null,
  total_salah integer not null,
  rata_waktu float not null,
  detail_error jsonb,
  dyslexia_assessment jsonb,
  created_at timestamp with time zone default now()
);
