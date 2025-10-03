-- Drop table if exists
DROP TABLE IF EXISTS squirrels CASCADE;

-- Create squirrels table
CREATE TABLE squirrels (
  id VARCHAR(50) PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  unique_squirrel_id VARCHAR(50) NOT NULL,
  hectare VARCHAR(10) NOT NULL,
  shift VARCHAR(10) NOT NULL,
  date VARCHAR(20) NOT NULL,
  hectare_squirrel_number INTEGER NOT NULL,
  age VARCHAR(50),
  primary_fur_color VARCHAR(50),
  highlight_fur_color VARCHAR(50),
  combination_of_primary_and_highlight_color VARCHAR(100),
  color_notes TEXT,
  location VARCHAR(100),
  above_ground_sighter_measurement VARCHAR(50),
  specific_location TEXT,
  running BOOLEAN,
  chasing BOOLEAN,
  climbing BOOLEAN,
  eating BOOLEAN,
  foraging BOOLEAN,
  other_activities TEXT,
  kuks BOOLEAN,
  quaas BOOLEAN,
  moans BOOLEAN,
  tail_flags BOOLEAN,
  tail_twitches BOOLEAN,
  approaches BOOLEAN,
  indifferent BOOLEAN,
  runs_from BOOLEAN,
  other_interactions TEXT,
  lat_long VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_squirrels_latitude ON squirrels(latitude);
CREATE INDEX idx_squirrels_longitude ON squirrels(longitude);
CREATE INDEX idx_squirrels_unique_id ON squirrels(unique_squirrel_id);
CREATE INDEX idx_squirrels_hectare ON squirrels(hectare);
CREATE INDEX idx_squirrels_date ON squirrels(date);
CREATE INDEX idx_squirrels_primary_fur_color ON squirrels(primary_fur_color);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_squirrels_updated_at
  BEFORE UPDATE ON squirrels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


