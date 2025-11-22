import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import avatar from '../assets/avatar.jpg';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Введите имя пользователя'),
  password: Yup.string().required('Введите пароль'),
});

const LoginPage = ({ setIsAuth }) => (
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
                <img src={avatar} className="rounded-circle" alt="Войти" />
              </div>

              <div className="col-12 col-md-6 mt-3 mt-md-0">
                <h1 className="text-center mb-4">Войти</h1>

                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={async (values, { setStatus }) => {
                    const { username, password } = values;
                    try {
                      // 🔹 Отправляем запрос к серверу Hexlet Chat
                      const response = await fetch('/api/v1/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                      });

                      if (!response.ok) {
                        throw new Error('Ошибка входа');
                      }

                      const data = await response.json();

                      // ✅ Сохраняем реальный токен от сервера
                      localStorage.setItem('userToken', data.token);
                      localStorage.setItem('username', data.username);

                      // ✅ Меняем состояние
                      setIsAuth(true);
                    } catch (err) {
                      console.error(err);
                      setStatus('Неверные имя пользователя или пароль');
                    }
                  }}
                >
                  {({ status }) => (
                    <Form>
                      <div className="form-floating mb-3">
                        <Field name="username" type="text" className="form-control" id="username" />
                        <label htmlFor="username">Ваш ник</label>
                        <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
                      </div>

                      <div className="form-floating mb-4">
                        <Field name="password" type="password" className="form-control" id="password" />
                        <label htmlFor="password">Пароль</label>
                        <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                      </div>

                      {status && <div className="text-danger text-center mb-2">{status}</div>}

                      <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                        Войти
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            <div className="card-footer p-4 text-center">
              <span>Нет аккаунта?</span> <a href="/signup">Регистрация</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;
