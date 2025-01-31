CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;


-- user

CREATE TABLE "user" (
  "id" VARCHAR PRIMARY KEY,
  "plan" VARCHAR DEFAULT 'free' NOT NULL,
  "modified" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
  "created" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);

-- exercise

CREATE TABLE "exercise" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "modified" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
  "created" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);


-- workout

CREATE TABLE "workout" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR,
  "notes" VARCHAR,
  "creatorID" VARCHAR REFERENCES "user"(id) NOT NULL,
  "modified" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000),
  "created" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);


-- workoutExercise

CREATE TABLE "workoutExercise" (
  "id" VARCHAR PRIMARY KEY,
  "workoutID" VARCHAR REFERENCES  workout(id) ON DELETE CASCADE,
  "exerciseID" VARCHAR REFERENCES exercise(id) ON DELETE CASCADE
);


-- exerciseSet

CREATE TABLE "exerciseSet" (
  "id" VARCHAR PRIMARY KEY,
  "weight" FLOAT,
  "reps" INTEGER NOT NULL,
  "workoutExerciseID" VARCHAR REFERENCES "user"(id) NOT NULL,
  "created" double precision DEFAULT (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000)
);



CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified = (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_created_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created = (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- Add triggers for user table
CREATE TRIGGER update_user_modified
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_user_created
BEFORE INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION set_created_on_insert();

-- Add triggers for exercise table
CREATE TRIGGER update_exercise_modified
BEFORE UPDATE ON "exercise"
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_exercise_created
BEFORE INSERT ON "exercise"
FOR EACH ROW
EXECUTE FUNCTION set_created_on_insert();

-- Add triggers for workout table
CREATE TRIGGER update_workout_modified
BEFORE UPDATE ON "workout"
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_workout_created
BEFORE INSERT ON "workout"
FOR EACH ROW
EXECUTE FUNCTION set_created_on_insert();


-- Add trigger for exerciseSet table
CREATE TRIGGER set_exerciseSet_created
BEFORE INSERT ON "exerciseSet"
FOR EACH ROW
EXECUTE FUNCTION set_created_on_insert();