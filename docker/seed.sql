CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;

\c zstart;

CREATE TABLE "exercise" (
  "id" VARCHAR PRIMARY KEY,
  "name" VARCHAR NOT NULL
);

