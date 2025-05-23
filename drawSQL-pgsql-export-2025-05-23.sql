CREATE TABLE "Lid"(
    "id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "target_id" INTEGER NOT NULL,
    "lid_stage_id" INTEGER NOT NULL,
    "test_date" DATE NOT NULL,
    "trial_lesson_date" INTEGER NOT NULL,
    "trial_lesson_time" VARCHAR(255) NOT NULL,
    "trial_lesson_group_id" INTEGER NOT NULL,
    "lid_status_id" INTEGER NOT NULL,
    "cancel_reson_id" INTEGER NOT NULL
);
ALTER TABLE
    "Lid" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Lid"."target_id" IS 'Target table bor (id,name)';
CREATE TABLE "Stuff"(
    "id" BIGINT NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "parol" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL
);
ALTER TABLE
    "Stuff" ADD PRIMARY KEY("id");
CREATE TABLE "Group"(
    "id" INTEGER NOT NULL,
    "group_name" VARCHAR(255) NOT NULL,
    "lesson_start_time" VARCHAR(255) NOT NULL,
    "lesson_continuous" VARCHAR(255) NOT NULL,
    "lesson_week_day" VARCHAR(255) NOT NULL,
    "group_stage_id" INTEGER NOT NULL,
    "room_number" VARCHAR(255) NOT NULL,
    "room_floor" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "lessons_quant" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL
);
ALTER TABLE
    "Group" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Group"."lesson_week_day" IS '[1,3,5]';
CREATE TABLE "students"(
    "id" INTEGER NOT NULL,
    "lid_id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "bithday" DATE NOT NULL,
    "male" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "students" ADD PRIMARY KEY("id");
CREATE TABLE "Lesson"(
    "id" INTEGER NOT NULL,
    "lesson_theme" VARCHAR(255) NOT NULL,
    "lesson_number" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "lesson_date" DATE NOT NULL
);
ALTER TABLE
    "Lesson" ADD PRIMARY KEY("id");
CREATE TABLE "student_lesson"(
    "id" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "is_there" BOOLEAN NOT NULL,
    "reason" VARCHAR(255) NOT NULL,
    "be_paid" BOOLEAN NOT NULL
);
ALTER TABLE
    "student_lesson" ADD PRIMARY KEY("id");
CREATE TABLE "payment"(
    "id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "payment_last_date" DATE NOT NULL,
    "payment_date" DATE NOT NULL,
    "price" DECIMAL(8, 2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL,
    "total_attent" INTEGER NOT NULL
);
ALTER TABLE
    "payment" ADD PRIMARY KEY("id");
CREATE TABLE "stage"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "stage" ADD PRIMARY KEY("id");
CREATE TABLE "student_group"(
    "id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL
);
ALTER TABLE
    "student_group" ADD PRIMARY KEY("id");
CREATE TABLE "branch"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "call_number" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "branch" ADD PRIMARY KEY("id");
CREATE TABLE "reason"(
    "id" INTEGER NOT NULL,
    "reason_lid" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "reason" ADD PRIMARY KEY("id");
CREATE TABLE "role"(
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "role" ADD PRIMARY KEY("id");
CREATE TABLE "status"(
    "id" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "status" ADD PRIMARY KEY("id");
CREATE TABLE "stuff_role"(
    "id" INTEGER NOT NULL,
    "stuff_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL
);
ALTER TABLE
    "stuff_role" ADD PRIMARY KEY("id");
CREATE TABLE "group_stuff"(
    "id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "stuff_id" INTEGER NOT NULL
);
ALTER TABLE
    "group_stuff" ADD PRIMARY KEY("id");
ALTER TABLE
    "student_lesson" ADD CONSTRAINT "student_lesson_lesson_id_foreign" FOREIGN KEY("lesson_id") REFERENCES "Lesson"("id");
ALTER TABLE
    "stuff_role" ADD CONSTRAINT "stuff_role_stuff_id_foreign" FOREIGN KEY("stuff_id") REFERENCES "Stuff"("id");
ALTER TABLE
    "Lesson" ADD CONSTRAINT "lesson_group_id_foreign" FOREIGN KEY("group_id") REFERENCES "Group"("group_name");
ALTER TABLE
    "Lid" ADD CONSTRAINT "lid_cancel_reson_id_foreign" FOREIGN KEY("cancel_reson_id") REFERENCES "reason"("id");
ALTER TABLE
    "Lid" ADD CONSTRAINT "lid_trial_lesson_group_id_foreign" FOREIGN KEY("trial_lesson_group_id") REFERENCES "Group"("id");
ALTER TABLE
    "student_lesson" ADD CONSTRAINT "student_lesson_student_id_foreign" FOREIGN KEY("student_id") REFERENCES "students"("id");
ALTER TABLE
    "payment" ADD CONSTRAINT "payment_student_id_foreign" FOREIGN KEY("student_id") REFERENCES "students"("id");
ALTER TABLE
    "stuff_role" ADD CONSTRAINT "stuff_role_role_id_foreign" FOREIGN KEY("role_id") REFERENCES "role"("id");
ALTER TABLE
    "Lid" ADD CONSTRAINT "lid_lid_status_id_foreign" FOREIGN KEY("lid_status_id") REFERENCES "status"("id");
ALTER TABLE
    "student_group" ADD CONSTRAINT "student_group_student_id_foreign" FOREIGN KEY("student_id") REFERENCES "students"("id");
ALTER TABLE
    "Group" ADD CONSTRAINT "group_group_stage_id_foreign" FOREIGN KEY("group_stage_id") REFERENCES "stage"("id");
ALTER TABLE
    "group_stuff" ADD CONSTRAINT "group_stuff_stuff_id_foreign" FOREIGN KEY("stuff_id") REFERENCES "Stuff"("id");
ALTER TABLE
    "students" ADD CONSTRAINT "students_lid_id_foreign" FOREIGN KEY("lid_id") REFERENCES "Lid"("id");
ALTER TABLE
    "group_stuff" ADD CONSTRAINT "group_stuff_group_id_foreign" FOREIGN KEY("group_id") REFERENCES "Group"("id");
ALTER TABLE
    "Lid" ADD CONSTRAINT "lid_lid_stage_id_foreign" FOREIGN KEY("lid_stage_id") REFERENCES "stage"("id");
ALTER TABLE
    "Group" ADD CONSTRAINT "group_branch_id_foreign" FOREIGN KEY("branch_id") REFERENCES "branch"("id");
ALTER TABLE
    "student_group" ADD CONSTRAINT "student_group_group_id_foreign" FOREIGN KEY("group_id") REFERENCES "Group"("id");