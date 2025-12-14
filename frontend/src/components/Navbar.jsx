import { useTranslation } from 'react-i18next'

const Navbar = ({ status, onLogout }) => {
  const { t } = useTranslation()

  return (
    <nav className="navbar navbar-light bg-white shadow-sm p-3">
      <div className="container d-flex justify-content-between">
        <h5 className="mb-0">{t('appName')}</h5>

        <div>
          <span className={`me-3 text-${status === 'connected' ? 'success' : 'danger'}`}>
            {status === 'connected'
              ? t('messages.connected')
              : t('messages.disconnected')}
          </span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={onLogout}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
