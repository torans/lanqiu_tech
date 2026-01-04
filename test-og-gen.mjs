import { readFileSync, writeFileSync } from 'node:fs'
import satori from 'satori'
import sharp from 'sharp'
import { html } from 'satori-html'

// Load fonts
const LXGW = readFileSync('plugins/og-template/lxgw.ttf')
const avatar = readFileSync('public/images/avatar.jpg').toString('base64')
const avatarSrc = `data:image/jpeg;base64,${avatar}`

// Test title with Chinese characters
const title = '🚀 微信公众号 AI 自动化 Skills！提效狂魔的终极进化指南'
const authorOrBrand = '兰秋AI'

const markup = html`<div
  tw="relative flex justify-center items-center w-full h-full"
  style="font-family: 'LXGW'"
>
  <div tw="flex items-center justify-start w-full px-18" style="gap: 20px">
    <div tw="self-start flex justify-center items-center">
      <img src=${avatarSrc} width="120" height="120" tw="rounded-full" />
    </div>

    <div tw="flex flex-col" style="gap: 10px">
      <div tw="text-[#858585] text-2.1rem">${authorOrBrand}</div>
      <div tw="text-white text-3.1rem leading-relaxed mr-18">${title}</div>
    </div>
  </div>
</div>`

const satoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: 'LXGW',
      weight: 400,
      style: 'normal',
      data: LXGW,
    },
  ],
}

console.log('Generating OG image...')
console.log('Title:', title)
console.log('Font size:', LXGW.length, 'bytes')

try {
  const svg = await satori(markup, satoriOptions)
  console.log('SVG generated successfully')

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({
      compressionLevel: 9,
      quality: 100,
    })
    .toBuffer()

  writeFileSync('test-og-output.png', pngBuffer)
  console.log('✅ PNG saved to test-og-output.png')
} catch (error) {
  console.error('❌ Error:', error)
}
