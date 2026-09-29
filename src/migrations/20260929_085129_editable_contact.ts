import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_page_fields_type" AS ENUM('text', 'email', 'tel', 'textarea', 'select');
  CREATE TYPE "public"."enum_contact_page_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_contact_page_fields_role" AS ENUM('other', 'name', 'email', 'phone', 'lineId', 'service', 'budget', 'message');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_fields_type" AS ENUM('text', 'email', 'tel', 'textarea', 'select');
  CREATE TYPE "public"."enum__contact_page_v_version_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum__contact_page_v_version_fields_role" AS ENUM('other', 'name', 'email', 'phone', 'lineId', 'service', 'budget', 'message');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "inquiries_extras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "contact_page_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" "enum_contact_page_fields_type" DEFAULT 'text',
  	"width" "enum_contact_page_fields_width" DEFAULT 'full',
  	"required" boolean,
  	"role" "enum_contact_page_fields_role" DEFAULT 'other',
  	"placeholder" varchar,
  	"hint" varchar,
  	"use_services" boolean,
  	"options" varchar,
  	"empty_option" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_lead" varchar,
  	"channels_title" varchar,
  	"line_note" varchar,
  	"email_note" varchar,
  	"instagram_note" varchar,
  	"form_title" varchar,
  	"require_contact" boolean DEFAULT true,
  	"contact_hint" varchar,
  	"require_contact_message" varchar,
  	"submit_label" varchar,
  	"success_title" varchar,
  	"success_text" varchar,
  	"error_text" varchar,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_page_v_version_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"type" "enum__contact_page_v_version_fields_type" DEFAULT 'text',
  	"width" "enum__contact_page_v_version_fields_width" DEFAULT 'full',
  	"required" boolean,
  	"role" "enum__contact_page_v_version_fields_role" DEFAULT 'other',
  	"placeholder" varchar,
  	"hint" varchar,
  	"use_services" boolean,
  	"options" varchar,
  	"empty_option" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title" varchar,
  	"version_hero_lead" varchar,
  	"version_channels_title" varchar,
  	"version_line_note" varchar,
  	"version_email_note" varchar,
  	"version_instagram_note" varchar,
  	"version_form_title" varchar,
  	"version_require_contact" boolean DEFAULT true,
  	"version_contact_hint" varchar,
  	"version_require_contact_message" varchar,
  	"version_submit_label" varchar,
  	"version_success_title" varchar,
  	"version_success_text" varchar,
  	"version_error_text" varchar,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_button" varchar;
  ALTER TABLE "inquiries_extras" ADD CONSTRAINT "inquiries_extras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_fields" ADD CONSTRAINT "contact_page_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_fields" ADD CONSTRAINT "_contact_page_v_version_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inquiries_extras_order_idx" ON "inquiries_extras" USING btree ("_order");
  CREATE INDEX "inquiries_extras_parent_id_idx" ON "inquiries_extras" USING btree ("_parent_id");
  CREATE INDEX "contact_page_fields_order_idx" ON "contact_page_fields" USING btree ("_order");
  CREATE INDEX "contact_page_fields_parent_id_idx" ON "contact_page_fields" USING btree ("_parent_id");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE INDEX "_contact_page_v_version_fields_order_idx" ON "_contact_page_v_version_fields" USING btree ("_order");
  CREATE INDEX "_contact_page_v_version_fields_parent_id_idx" ON "_contact_page_v_version_fields" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");
  CREATE INDEX "_contact_page_v_autosave_idx" ON "_contact_page_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "inquiries_extras" CASCADE;
  DROP TABLE "contact_page_fields" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "_contact_page_v_version_fields" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "cta_title";
  ALTER TABLE "site_settings" DROP COLUMN "cta_text";
  ALTER TABLE "site_settings" DROP COLUMN "cta_button";
  DROP TYPE "public"."enum_contact_page_fields_type";
  DROP TYPE "public"."enum_contact_page_fields_width";
  DROP TYPE "public"."enum_contact_page_fields_role";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_fields_type";
  DROP TYPE "public"."enum__contact_page_v_version_fields_width";
  DROP TYPE "public"."enum__contact_page_v_version_fields_role";
  DROP TYPE "public"."enum__contact_page_v_version_status";`)
}
