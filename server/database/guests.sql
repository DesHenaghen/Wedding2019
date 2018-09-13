CREATE TABLE IF NOT EXISTS guests
(
  first_name    VARCHAR,
  contact_email VARCHAR,
  can_attend    BOOLEAN,
  meal_choice   INTEGER,
  extra_info    VARCHAR,
  contact_phone VARCHAR,
  id            SERIAL NOT NULL
    CONSTRAINT guests_id_pk
    PRIMARY KEY,
  attending     INTEGER,
  last_name     VARCHAR
);

CREATE UNIQUE INDEX guests_id_uindex
  ON guests (id);