import type { MDXComponents } from 'mdx/types'

import { DocumentHeading } from '@/components/mdx/document-heading'
import { DocumentEnding } from '@/components/mdx/document-ending'
import { CollapsibleSection } from '@/components/block/collapsible'

import A from '@/components/block/anchor-link'
import AA from '@/components/block/anchor-link-luat-gt-2024'
import NghiDinh168MindMap from '@/app/markmap/nghi-dinh-168-2024/page'
import RemarkTOCEffect from '@/components/effect/remark-toc'
import RemarkTOCEffectLuatGT2024 from '@/components/effect/remark-toc-luat-gt-2024'
import NghiDinh168HDSD from '@/app/vbpl/nghi-dinh-168-2024/hdsd'
import LuatGT2024MindMap from '@/app/markmap/luat-TTATGTDB-2024/page'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    DocumentHeading,
    DocumentEnding,
    CollapsibleSection,
    A,
    AA,
    RemarkTOCEffect,
    RemarkTOCEffectLuatGT2024,
    NghiDinh168MindMap,
    NghiDinh168HDSD,
    LuatGT2024MindMap,
    ...components,
  }
}
