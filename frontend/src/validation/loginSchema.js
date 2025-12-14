import * as Yup from 'yup'

const getLoginSchema = (t) =>
  Yup.object({
    username: Yup.string().required(t('login.usernameRequired')),
    password: Yup.string().required(t('login.passwordRequired')),
  })

export default getLoginSchema
