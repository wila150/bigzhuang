'use client'

import { useRowLabel } from '@payloadcms/ui'

export function ChannelsHelp() {
  return (
    <p style={{ color: 'var(--theme-elevation-500)', margin: '0 0 24px' }}>
      LINE、Email、IG 帳號本身在「網站設定 → 聯絡帳號」修改；沒填的管道不會顯示。
    </p>
  )
}

const typeNames: Record<string, string> = { text: '單行文字', email: 'Email', tel: '電話', textarea: '多行文字', select: '下拉選單' }

// Shows "姓名或稱呼 · 單行文字 · 必填" on each collapsed form-field row.
export function FieldRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; type?: string; required?: boolean }>()
  const parts = [data?.label || `欄位 ${(rowNumber ?? 0) + 1}`, data?.type && typeNames[data.type], data?.required && '必填']
  return <span>{parts.filter(Boolean).join(' · ')}</span>
}
