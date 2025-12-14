import { Formik, Form, Field, ErrorMessage } from 'formik'
import avatar from '../assets/avatar.jpg'
import { useTranslation } from 'react-i18next'
import getSignupSchema from '../validation/signupSchema'

const SignupPage = ({ setIsAuth }) => {
  const { t } = useTranslation()

  const handleSignup = (setIsAuth, t) => async (values, { setStatus }) => {
    try {
      const res = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      })

      if (res.status === 409) {
        setStatus(t('signup.errors.usernameExists'))
        return
      }

      if (!res.ok) {
        throw new Error('Ошибка регистрации')
      }

      const data = await res.json()
      localStorage.setItem('userToken', data.token)
      localStorage.setItem('username', data.username)
      setIsAuth(true)
    }
    catch {
      setStatus(t('signup.errors.general'))
    }
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* FIXED NAVBAR */}
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/">{t('appName')}</a>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container-fluid h-100 overflow-auto" style={{ paddingTop: '70px' }}>
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-4 p-md-5">
                {/* AVATAR IMAGE */}
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center mb-3 mb-md-0">
                  <img
                    src={avatar}
                    className="rounded-circle img-fluid"
                    alt={t('login.title')}
                  />
                </div>

                {/* SIGNUP FORM */}
                <div className="col-12 col-md-6">
                  <h1 className="text-center mb-4">{t('signup.title')}</h1>

                  <Formik
                    initialValues={{ username: '', password: '', confirmPassword: '' }}
                    validationSchema={getSignupSchema(t)}
                    onSubmit={handleSignup(setIsAuth, t)}
                  >
                    {({ status }) => (
                      <Form>
                        <div className="form-floating mb-3">
                          <Field name="username" type="text" className="form-control" id="username" />
                          <label htmlFor="username">{t('signup.username')}</label>
                          <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="form-floating mb-3">
                          <Field name="password" type="password" className="form-control" id="password" />
                          <label htmlFor="password">{t('signup.password')}</label>
                          <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="form-floating mb-4">
                          <Field name="confirmPassword" type="password" className="form-control" id="confirmPassword" />
                          <label htmlFor="confirmPassword">{t('signup.confirmPassword')}</label>
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger small mt-1" />
                        </div>

                        {status && <div className="text-danger text-center mb-2">{status}</div>}

                        <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                          {t('signup.submit')}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>

              {/* CARD FOOTER */}
              <div className="card-footer p-4 text-center">
                <span>{t('signup.haveAccount')}</span>
                <a href="/login" className="ms-1">{t('signup.login')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
