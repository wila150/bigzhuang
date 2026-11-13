// Upload every media file the database references (original + resized versions) from ./media to the S3 bucket
// in .env.production.local. Production names may carry a "-1" suffix that the local copies lack.
// Usage: node scripts/restore-media-to-r2.mjs [--dry]
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

const dry = process.argv.includes('--dry')
const dir = path.resolve('media')
const local = new Set(fs.readdirSync(dir))

// "bluedot-studio-cover-1-480x300.png" -> also try "bluedot-studio-cover-480x300.png"
const candidates = (name) => [name, name.replace(/-1(-\d+x\d+)?(\.\w+)$/, '$1$2')]

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
})
const exists = (Key) =>
  s3.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key })).then(() => true, () => false)

const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
await db.connect()
const { rows } = await db.query(
  'select id, filename, sizes_thumb_filename, sizes_card_filename, sizes_large_filename from media order by id',
)
await db.end()

const missing = []
let uploaded = 0
for (const row of rows) {
  for (const key of [row.filename, row.sizes_thumb_filename, row.sizes_card_filename, row.sizes_large_filename]) {
    if (!key) continue
    const src = candidates(key).find((c) => local.has(c))
    if (!src) { missing.push(`${row.id} ${key}`); continue }
    if (dry) { console.log('would upload', key, '<-', src); continue }
    if (await exists(key)) continue
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET, Key: key, Body: fs.readFileSync(path.join(dir, src)), ContentType: 'image/png',
    }))
    uploaded++
    console.log('uploaded', key)
  }
}
console.log(`\n${uploaded} uploaded, ${missing.length} missing locally:`)
for (const m of missing) console.log('  ', m)
