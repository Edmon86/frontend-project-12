import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import avatar from '../assets/avatar.jpg';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .required('Введите имя пользователя')
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов'),
  password: Yup.string()
    .required('Введите пароль')
    .min(6, 'Минимум 6 символов'),
  confirmPassword: Yup.string()
    .required('Подтвердите пароль')
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать'),
});

const SignupPage = ({ setIsAuth }) => {
  return (
    <div className="d-flex flex-column h-100">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
        </div>
      </nav>

      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img src={avatar} className="rounded-circle" alt="signup" />
                </div>

                <div className="col-12 col-md-6 mt-3 mt-md-0">
                  <h1 className="text-center mb-4">Регистрация</h1>

                  <Formik
                    initialValues={{ username: '', password: '', confirmPassword: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={async (values, { setStatus }) => {
                      try {
                        const res = await fetch('/api/v1/signup', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            username: values.username,
                            password: values.password,
                          }),
                        });

                        if (res.status === 409) {
                          setStatus('Пользователь с таким именем уже существует');
                          return;
                        }

                        if (!res.ok) {
                          throw new Error('Ошибка регистрации');
                        }

                        const data = await res.json();
                        localStorage.setItem('userToken', data.token);
                        localStorage.setItem('username', data.username);

                        setIsAuth(true);
                      } catch (err) {
                        setStatus('Ошибка регистрации. Попробуйте ещё раз.');
                      }
                    }}
                  >
                    {({ status }) => (
                      <Form>
                        <div className="form-floating mb-3">
                          <Field name="username" type="text" className="form-control" id="username" />
                          <label htmlFor="username">Имя пользователя</label>
                          <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="form-floating mb-3">
                          <Field name="password" type="password" className="form-control" id="password" />
                          <label htmlFor="password">Пароль</label>
                          <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                        </div>

                        <div className="form-floating mb-4">
                          <Field name="confirmPassword" type="password" className="form-control" id="confirmPassword" />
                          <label htmlFor="confirmPassword">Подтверждение пароля</label>
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger small mt-1" />
                        </div>

                        {status && <div className="text-danger text-center mb-2">{status}</div>}

                        <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                          Зарегистрироваться
                        </button>
                      </Form>
                    )}
                  </Formik>

                </div>
              </div>

              <div className="card-footer p-4 text-center">
                <span>Уже есть аккаунт?</span> <a href="/login">Войти</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
