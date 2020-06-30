CREATE TABLE students(
	user_id serial PRIMARY KEY,
	firstName VARCHAR (50) NOT NULL,
	lastName VARCHAR (50) NOT NULL
);

CREATE TABLE grades(
	grade_id serial PRIMARY KEY,
	user_id integer NOT NULL,
    class VARCHAR (50) NOT NULL,
    grade VARCHAR (50) NOT NULL
);