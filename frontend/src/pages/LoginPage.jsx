import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Введите имя пользователя'),
  password: Yup.string().required('Введите пароль'),
});

const LoginPage = () => (
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
                <img src="/avatar.jpg" className="rounded-circle" alt="Войти" />
              </div>

              <div className="col-12 col-md-6 mt-3 mt-md-0">
                <h1 className="text-center mb-4">Войти</h1>

                <Formik
                  initialValues={{ username: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={(values) => {
                    console.log('Отправлено:', values);
                  }}
                >
                  {() => (
                    <Form>
                      <div className="form-floating mb-3">
                        <Field
                          name="username"
                          type="text"
                          placeholder="Ваш ник"
                          id="username"
                          className="form-control"
                        />
                        <label htmlFor="username">Ваш ник</label>
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      <div className="form-floating mb-4">
                        <Field
                          name="password"
                          type="password"
                          placeholder="Пароль"
                          id="password"
                          className="form-control"
                        />
                        <label htmlFor="password">Пароль</label>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

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
