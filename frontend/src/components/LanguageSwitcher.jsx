import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLang = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang) // сохранение выбора
  }

  const current = i18n.language

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        {current === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => changeLang('ru')}>🇷🇺 Русский</Dropdown.Item>
        <Dropdown.Item onClick={() => changeLang('en')}>🇬🇧 English</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default LanguageSwitcher
