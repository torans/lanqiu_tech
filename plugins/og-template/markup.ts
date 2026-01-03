import { readFileSync } from 'node:fs'
import { html } from 'satori-html'
import backgroundBase64 from './base64'
import type { BgType } from '../../src/types'

const avatar = readFileSync('public/images/avatar.jpg').toString('base64')
const avatarSrc = `data:image/jpeg;base64,${avatar}`

export const ogImageMarkup = (
  authorOrBrand: string,
  title: string,
  bgType: BgType
) => {
  if (!['plum', 'dot', 'rose', 'particle'].includes(bgType))
    throw new Error(
      "The value of 'bgType' must be one of the following: 'plum', 'dot', 'rose', 'particle'."
    )

  return html`<div
    tw="relative flex justify-center items-center w-full h-full"
    style="font-family: 'LXGW'"
  >
    <img
      tw="absolute inset-0 w-full h-full"
      src=${backgroundBase64[bgType]}
      alt="兰秋十六"
    />

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
}
