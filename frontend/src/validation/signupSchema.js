import * as Yup from 'yup'

const getSignupSchema = t =>
  Yup.object({
    username: Yup.string()
      .required(t('signup.usernameRequired'))
      .min(3, t('signup.errors.min3'))
      .max(20, t('signup.errors.max20')),
    password: Yup.string()
      .required(t('signup.passwordRequired'))
      .min(6, t('signup.errors.min6')),
    confirmPassword: Yup.string()
      .required(t('signup.confirmPasswordRequired'))
      .oneOf([Yup.ref('password')], t('signup.errors.passwordsMatch')),
  })

export default getSignupSchema
