import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// 20261003_050510_site_monitor was generated without S3 enabled and dropped this column in production.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Nothing to undo: the column belongs to the S3 storage plugin and must stay.
}
