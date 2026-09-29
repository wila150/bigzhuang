import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "line_replies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"keywords" varchar NOT NULL,
  	"reply" varchar NOT NULL,
  	"button_label" varchar,
  	"button_url" varchar,
  	"enabled" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "line_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"welcome_message" varchar,
  	"admin_user_id" varchar,
  	"notify_inquiry" boolean DEFAULT true,
  	"notify_payment" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "line_replies_id" integer;
  CREATE INDEX "line_replies_updated_at_idx" ON "line_replies" USING btree ("updated_at");
  CREATE INDEX "line_replies_created_at_idx" ON "line_replies" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_line_replies_fk" FOREIGN KEY ("line_replies_id") REFERENCES "public"."line_replies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_line_replies_id_idx" ON "payload_locked_documents_rels" USING btree ("line_replies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "line_replies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "line_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "line_replies" CASCADE;
  DROP TABLE "line_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_line_replies_fk";
  
  DROP INDEX "payload_locked_documents_rels_line_replies_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "line_replies_id";`)
}
