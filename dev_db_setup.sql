-- development database setup script

CREATE DATABASE cropshield_dev_db;

-- Create the user with a password
DO
$$
BEGIN
   IF NOT EXISTS (
       SELECT FROM pg_catalog.pg_roles 
       WHERE rolname = 'cropshield_developer'
   ) THEN
       CREATE ROLE cropshield_developer WITH LOGIN PASSWORD '123456';
   END IF;
END
$$;

-- Grant privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE cropshield_dev_db TO cropshield_developer;