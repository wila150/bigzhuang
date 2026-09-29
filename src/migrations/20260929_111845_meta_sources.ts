import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_inquiries_source" ADD VALUE 'facebook';
  ALTER TYPE "public"."enum_inquiries_source" ADD VALUE 'instagram';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "inquiries" ALTER COLUMN "source" SET DEFAULT 'web'::text;
  DROP TYPE "public"."enum_inquiries_source";
  CREATE TYPE "public"."enum_inquiries_source" AS ENUM('web', 'line');
  ALTER TABLE "inquiries" ALTER COLUMN "source" SET DEFAULT 'web'::"public"."enum_inquiries_source";
  ALTER TABLE "inquiries" ALTER COLUMN "source" SET DATA TYPE "public"."enum_inquiries_source" USING "source"::"public"."enum_inquiries_source";`)
}
