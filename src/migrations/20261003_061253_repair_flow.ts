import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inquiries_kind" AS ENUM('inquiry', 'repair');
  CREATE TYPE "public"."enum_line_sessions_flow" AS ENUM('inquiry', 'repair');
  CREATE TABLE "line_settings_repair_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"options" varchar
  );
  
  ALTER TABLE "inquiries" ADD COLUMN "kind" "enum_inquiries_kind" DEFAULT 'inquiry';
  ALTER TABLE "inquiries" ADD COLUMN "website" varchar;
  ALTER TABLE "line_sessions" ADD COLUMN "flow" "enum_line_sessions_flow" DEFAULT 'inquiry';
  ALTER TABLE "line_sessions" ADD COLUMN "images" numeric DEFAULT 0;
  ALTER TABLE "line_settings" ADD COLUMN "repair_intro" varchar;
  ALTER TABLE "line_settings" ADD COLUMN "repair_done" varchar;
  ALTER TABLE "line_settings_repair_steps" ADD CONSTRAINT "line_settings_repair_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."line_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "line_settings_repair_steps_order_idx" ON "line_settings_repair_steps" USING btree ("_order");
  CREATE INDEX "line_settings_repair_steps_parent_id_idx" ON "line_settings_repair_steps" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "line_settings_repair_steps" CASCADE;
  ALTER TABLE "inquiries" DROP COLUMN "kind";
  ALTER TABLE "inquiries" DROP COLUMN "website";
  ALTER TABLE "line_sessions" DROP COLUMN "flow";
  ALTER TABLE "line_sessions" DROP COLUMN "images";
  ALTER TABLE "line_settings" DROP COLUMN "repair_intro";
  ALTER TABLE "line_settings" DROP COLUMN "repair_done";
  DROP TYPE "public"."enum_inquiries_kind";
  DROP TYPE "public"."enum_line_sessions_flow";`)
}
