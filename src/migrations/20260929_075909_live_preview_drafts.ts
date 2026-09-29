import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_process_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__process_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_services_v_version_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_points_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_addons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_tagline" varchar,
  	"version_problem" varchar,
  	"version_solution" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_projects_v_version_tech" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_category_id" integer,
  	"version_site_type" varchar,
  	"version_industry" varchar,
  	"version_url" varchar,
  	"version_year" numeric,
  	"version_summary" varchar,
  	"version_cover_id" integer,
  	"version_mobile_shot_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_published" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_home_page_v_version_selling_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title" varchar,
  	"version_hero_text" varchar,
  	"version_hero_image_id" integer,
  	"version_cta_title" varchar,
  	"version_cta_text" varchar,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_about_page_v_version_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_photo_id" integer,
  	"version_intro" varchar,
  	"version_why" varchar,
  	"version_story" varchar,
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_process_page_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_process_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_intro" varchar,
  	"version__status" "enum__process_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "services_includes" ALTER COLUMN "item" DROP NOT NULL;
  ALTER TABLE "services_features" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "services_points_tags" ALTER COLUMN "tag" DROP NOT NULL;
  ALTER TABLE "services_points" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "services_addons" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "summary" DROP NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "projects_tech" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "projects_features" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "projects_gallery" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "home_page_selling_points" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "home_page" ALTER COLUMN "hero_title" DROP NOT NULL;
  ALTER TABLE "about_page_skills" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "process_page_steps" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "services" ADD COLUMN "_status" "enum_services_status" DEFAULT 'draft';
  ALTER TABLE "projects" ADD COLUMN "_status" "enum_projects_status" DEFAULT 'draft';
  ALTER TABLE "home_page" ADD COLUMN "_status" "enum_home_page_status" DEFAULT 'draft';
  ALTER TABLE "about_page" ADD COLUMN "_status" "enum_about_page_status" DEFAULT 'draft';
  ALTER TABLE "process_page" ADD COLUMN "_status" "enum_process_page_status" DEFAULT 'draft';
  -- Everything that existed before drafts were enabled is already live: keep it published.
  UPDATE "services" SET "_status" = 'published';
  UPDATE "projects" SET "_status" = 'published';
  UPDATE "home_page" SET "_status" = 'published';
  UPDATE "about_page" SET "_status" = 'published';
  UPDATE "process_page" SET "_status" = 'published';
  ALTER TABLE "_services_v_version_includes" ADD CONSTRAINT "_services_v_version_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_features" ADD CONSTRAINT "_services_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_points_tags" ADD CONSTRAINT "_services_v_version_points_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_version_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_points" ADD CONSTRAINT "_services_v_version_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_addons" ADD CONSTRAINT "_services_v_version_addons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tech" ADD CONSTRAINT "_projects_v_version_tech_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_features" ADD CONSTRAINT "_projects_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_mobile_shot_id_media_id_fk" FOREIGN KEY ("version_mobile_shot_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_selling_points" ADD CONSTRAINT "_home_page_v_version_selling_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_skills" ADD CONSTRAINT "_about_page_v_version_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_process_page_v_version_steps" ADD CONSTRAINT "_process_page_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_process_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_services_v_version_includes_order_idx" ON "_services_v_version_includes" USING btree ("_order");
  CREATE INDEX "_services_v_version_includes_parent_id_idx" ON "_services_v_version_includes" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_features_order_idx" ON "_services_v_version_features" USING btree ("_order");
  CREATE INDEX "_services_v_version_features_parent_id_idx" ON "_services_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_points_tags_order_idx" ON "_services_v_version_points_tags" USING btree ("_order");
  CREATE INDEX "_services_v_version_points_tags_parent_id_idx" ON "_services_v_version_points_tags" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_points_order_idx" ON "_services_v_version_points" USING btree ("_order");
  CREATE INDEX "_services_v_version_points_parent_id_idx" ON "_services_v_version_points" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_addons_order_idx" ON "_services_v_version_addons" USING btree ("_order");
  CREATE INDEX "_services_v_version_addons_parent_id_idx" ON "_services_v_version_addons" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_cover_idx" ON "_services_v" USING btree ("version_cover_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_categories_id_idx" ON "_services_v_rels" USING btree ("categories_id");
  CREATE INDEX "_projects_v_version_tech_order_idx" ON "_projects_v_version_tech" USING btree ("_order");
  CREATE INDEX "_projects_v_version_tech_parent_id_idx" ON "_projects_v_version_tech" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_features_order_idx" ON "_projects_v_version_features" USING btree ("_order");
  CREATE INDEX "_projects_v_version_features_parent_id_idx" ON "_projects_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_category_idx" ON "_projects_v" USING btree ("version_category_id");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_mobile_shot_idx" ON "_projects_v" USING btree ("version_mobile_shot_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE INDEX "_home_page_v_version_selling_points_order_idx" ON "_home_page_v_version_selling_points" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_selling_points_parent_id_idx" ON "_home_page_v_version_selling_points" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_version_hero_image_idx" ON "_home_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_autosave_idx" ON "_home_page_v" USING btree ("autosave");
  CREATE INDEX "_about_page_v_version_skills_order_idx" ON "_about_page_v_version_skills" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_skills_parent_id_idx" ON "_about_page_v_version_skills" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_version_photo_idx" ON "_about_page_v" USING btree ("version_photo_id");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE INDEX "_about_page_v_autosave_idx" ON "_about_page_v" USING btree ("autosave");
  CREATE INDEX "_process_page_v_version_steps_order_idx" ON "_process_page_v_version_steps" USING btree ("_order");
  CREATE INDEX "_process_page_v_version_steps_parent_id_idx" ON "_process_page_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_process_page_v_version_version__status_idx" ON "_process_page_v" USING btree ("version__status");
  CREATE INDEX "_process_page_v_created_at_idx" ON "_process_page_v" USING btree ("created_at");
  CREATE INDEX "_process_page_v_updated_at_idx" ON "_process_page_v" USING btree ("updated_at");
  CREATE INDEX "_process_page_v_latest_idx" ON "_process_page_v" USING btree ("latest");
  CREATE INDEX "_process_page_v_autosave_idx" ON "_process_page_v" USING btree ("autosave");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE INDEX "process_page__status_idx" ON "process_page" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_services_v_version_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_points_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_addons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_tech" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_selling_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v_version_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_process_page_v_version_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_process_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_services_v_version_includes" CASCADE;
  DROP TABLE "_services_v_version_features" CASCADE;
  DROP TABLE "_services_v_version_points_tags" CASCADE;
  DROP TABLE "_services_v_version_points" CASCADE;
  DROP TABLE "_services_v_version_addons" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "_projects_v_version_tech" CASCADE;
  DROP TABLE "_projects_v_version_features" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_home_page_v_version_selling_points" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_about_page_v_version_skills" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "_process_page_v_version_steps" CASCADE;
  DROP TABLE "_process_page_v" CASCADE;
  DROP INDEX "services__status_idx";
  DROP INDEX "projects__status_idx";
  DROP INDEX "home_page__status_idx";
  DROP INDEX "about_page__status_idx";
  DROP INDEX "process_page__status_idx";
  ALTER TABLE "services_includes" ALTER COLUMN "item" SET NOT NULL;
  ALTER TABLE "services_features" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "services_points_tags" ALTER COLUMN "tag" SET NOT NULL;
  ALTER TABLE "services_points" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "services_addons" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "summary" SET NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "projects_tech" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "projects_features" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "projects_gallery" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "home_page_selling_points" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "home_page" ALTER COLUMN "hero_title" SET NOT NULL;
  ALTER TABLE "about_page_skills" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "process_page_steps" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "services" DROP COLUMN "_status";
  ALTER TABLE "projects" DROP COLUMN "_status";
  ALTER TABLE "home_page" DROP COLUMN "_status";
  ALTER TABLE "about_page" DROP COLUMN "_status";
  ALTER TABLE "process_page" DROP COLUMN "_status";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum_process_page_status";
  DROP TYPE "public"."enum__process_page_v_version_status";`)
}
