import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="d-flex flex-column h-100 justify-content-center align-items-center">
      <h1 className="mb-4">{t('notFound')}</h1>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate('/')}
      >
        {t('backToChat')}
      </button>
    </div>
  )
}

export default NotFoundPage
