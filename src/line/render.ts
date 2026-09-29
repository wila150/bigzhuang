import type { Reply } from '@/chat/engine'

import { textWithButton, type LineMessage } from './client'

/** A question card with tap-to-send option buttons inside it (a LINE Flex Message). */
export function questionMessage(q: Extract<Reply, { kind: 'question' }>): LineMessage {
  const send = (label: string) => ({ type: 'message', label: label.slice(0, 40), text: label })
  return {
    type: 'flex',
    altText: `Q${q.index + 1} ${q.question}`.slice(0, 400),
    contents: {
      type: 'bubble',
      size: 'kilo',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          { type: 'text', text: `Q${q.index + 1}／${q.total}`, size: 'sm', weight: 'bold', color: '#D9582B' },
          { type: 'text', text: q.question, wrap: true, size: 'md', weight: 'bold', color: '#0B2742' },
          {
            type: 'text',
            text: q.options.length ? '點選下方按鈕，或直接輸入回答' : '直接在下方輸入回答',
            size: 'xs',
            color: '#8A94A3',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          ...q.options.slice(0, 8).map((o) => ({ type: 'button', style: 'secondary', height: 'sm', action: send(o) })),
          { type: 'button', style: 'link', height: 'sm', color: '#8A94A3', action: send('取消') },
        ],
      },
    },
  }
}

export function toLine(replies: Reply[]): LineMessage[] {
  return replies.flatMap((r) => {
    if (r.kind === 'question') return [questionMessage(r)]
    if (r.kind === 'link') return textWithButton(r.text, { label: r.label, url: r.url })
    return [{ type: 'text', text: r.text }]
  })
}
