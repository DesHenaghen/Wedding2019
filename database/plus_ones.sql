CREATE TABLE IF NOT EXISTS plus_ones
(
  id                    SERIAL NOT NULL,
  first_name            VARCHAR(10485760),
  last_name             VARCHAR,
  contact_email         VARCHAR(10485760),
  contact_phone         VARCHAR(10485760),
  meal_choice           INTEGER,
  extra_info            VARCHAR(10485760),
  main_guest_id         INTEGER
    CONSTRAINT plus_ones_guests_id_fk
    REFERENCES guests
    ON UPDATE CASCADE ON DELETE CASCADE,
  use_main_contact_info BOOLEAN DEFAULT FALSE
);
