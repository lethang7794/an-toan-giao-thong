'use client'

import { useToast } from '@/hooks/use-toast'
import type { ReactNode } from 'react'

type Props = {
  id: string
  children: ReactNode
}

export default function AnchorLink({ id, children }: Props) {
  const { toast } = useToast()

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span
      id={`${id}`}
      onClick={(e) => {
        e.preventDefault()
        const shareLink = getShareLinkFromId(id)
        copyLinkToClipboard(shareLink)
        toast({
          title: `📋 Đã sao chép: ${explainShareLink(id)}`,
          description: `${shareLink}`,
        })
      }}
      className="inline-block min-w-8 text-center border-solid hover:border-dotted border-2 border-sky-500 px-2 rounded-md"
    >
      {children}
    </span>
  )
}

function getShareLinkFromId(id: string) {
  const cleanedHref = window?.location.href.split(/[?#]/)[0]
  const cleanedHrefWithFragment = `${cleanedHref}#${id}`
  return cleanedHrefWithFragment
}

function copyLinkToClipboard(link: string) {
  navigator.clipboard.writeText(link)
}

function explainShareLink(id: string): string {
  if (id.match(/^(I|II|III|IV)$/)) {
    return `Chương ${id}`
  }
  if (id.match(/^(I|II|III|IV)\.(\d+)$/)) {
    const [chuong, muc] = id.split('.')
    return `Chương ${chuong}, mục ${muc}`
  }
  if (id.match(/^\d+$/)) {
    return `Điều ${id}`
  }
  if (id.match(/^\d+.\d+$/)) {
    const [dieu, khoan] = id.split('.')
    return `khoản ${khoan}, điều ${dieu}`
  }
  if (id.match(/^\d+.\d+.\w$/)) {
    const [dieu, khoan, diem] = id.split('.')
    return `điểm ${diem}, khoản ${khoan}, điều ${dieu}`
  }
  return ''
}
