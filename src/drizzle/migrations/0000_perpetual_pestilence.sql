CREATE TYPE "public"."experience_level" AS ENUM('Junior', 'Pleno', 'Senior');--> statement-breakpoint
CREATE TYPE "public"."question_difficulty_level" AS ENUM('Fácil', 'Médio', 'Difícil');--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"imageUrl" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jobInfoId" uuid NOT NULL,
	"duration" varchar NOT NULL,
	"humeChatId" varchar,
	"feedback" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar,
	"description" varchar NOT NULL,
	"name" varchar NOT NULL,
	"experienceLevel" "experience_level" NOT NULL,
	"userId" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"difficultyLevel" "question_difficulty_level" NOT NULL,
	"jobInfoId" uuid NOT NULL,
	"text" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_jobInfoId_job_info_id_fk" FOREIGN KEY ("jobInfoId") REFERENCES "public"."job_info"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_jobInfoId_job_info_id_fk" FOREIGN KEY ("jobInfoId") REFERENCES "public"."job_info"("id") ON DELETE cascade ON UPDATE no action;