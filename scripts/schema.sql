CREATE TABLE IF NOT EXISTS portfolio_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id   text NOT NULL,
  color      text NOT NULL CHECK (color IN ('pink', 'green', 'orange', 'purple', 'blue')),
  title_en   text NOT NULL,
  title_he   text NOT NULL,
  sort_order integer NOT NULL,
  hidden     boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  color      text NOT NULL CHECK (color IN ('pink', 'green', 'orange', 'purple', 'blue')),
  quote_en   text NOT NULL,
  quote_he   text NOT NULL,
  name_en    text NOT NULL,
  name_he    text NOT NULL,
  role_en    text NOT NULL,
  role_he    text NOT NULL,
  sort_order integer NOT NULL,
  hidden     boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip           text NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_attempts_ip_attempted_at_idx
  ON login_attempts (ip, attempted_at);
