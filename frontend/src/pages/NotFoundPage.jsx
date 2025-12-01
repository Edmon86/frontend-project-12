import React from 'react'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="d-flex h-100 justify-content-center align-items-center">
      <h1>{t('notFound')}</h1>
    </div>
  )
}
