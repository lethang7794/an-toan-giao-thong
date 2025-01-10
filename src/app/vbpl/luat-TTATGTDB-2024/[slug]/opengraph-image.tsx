import { ImageResponse } from 'next/og'

import { vbplSectionExplain } from '@/lib/vbpl-explain-section'
import {
  nd168SectionExplainDetail,
  nd168SectionExplainComponents,
} from '@/lib/nd-168-section-explain-detail'
import { env } from '@/env.mjs'
import { Nd168SectionPreview } from './nd-168-section-preview'

export const size = {
  width: 1200,
  height: 630,
}
export const alt = `Nghị định 168/2024 | ${env.NEXT_PUBLIC_BRAND}`
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = decodeURI(params.slug)
  const explain = vbplSectionExplain(slug || '').path
  const { short1, short2, short3, detail1, detail2, detail3, highlight } =
    await nd168SectionExplainComponents(slug)

  return new ImageResponse(
    <Nd168SectionPreview
      short1={short1}
      short2={short2}
      short3={short3}
      detail1={detail1}
      detail2={detail2}
      detail3={detail3}
      highlight={highlight}
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}