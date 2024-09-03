'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { loadCSS, loadJS, Markmap } from 'markmap-view'
import { Toolbar } from 'markmap-toolbar'
import { Transformer } from 'markmap-lib'
import * as markmap from 'markmap-view'
import 'markmap-toolbar/dist/style.css'

const initValue = `# markmap

- beautiful
- useful
- easy
- interactive
`

export default function MarkmapRender({ data }: { data: string }) {
  const [value, setValue] = useState(data || initValue)
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement>(null)
  // Ref for markmap object
  const refMm = useRef<Markmap>()
  // Ref for toolbar wrapper
  const refToolbar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current || !refToolbar.current || !refSvg.current) return
    const mm = Markmap.create(refSvg.current)
    console.log('create', refSvg.current)
    refMm.current = mm
    renderToolbar(refMm.current, refToolbar.current)
  }, [refSvg.current])

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current
    if (!mm) return

    const transformer = new Transformer()
    const { scripts = [], styles = [] } = transformer.getAssets()
    loadCSS(styles)
    loadJS(scripts, { getMarkmap: () => markmap })

    const { root } = transformer.transform(value)
    mm.setData(root)
    mm.fit()
    mm.setOptions({ maxWidth: 300 })
  }, [refMm.current, value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  return (
    <>
      <svg className="h-full markmap" ref={refSvg} />
      <div className="absolute bottom-1 right-1" ref={refToolbar} />
    </>
  )
}

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove()
  if (mm && wrapper) {
    const toolbar = new Toolbar()
    toolbar.attach(mm)
    // Register custom buttons
    toolbar.register({
      id: 'alert',
      title: 'Click to show an alert',
      content: 'Alert',
      onClick: () => alert('You made it!'),
    })
    toolbar.setItems([...Toolbar.defaultItems, 'alert'])
    wrapper.append(toolbar.render())
  }
}
