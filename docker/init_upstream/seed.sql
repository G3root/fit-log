CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;


-- CREATE OR REPLACE FUNCTION update_modified_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.modified = (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000);
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION set_created_on_insert()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.created = (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000);
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;



-- -- Add triggers for user table
-- CREATE TRIGGER update_user_modified
-- BEFORE UPDATE ON "user"
-- FOR EACH ROW
-- EXECUTE FUNCTION update_modified_column();

-- CREATE TRIGGER set_user_created
-- BEFORE INSERT ON "user"
-- FOR EACH ROW
-- EXECUTE FUNCTION set_created_on_insert();

-- -- Add triggers for exercise table
-- CREATE TRIGGER update_exercise_modified
-- BEFORE UPDATE ON "exercise"
-- FOR EACH ROW
-- EXECUTE FUNCTION update_modified_column();

-- CREATE TRIGGER set_exercise_created
-- BEFORE INSERT ON "exercise"
-- FOR EACH ROW
-- EXECUTE FUNCTION set_created_on_insert();

-- -- Add triggers for workout table
-- CREATE TRIGGER update_workout_modified
-- BEFORE UPDATE ON "workout"
-- FOR EACH ROW
-- EXECUTE FUNCTION update_modified_column();

-- CREATE TRIGGER set_workout_created
-- BEFORE INSERT ON "workout"
-- FOR EACH ROW
-- EXECUTE FUNCTION set_created_on_insert();


-- -- Add trigger for exerciseSet table
-- CREATE TRIGGER set_exerciseSet_created
-- BEFORE INSERT ON "exerciseSet"
-- FOR EACH ROW
-- EXECUTE FUNCTION set_created_on_insert();