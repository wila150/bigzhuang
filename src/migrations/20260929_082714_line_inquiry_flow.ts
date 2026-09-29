import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_source" AS ENUM('web', 'line');
  CREATE TYPE "public"."enum_line_settings_inquiry_steps_save_to" AS ENUM('message', 'service', 'budget');
  CREATE TABLE "line_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" varchar NOT NULL,
  	"display_name" varchar,
  	"step" numeric DEFAULT 0 NOT NULL,
  	"answers" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "line_settings_inquiry_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"options" varchar,
  	"save_to" "enum_line_settings_inquiry_steps_save_to" DEFAULT 'message'
  );
  
  ALTER TABLE "inquiries" ADD COLUMN "source" "enum_inquiries_source" DEFAULT 'web';
  ALTER TABLE "inquiries" ADD COLUMN "line_user_id" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "line_sessions_id" integer;
  ALTER TABLE "line_settings" ADD COLUMN "inquiry_intro" varchar;
  ALTER TABLE "line_settings" ADD COLUMN "inquiry_done" varchar;
  ALTER TABLE "line_settings_inquiry_steps" ADD CONSTRAINT "line_settings_inquiry_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."line_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "line_sessions_user_id_idx" ON "line_sessions" USING btree ("user_id");
  CREATE INDEX "line_sessions_updated_at_idx" ON "line_sessions" USING btree ("updated_at");
  CREATE INDEX "line_sessions_created_at_idx" ON "line_sessions" USING btree ("created_at");
  CREATE INDEX "line_settings_inquiry_steps_order_idx" ON "line_settings_inquiry_steps" USING btree ("_order");
  CREATE INDEX "line_settings_inquiry_steps_parent_id_idx" ON "line_settings_inquiry_steps" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_line_sessions_fk" FOREIGN KEY ("line_sessions_id") REFERENCES "public"."line_sessions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_line_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("line_sessions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "line_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "line_settings_inquiry_steps" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "line_sessions" CASCADE;
  DROP TABLE "line_settings_inquiry_steps" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_line_sessions_fk";
  
  DROP INDEX "payload_locked_documents_rels_line_sessions_id_idx";
  ALTER TABLE "inquiries" DROP COLUMN "source";
  ALTER TABLE "inquiries" DROP COLUMN "line_user_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "line_sessions_id";
  ALTER TABLE "line_settings" DROP COLUMN "inquiry_intro";
  ALTER TABLE "line_settings" DROP COLUMN "inquiry_done";
  DROP TYPE "public"."enum_inquiries_source";
  DROP TYPE "public"."enum_line_settings_inquiry_steps_save_to";`)
}
