-- Messages + Bodies (Full-Text Search)
CREATE TABLE IF NOT EXISTS messages (
  id            BIGSERIAL PRIMARY KEY,
  account_id    TEXT NOT NULL,
  folder        TEXT NOT NULL,
  uid           BIGINT NOT NULL,
  msgid         TEXT,
  date          TIMESTAMPTZ NOT NULL,
  from_addr     TEXT,
  from_domain   TEXT,
  to_addrs      TEXT,
  subject       TEXT,
  has_attachments BOOLEAN DEFAULT FALSE,
  size          INTEGER,
  flags         TEXT[],
  snippet       TEXT,
  UNIQUE(account_id, folder, uid)
);

CREATE TABLE IF NOT EXISTS bodies (
  message_id    BIGINT PRIMARY KEY REFERENCES messages(id) ON DELETE CASCADE,
  plain_text    TEXT,
  tsv           tsvector
);

-- Optional labels
CREATE TABLE IF NOT EXISTS labels (
  message_id BIGINT REFERENCES messages(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  PRIMARY KEY(message_id, label)
);

-- Rules
CREATE TABLE IF NOT EXISTS rules (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  priority   INTEGER NOT NULL DEFAULT 100,
  json_conf  JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexe
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_from_domain ON messages(from_domain);
CREATE INDEX IF NOT EXISTS idx_bodies_tsv ON bodies USING GIN(tsv);

-- Trigger zur Pflege von tsv
CREATE OR REPLACE FUNCTION bodies_tsv_update() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('simple', coalesce(NEW.plain_text,''));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bodies_tsv ON bodies;
CREATE TRIGGER trg_bodies_tsv BEFORE INSERT OR UPDATE ON bodies
FOR EACH ROW EXECUTE FUNCTION bodies_tsv_update();
