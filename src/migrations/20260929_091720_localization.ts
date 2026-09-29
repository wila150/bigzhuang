import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('zh', 'en');
  CREATE TYPE "public"."enum__services_v_published_locale" AS ENUM('zh', 'en');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('zh', 'en');
  CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('zh', 'en');
  CREATE TYPE "public"."enum__about_page_v_published_locale" AS ENUM('zh', 'en');
  CREATE TYPE "public"."enum__process_page_v_published_locale" AS ENUM('zh', 'en');
  CREATE TYPE "public"."enum__contact_page_v_published_locale" AS ENUM('zh', 'en');
  CREATE TABLE "services_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_features_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_points_tags_locales" (
  	"tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_addons_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"tagline" varchar,
  	"problem" varchar,
  	"solution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_includes_locales" (
  	"item" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_features_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_points_tags_locales" (
  	"tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_version_addons_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_services_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_tagline" varchar,
  	"version_problem" varchar,
  	"version_solution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_features_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"site_type" varchar,
  	"industry" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_features_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_site_type" varchar,
  	"version_industry" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_selling_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_title" varchar,
  	"hero_text" varchar,
  	"cta_title" varchar,
  	"cta_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_selling_points_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_locales" (
  	"version_hero_title" varchar,
  	"version_hero_text" varchar,
  	"version_cta_title" varchar,
  	"version_cta_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_locales" (
  	"intro" varchar,
  	"why" varchar,
  	"story" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_v_locales" (
  	"version_intro" varchar,
  	"version_why" varchar,
  	"version_story" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "process_page_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "process_page_locales" (
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_process_page_v_version_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_process_page_v_locales" (
  	"version_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_page_fields_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"hint" varchar,
  	"options" varchar,
  	"empty_option" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page_locales" (
  	"hero_title" varchar,
  	"hero_lead" varchar,
  	"channels_title" varchar,
  	"line_note" varchar,
  	"email_note" varchar,
  	"instagram_note" varchar,
  	"form_title" varchar,
  	"contact_hint" varchar,
  	"require_contact_message" varchar,
  	"submit_label" varchar,
  	"success_title" varchar,
  	"success_text" varchar,
  	"error_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_contact_page_v_version_fields_locales" (
  	"label" varchar,
  	"placeholder" varchar,
  	"hint" varchar,
  	"options" varchar,
  	"empty_option" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_contact_page_v_locales" (
  	"version_hero_title" varchar,
  	"version_hero_lead" varchar,
  	"version_channels_title" varchar,
  	"version_line_note" varchar,
  	"version_email_note" varchar,
  	"version_instagram_note" varchar,
  	"version_form_title" varchar,
  	"version_contact_hint" varchar,
  	"version_require_contact_message" varchar,
  	"version_submit_label" varchar,
  	"version_success_title" varchar,
  	"version_success_text" varchar,
  	"version_error_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_keywords_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"service_area" varchar DEFAULT '全台線上服務',
  	"footer_blurb" varchar,
  	"cta_title" varchar,
  	"cta_text" varchar,
  	"cta_button" varchar,
  	"payment_note" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "_services_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_services_v" ADD COLUMN "published_locale" "enum__services_v_published_locale";
  ALTER TABLE "_projects_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_projects_v" ADD COLUMN "published_locale" "enum__projects_v_published_locale";
  ALTER TABLE "_home_page_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_home_page_v" ADD COLUMN "published_locale" "enum__home_page_v_published_locale";
  ALTER TABLE "_about_page_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_about_page_v" ADD COLUMN "published_locale" "enum__about_page_v_published_locale";
  ALTER TABLE "_process_page_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_process_page_v" ADD COLUMN "published_locale" "enum__process_page_v_published_locale";
  ALTER TABLE "_contact_page_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_contact_page_v" ADD COLUMN "published_locale" "enum__contact_page_v_published_locale";
  ALTER TABLE "services_includes_locales" ADD CONSTRAINT "services_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features_locales" ADD CONSTRAINT "services_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_points_tags_locales" ADD CONSTRAINT "services_points_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_points_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_points_locales" ADD CONSTRAINT "services_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_addons_locales" ADD CONSTRAINT "services_addons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_addons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_includes_locales" ADD CONSTRAINT "_services_v_version_includes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_includes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_features_locales" ADD CONSTRAINT "_services_v_version_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_points_tags_locales" ADD CONSTRAINT "_services_v_version_points_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_points_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_points_locales" ADD CONSTRAINT "_services_v_version_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_addons_locales" ADD CONSTRAINT "_services_v_version_addons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_addons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_locales" ADD CONSTRAINT "_services_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_features_locales" ADD CONSTRAINT "projects_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_features_locales" ADD CONSTRAINT "_projects_v_version_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_selling_points_locales" ADD CONSTRAINT "home_page_selling_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_selling_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_selling_points_locales" ADD CONSTRAINT "_home_page_v_version_selling_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_selling_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_locales" ADD CONSTRAINT "_about_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "process_page_steps_locales" ADD CONSTRAINT "process_page_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process_page_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "process_page_locales" ADD CONSTRAINT "process_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."process_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_process_page_v_version_steps_locales" ADD CONSTRAINT "_process_page_v_version_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_process_page_v_version_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_process_page_v_locales" ADD CONSTRAINT "_process_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_process_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_fields_locales" ADD CONSTRAINT "contact_page_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_fields_locales" ADD CONSTRAINT "_contact_page_v_version_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v_version_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_locales" ADD CONSTRAINT "_contact_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_keywords_locales" ADD CONSTRAINT "site_settings_footer_keywords_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_footer_keywords"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "services_includes_locales_locale_parent_id_unique" ON "services_includes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_features_locales_locale_parent_id_unique" ON "services_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_points_tags_locales_locale_parent_id_unique" ON "services_points_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_points_locales_locale_parent_id_unique" ON "services_points_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_addons_locales_locale_parent_id_unique" ON "services_addons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_includes_locales_locale_parent_id_unique" ON "_services_v_version_includes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_features_locales_locale_parent_id_unique" ON "_services_v_version_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_points_tags_locales_locale_parent_id_uni" ON "_services_v_version_points_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_points_locales_locale_parent_id_unique" ON "_services_v_version_points_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_version_addons_locales_locale_parent_id_unique" ON "_services_v_version_addons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_services_v_locales_locale_parent_id_unique" ON "_services_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_features_locales_locale_parent_id_unique" ON "projects_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_features_locales_locale_parent_id_unique" ON "_projects_v_version_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_page_selling_points_locales_locale_parent_id_unique" ON "home_page_selling_points_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_selling_points_locales_locale_parent_id" ON "_home_page_v_version_selling_points_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_about_page_v_locales_locale_parent_id_unique" ON "_about_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "process_page_steps_locales_locale_parent_id_unique" ON "process_page_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "process_page_locales_locale_parent_id_unique" ON "process_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_process_page_v_version_steps_locales_locale_parent_id_uniqu" ON "_process_page_v_version_steps_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_process_page_v_locales_locale_parent_id_unique" ON "_process_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_page_fields_locales_locale_parent_id_unique" ON "contact_page_fields_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_contact_page_v_version_fields_locales_locale_parent_id_uniq" ON "_contact_page_v_version_fields_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_contact_page_v_locales_locale_parent_id_unique" ON "_contact_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_footer_keywords_locales_locale_parent_id_uniqu" ON "site_settings_footer_keywords_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_services_v_snapshot_idx" ON "_services_v" USING btree ("snapshot");
  CREATE INDEX "_services_v_published_locale_idx" ON "_services_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
  CREATE INDEX "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
  CREATE INDEX "_about_page_v_snapshot_idx" ON "_about_page_v" USING btree ("snapshot");
  CREATE INDEX "_about_page_v_published_locale_idx" ON "_about_page_v" USING btree ("published_locale");
  CREATE INDEX "_process_page_v_snapshot_idx" ON "_process_page_v" USING btree ("snapshot");
  CREATE INDEX "_process_page_v_published_locale_idx" ON "_process_page_v" USING btree ("published_locale");
  CREATE INDEX "_contact_page_v_snapshot_idx" ON "_contact_page_v" USING btree ("snapshot");
  CREATE INDEX "_contact_page_v_published_locale_idx" ON "_contact_page_v" USING btree ("published_locale");
  -- Keep existing content: copy every column that becomes localized into its _locales table as Chinese (zh)
  -- before the old column is dropped below.
  INSERT INTO "services_includes_locales" ("item", "_locale", "_parent_id") SELECT "item", 'zh', "id" FROM "services_includes";
  INSERT INTO "services_features_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "services_features";
  INSERT INTO "services_points_tags_locales" ("tag", "_locale", "_parent_id") SELECT "tag", 'zh', "id" FROM "services_points_tags";
  INSERT INTO "services_points_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "services_points";
  INSERT INTO "services_addons_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "services_addons";
  INSERT INTO "services_locales" ("title", "summary", "tagline", "problem", "solution", "_locale", "_parent_id") SELECT "title", "summary", "tagline", "problem", "solution", 'zh', "id" FROM "services";
  INSERT INTO "_services_v_version_includes_locales" ("item", "_locale", "_parent_id") SELECT "item", 'zh', "id" FROM "_services_v_version_includes";
  INSERT INTO "_services_v_version_features_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "_services_v_version_features";
  INSERT INTO "_services_v_version_points_tags_locales" ("tag", "_locale", "_parent_id") SELECT "tag", 'zh', "id" FROM "_services_v_version_points_tags";
  INSERT INTO "_services_v_version_points_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "_services_v_version_points";
  INSERT INTO "_services_v_version_addons_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "_services_v_version_addons";
  INSERT INTO "_services_v_locales" ("version_title", "version_summary", "version_tagline", "version_problem", "version_solution", "_locale", "_parent_id") SELECT "version_title", "version_summary", "version_tagline", "version_problem", "version_solution", 'zh', "id" FROM "_services_v";
  INSERT INTO "projects_features_locales" ("name", "_locale", "_parent_id") SELECT "name", 'zh', "id" FROM "projects_features";
  INSERT INTO "projects_locales" ("title", "site_type", "industry", "summary", "_locale", "_parent_id") SELECT "title", "site_type", "industry", "summary", 'zh', "id" FROM "projects";
  INSERT INTO "_projects_v_version_features_locales" ("name", "_locale", "_parent_id") SELECT "name", 'zh', "id" FROM "_projects_v_version_features";
  INSERT INTO "_projects_v_locales" ("version_title", "version_site_type", "version_industry", "version_summary", "_locale", "_parent_id") SELECT "version_title", "version_site_type", "version_industry", "version_summary", 'zh', "id" FROM "_projects_v";
  INSERT INTO "categories_locales" ("title", "_locale", "_parent_id") SELECT "title", 'zh', "id" FROM "categories" WHERE "title" IS NOT NULL;
  INSERT INTO "faqs_locales" ("question", "answer", "_locale", "_parent_id") SELECT "question", "answer", 'zh', "id" FROM "faqs" WHERE "question" IS NOT NULL AND "answer" IS NOT NULL;
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id") SELECT "alt", 'zh', "id" FROM "media" WHERE "alt" IS NOT NULL;
  INSERT INTO "home_page_selling_points_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "home_page_selling_points";
  INSERT INTO "home_page_locales" ("hero_title", "hero_text", "cta_title", "cta_text", "_locale", "_parent_id") SELECT "hero_title", "hero_text", "cta_title", "cta_text", 'zh', "id" FROM "home_page";
  INSERT INTO "_home_page_v_version_selling_points_locales" ("title", "description", "_locale", "_parent_id") SELECT "title", "description", 'zh', "id" FROM "_home_page_v_version_selling_points";
  INSERT INTO "_home_page_v_locales" ("version_hero_title", "version_hero_text", "version_cta_title", "version_cta_text", "_locale", "_parent_id") SELECT "version_hero_title", "version_hero_text", "version_cta_title", "version_cta_text", 'zh', "id" FROM "_home_page_v";
  INSERT INTO "about_page_locales" ("intro", "why", "story", "_locale", "_parent_id") SELECT "intro", "why", "story", 'zh', "id" FROM "about_page";
  INSERT INTO "_about_page_v_locales" ("version_intro", "version_why", "version_story", "_locale", "_parent_id") SELECT "version_intro", "version_why", "version_story", 'zh', "id" FROM "_about_page_v";
  INSERT INTO "process_page_steps_locales" ("title", "description", "duration", "_locale", "_parent_id") SELECT "title", "description", "duration", 'zh', "id" FROM "process_page_steps";
  INSERT INTO "process_page_locales" ("intro", "_locale", "_parent_id") SELECT "intro", 'zh', "id" FROM "process_page";
  INSERT INTO "_process_page_v_version_steps_locales" ("title", "description", "duration", "_locale", "_parent_id") SELECT "title", "description", "duration", 'zh', "id" FROM "_process_page_v_version_steps";
  INSERT INTO "_process_page_v_locales" ("version_intro", "_locale", "_parent_id") SELECT "version_intro", 'zh', "id" FROM "_process_page_v";
  INSERT INTO "contact_page_fields_locales" ("label", "placeholder", "hint", "options", "empty_option", "_locale", "_parent_id") SELECT "label", "placeholder", "hint", "options", "empty_option", 'zh', "id" FROM "contact_page_fields";
  INSERT INTO "contact_page_locales" ("hero_title", "hero_lead", "channels_title", "line_note", "email_note", "instagram_note", "form_title", "contact_hint", "require_contact_message", "submit_label", "success_title", "success_text", "error_text", "_locale", "_parent_id") SELECT "hero_title", "hero_lead", "channels_title", "line_note", "email_note", "instagram_note", "form_title", "contact_hint", "require_contact_message", "submit_label", "success_title", "success_text", "error_text", 'zh', "id" FROM "contact_page";
  INSERT INTO "_contact_page_v_version_fields_locales" ("label", "placeholder", "hint", "options", "empty_option", "_locale", "_parent_id") SELECT "label", "placeholder", "hint", "options", "empty_option", 'zh', "id" FROM "_contact_page_v_version_fields";
  INSERT INTO "_contact_page_v_locales" ("version_hero_title", "version_hero_lead", "version_channels_title", "version_line_note", "version_email_note", "version_instagram_note", "version_form_title", "version_contact_hint", "version_require_contact_message", "version_submit_label", "version_success_title", "version_success_text", "version_error_text", "_locale", "_parent_id") SELECT "version_hero_title", "version_hero_lead", "version_channels_title", "version_line_note", "version_email_note", "version_instagram_note", "version_form_title", "version_contact_hint", "version_require_contact_message", "version_submit_label", "version_success_title", "version_success_text", "version_error_text", 'zh', "id" FROM "_contact_page_v";
  INSERT INTO "site_settings_footer_keywords_locales" ("label", "_locale", "_parent_id") SELECT "label", 'zh', "id" FROM "site_settings_footer_keywords" WHERE "label" IS NOT NULL;
  INSERT INTO "site_settings_locales" ("service_area", "footer_blurb", "cta_title", "cta_text", "cta_button", "payment_note", "seo_title", "seo_description", "_locale", "_parent_id") SELECT "service_area", "footer_blurb", "cta_title", "cta_text", "cta_button", "payment_note", "seo_title", "seo_description", 'zh', "id" FROM "site_settings";

  ALTER TABLE "services_includes" DROP COLUMN "item";
  ALTER TABLE "services_features" DROP COLUMN "title";
  ALTER TABLE "services_features" DROP COLUMN "description";
  ALTER TABLE "services_points_tags" DROP COLUMN "tag";
  ALTER TABLE "services_points" DROP COLUMN "title";
  ALTER TABLE "services_points" DROP COLUMN "description";
  ALTER TABLE "services_addons" DROP COLUMN "title";
  ALTER TABLE "services_addons" DROP COLUMN "description";
  ALTER TABLE "services" DROP COLUMN "title";
  ALTER TABLE "services" DROP COLUMN "summary";
  ALTER TABLE "services" DROP COLUMN "tagline";
  ALTER TABLE "services" DROP COLUMN "problem";
  ALTER TABLE "services" DROP COLUMN "solution";
  ALTER TABLE "_services_v_version_includes" DROP COLUMN "item";
  ALTER TABLE "_services_v_version_features" DROP COLUMN "title";
  ALTER TABLE "_services_v_version_features" DROP COLUMN "description";
  ALTER TABLE "_services_v_version_points_tags" DROP COLUMN "tag";
  ALTER TABLE "_services_v_version_points" DROP COLUMN "title";
  ALTER TABLE "_services_v_version_points" DROP COLUMN "description";
  ALTER TABLE "_services_v_version_addons" DROP COLUMN "title";
  ALTER TABLE "_services_v_version_addons" DROP COLUMN "description";
  ALTER TABLE "_services_v" DROP COLUMN "version_title";
  ALTER TABLE "_services_v" DROP COLUMN "version_summary";
  ALTER TABLE "_services_v" DROP COLUMN "version_tagline";
  ALTER TABLE "_services_v" DROP COLUMN "version_problem";
  ALTER TABLE "_services_v" DROP COLUMN "version_solution";
  ALTER TABLE "projects_features" DROP COLUMN "name";
  ALTER TABLE "projects" DROP COLUMN "title";
  ALTER TABLE "projects" DROP COLUMN "site_type";
  ALTER TABLE "projects" DROP COLUMN "industry";
  ALTER TABLE "projects" DROP COLUMN "summary";
  ALTER TABLE "_projects_v_version_features" DROP COLUMN "name";
  ALTER TABLE "_projects_v" DROP COLUMN "version_title";
  ALTER TABLE "_projects_v" DROP COLUMN "version_site_type";
  ALTER TABLE "_projects_v" DROP COLUMN "version_industry";
  ALTER TABLE "_projects_v" DROP COLUMN "version_summary";
  ALTER TABLE "categories" DROP COLUMN "title";
  ALTER TABLE "faqs" DROP COLUMN "question";
  ALTER TABLE "faqs" DROP COLUMN "answer";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "home_page_selling_points" DROP COLUMN "title";
  ALTER TABLE "home_page_selling_points" DROP COLUMN "description";
  ALTER TABLE "home_page" DROP COLUMN "hero_title";
  ALTER TABLE "home_page" DROP COLUMN "hero_text";
  ALTER TABLE "home_page" DROP COLUMN "cta_title";
  ALTER TABLE "home_page" DROP COLUMN "cta_text";
  ALTER TABLE "_home_page_v_version_selling_points" DROP COLUMN "title";
  ALTER TABLE "_home_page_v_version_selling_points" DROP COLUMN "description";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_title";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_text";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_cta_title";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_cta_text";
  ALTER TABLE "about_page" DROP COLUMN "intro";
  ALTER TABLE "about_page" DROP COLUMN "why";
  ALTER TABLE "about_page" DROP COLUMN "story";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_intro";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_why";
  ALTER TABLE "_about_page_v" DROP COLUMN "version_story";
  ALTER TABLE "process_page_steps" DROP COLUMN "title";
  ALTER TABLE "process_page_steps" DROP COLUMN "description";
  ALTER TABLE "process_page_steps" DROP COLUMN "duration";
  ALTER TABLE "process_page" DROP COLUMN "intro";
  ALTER TABLE "_process_page_v_version_steps" DROP COLUMN "title";
  ALTER TABLE "_process_page_v_version_steps" DROP COLUMN "description";
  ALTER TABLE "_process_page_v_version_steps" DROP COLUMN "duration";
  ALTER TABLE "_process_page_v" DROP COLUMN "version_intro";
  ALTER TABLE "contact_page_fields" DROP COLUMN "label";
  ALTER TABLE "contact_page_fields" DROP COLUMN "placeholder";
  ALTER TABLE "contact_page_fields" DROP COLUMN "hint";
  ALTER TABLE "contact_page_fields" DROP COLUMN "options";
  ALTER TABLE "contact_page_fields" DROP COLUMN "empty_option";
  ALTER TABLE "contact_page" DROP COLUMN "hero_title";
  ALTER TABLE "contact_page" DROP COLUMN "hero_lead";
  ALTER TABLE "contact_page" DROP COLUMN "channels_title";
  ALTER TABLE "contact_page" DROP COLUMN "line_note";
  ALTER TABLE "contact_page" DROP COLUMN "email_note";
  ALTER TABLE "contact_page" DROP COLUMN "instagram_note";
  ALTER TABLE "contact_page" DROP COLUMN "form_title";
  ALTER TABLE "contact_page" DROP COLUMN "contact_hint";
  ALTER TABLE "contact_page" DROP COLUMN "require_contact_message";
  ALTER TABLE "contact_page" DROP COLUMN "submit_label";
  ALTER TABLE "contact_page" DROP COLUMN "success_title";
  ALTER TABLE "contact_page" DROP COLUMN "success_text";
  ALTER TABLE "contact_page" DROP COLUMN "error_text";
  ALTER TABLE "_contact_page_v_version_fields" DROP COLUMN "label";
  ALTER TABLE "_contact_page_v_version_fields" DROP COLUMN "placeholder";
  ALTER TABLE "_contact_page_v_version_fields" DROP COLUMN "hint";
  ALTER TABLE "_contact_page_v_version_fields" DROP COLUMN "options";
  ALTER TABLE "_contact_page_v_version_fields" DROP COLUMN "empty_option";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_hero_title";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_hero_lead";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_channels_title";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_line_note";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_email_note";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_instagram_note";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_form_title";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_contact_hint";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_require_contact_message";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_submit_label";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_success_title";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_success_text";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_error_text";
  ALTER TABLE "site_settings_footer_keywords" DROP COLUMN "label";
  ALTER TABLE "site_settings" DROP COLUMN "service_area";
  ALTER TABLE "site_settings" DROP COLUMN "footer_blurb";
  ALTER TABLE "site_settings" DROP COLUMN "cta_title";
  ALTER TABLE "site_settings" DROP COLUMN "cta_text";
  ALTER TABLE "site_settings" DROP COLUMN "cta_button";
  ALTER TABLE "site_settings" DROP COLUMN "payment_note";
  ALTER TABLE "site_settings" DROP COLUMN "seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "seo_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_includes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_points_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_addons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_includes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_points_tags_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_addons_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_selling_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_selling_points_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "process_page_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "process_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_process_page_v_version_steps_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_process_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_fields_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_version_fields_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contact_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_footer_keywords_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_includes_locales" CASCADE;
  DROP TABLE "services_features_locales" CASCADE;
  DROP TABLE "services_points_tags_locales" CASCADE;
  DROP TABLE "services_points_locales" CASCADE;
  DROP TABLE "services_addons_locales" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "_services_v_version_includes_locales" CASCADE;
  DROP TABLE "_services_v_version_features_locales" CASCADE;
  DROP TABLE "_services_v_version_points_tags_locales" CASCADE;
  DROP TABLE "_services_v_version_points_locales" CASCADE;
  DROP TABLE "_services_v_version_addons_locales" CASCADE;
  DROP TABLE "_services_v_locales" CASCADE;
  DROP TABLE "projects_features_locales" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "_projects_v_version_features_locales" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "home_page_selling_points_locales" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "_home_page_v_version_selling_points_locales" CASCADE;
  DROP TABLE "_home_page_v_locales" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "_about_page_v_locales" CASCADE;
  DROP TABLE "process_page_steps_locales" CASCADE;
  DROP TABLE "process_page_locales" CASCADE;
  DROP TABLE "_process_page_v_version_steps_locales" CASCADE;
  DROP TABLE "_process_page_v_locales" CASCADE;
  DROP TABLE "contact_page_fields_locales" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "_contact_page_v_version_fields_locales" CASCADE;
  DROP TABLE "_contact_page_v_locales" CASCADE;
  DROP TABLE "site_settings_footer_keywords_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP INDEX "_services_v_snapshot_idx";
  DROP INDEX "_services_v_published_locale_idx";
  DROP INDEX "_projects_v_snapshot_idx";
  DROP INDEX "_projects_v_published_locale_idx";
  DROP INDEX "_home_page_v_snapshot_idx";
  DROP INDEX "_home_page_v_published_locale_idx";
  DROP INDEX "_about_page_v_snapshot_idx";
  DROP INDEX "_about_page_v_published_locale_idx";
  DROP INDEX "_process_page_v_snapshot_idx";
  DROP INDEX "_process_page_v_published_locale_idx";
  DROP INDEX "_contact_page_v_snapshot_idx";
  DROP INDEX "_contact_page_v_published_locale_idx";
  ALTER TABLE "services_includes" ADD COLUMN "item" varchar;
  ALTER TABLE "services_features" ADD COLUMN "title" varchar;
  ALTER TABLE "services_features" ADD COLUMN "description" varchar;
  ALTER TABLE "services_points_tags" ADD COLUMN "tag" varchar;
  ALTER TABLE "services_points" ADD COLUMN "title" varchar;
  ALTER TABLE "services_points" ADD COLUMN "description" varchar;
  ALTER TABLE "services_addons" ADD COLUMN "title" varchar;
  ALTER TABLE "services_addons" ADD COLUMN "description" varchar;
  ALTER TABLE "services" ADD COLUMN "title" varchar;
  ALTER TABLE "services" ADD COLUMN "summary" varchar;
  ALTER TABLE "services" ADD COLUMN "tagline" varchar;
  ALTER TABLE "services" ADD COLUMN "problem" varchar;
  ALTER TABLE "services" ADD COLUMN "solution" varchar;
  ALTER TABLE "_services_v_version_includes" ADD COLUMN "item" varchar;
  ALTER TABLE "_services_v_version_features" ADD COLUMN "title" varchar;
  ALTER TABLE "_services_v_version_features" ADD COLUMN "description" varchar;
  ALTER TABLE "_services_v_version_points_tags" ADD COLUMN "tag" varchar;
  ALTER TABLE "_services_v_version_points" ADD COLUMN "title" varchar;
  ALTER TABLE "_services_v_version_points" ADD COLUMN "description" varchar;
  ALTER TABLE "_services_v_version_addons" ADD COLUMN "title" varchar;
  ALTER TABLE "_services_v_version_addons" ADD COLUMN "description" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_tagline" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_problem" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_solution" varchar;
  ALTER TABLE "projects_features" ADD COLUMN "name" varchar;
  ALTER TABLE "projects" ADD COLUMN "title" varchar;
  ALTER TABLE "projects" ADD COLUMN "site_type" varchar;
  ALTER TABLE "projects" ADD COLUMN "industry" varchar;
  ALTER TABLE "projects" ADD COLUMN "summary" varchar;
  ALTER TABLE "_projects_v_version_features" ADD COLUMN "name" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_site_type" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_industry" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "categories" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "faqs" ADD COLUMN "question" varchar NOT NULL;
  ALTER TABLE "faqs" ADD COLUMN "answer" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "home_page_selling_points" ADD COLUMN "title" varchar;
  ALTER TABLE "home_page_selling_points" ADD COLUMN "description" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_text" varchar;
  ALTER TABLE "home_page" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "_home_page_v_version_selling_points" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_page_v_version_selling_points" ADD COLUMN "description" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_title" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_text" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_cta_title" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_cta_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "intro" varchar;
  ALTER TABLE "about_page" ADD COLUMN "why" varchar;
  ALTER TABLE "about_page" ADD COLUMN "story" varchar;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_intro" varchar;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_why" varchar;
  ALTER TABLE "_about_page_v" ADD COLUMN "version_story" varchar;
  ALTER TABLE "process_page_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "process_page_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "process_page_steps" ADD COLUMN "duration" varchar;
  ALTER TABLE "process_page" ADD COLUMN "intro" varchar;
  ALTER TABLE "_process_page_v_version_steps" ADD COLUMN "title" varchar;
  ALTER TABLE "_process_page_v_version_steps" ADD COLUMN "description" varchar;
  ALTER TABLE "_process_page_v_version_steps" ADD COLUMN "duration" varchar;
  ALTER TABLE "_process_page_v" ADD COLUMN "version_intro" varchar;
  ALTER TABLE "contact_page_fields" ADD COLUMN "label" varchar;
  ALTER TABLE "contact_page_fields" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "contact_page_fields" ADD COLUMN "hint" varchar;
  ALTER TABLE "contact_page_fields" ADD COLUMN "options" varchar;
  ALTER TABLE "contact_page_fields" ADD COLUMN "empty_option" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "hero_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "hero_lead" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "channels_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "line_note" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "email_note" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "instagram_note" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "form_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "contact_hint" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "require_contact_message" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "success_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "success_text" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "error_text" varchar;
  ALTER TABLE "_contact_page_v_version_fields" ADD COLUMN "label" varchar;
  ALTER TABLE "_contact_page_v_version_fields" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "_contact_page_v_version_fields" ADD COLUMN "hint" varchar;
  ALTER TABLE "_contact_page_v_version_fields" ADD COLUMN "options" varchar;
  ALTER TABLE "_contact_page_v_version_fields" ADD COLUMN "empty_option" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_hero_title" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_hero_lead" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_channels_title" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_line_note" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_email_note" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_instagram_note" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_form_title" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_contact_hint" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_require_contact_message" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_submit_label" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_success_title" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_success_text" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_error_text" varchar;
  ALTER TABLE "site_settings_footer_keywords" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "service_area" varchar DEFAULT '全台線上服務';
  ALTER TABLE "site_settings" ADD COLUMN "footer_blurb" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "cta_button" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "payment_note" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "_services_v" DROP COLUMN "snapshot";
  ALTER TABLE "_services_v" DROP COLUMN "published_locale";
  ALTER TABLE "_projects_v" DROP COLUMN "snapshot";
  ALTER TABLE "_projects_v" DROP COLUMN "published_locale";
  ALTER TABLE "_home_page_v" DROP COLUMN "snapshot";
  ALTER TABLE "_home_page_v" DROP COLUMN "published_locale";
  ALTER TABLE "_about_page_v" DROP COLUMN "snapshot";
  ALTER TABLE "_about_page_v" DROP COLUMN "published_locale";
  ALTER TABLE "_process_page_v" DROP COLUMN "snapshot";
  ALTER TABLE "_process_page_v" DROP COLUMN "published_locale";
  ALTER TABLE "_contact_page_v" DROP COLUMN "snapshot";
  ALTER TABLE "_contact_page_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__services_v_published_locale";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum__home_page_v_published_locale";
  DROP TYPE "public"."enum__about_page_v_published_locale";
  DROP TYPE "public"."enum__process_page_v_published_locale";
  DROP TYPE "public"."enum__contact_page_v_published_locale";`)
}
