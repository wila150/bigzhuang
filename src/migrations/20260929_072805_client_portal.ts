import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_clients_bills_payment_method" AS ENUM('card', 'transfer', 'other');
  ALTER TABLE "clients_bills" ALTER COLUMN "amount" SET NOT NULL;
  ALTER TABLE "clients_bills" ADD COLUMN "due_date" timestamp(3) with time zone;
  ALTER TABLE "clients_bills" ADD COLUMN "payment_method" "enum_clients_bills_payment_method";
  ALTER TABLE "clients_bills" ADD COLUMN "paid_at" timestamp(3) with time zone;
  ALTER TABLE "clients_bills" ADD COLUMN "trade_no" varchar;
  ALTER TABLE "clients" ADD COLUMN "email" varchar NOT NULL;
  ALTER TABLE "clients" ADD COLUMN "sub" varchar;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "bank_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "bank_code" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "bank_account" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "bank_account_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "payment_note" varchar;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clients_bills_trade_no_idx" ON "clients_bills" USING btree ("trade_no");
  CREATE UNIQUE INDEX "clients_email_idx" ON "clients" USING btree ("email");
  CREATE INDEX "clients_sub_idx" ON "clients" USING btree ("sub");
  CREATE INDEX "payload_preferences_rels_clients_id_idx" ON "payload_preferences_rels" USING btree ("clients_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_clients_fk";
  
  DROP INDEX "clients_bills_trade_no_idx";
  DROP INDEX "clients_email_idx";
  DROP INDEX "clients_sub_idx";
  DROP INDEX "payload_preferences_rels_clients_id_idx";
  ALTER TABLE "clients_bills" ALTER COLUMN "amount" DROP NOT NULL;
  ALTER TABLE "clients_bills" DROP COLUMN "due_date";
  ALTER TABLE "clients_bills" DROP COLUMN "payment_method";
  ALTER TABLE "clients_bills" DROP COLUMN "paid_at";
  ALTER TABLE "clients_bills" DROP COLUMN "trade_no";
  ALTER TABLE "clients" DROP COLUMN "email";
  ALTER TABLE "clients" DROP COLUMN "sub";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "clients_id";
  ALTER TABLE "site_settings" DROP COLUMN "bank_name";
  ALTER TABLE "site_settings" DROP COLUMN "bank_code";
  ALTER TABLE "site_settings" DROP COLUMN "bank_account";
  ALTER TABLE "site_settings" DROP COLUMN "bank_account_name";
  ALTER TABLE "site_settings" DROP COLUMN "payment_note";
  DROP TYPE "public"."enum_clients_bills_payment_method";`)
}
