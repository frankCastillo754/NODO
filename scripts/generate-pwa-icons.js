/**
 * Genera iconos PWA placeholder (192x192 y 512x512) en public/icons/.
 * Requiere: npm install sharp --save-dev
 * Ejecutar: node scripts/generate-pwa-icons.js
 */

const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'public', 'icons')
const ACCENT_COLOR = '#19e694' // palette.accent.DEFAULT (ChainSight green)

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('Instala sharp como devDependency: npm install sharp --save-dev')
    process.exit(1)
  }

  const sizes = [192, 512]
  const hex = ACCENT_COLOR.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  for (const size of sizes) {
    const buffer = await sharp({
      create: {
        width: size,
        height: size,
        channels: 3,
        background: { r, g, b },
      },
    })
      .png()
      .toBuffer()

    const outPath = path.join(OUT_DIR, `icon-${size}x${size}.png`)
    fs.writeFileSync(outPath, buffer)
    console.log('Escrito:', outPath)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
