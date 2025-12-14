import * as Yup from 'yup'

const getChannelSchema = (channels, t) =>
  Yup.object({
    name: Yup.string()
      .min(3, t('channels.errors.min3'))
      .max(20, t('channels.errors.max20'))
      .required(t('channels.errors.required'))
      .test(
        'unique',
        t('channels.errors.unique'),
        value => !channels.some(c => c.name.toLowerCase() === value.toLowerCase()),
      ),
  })

export default getChannelSchema
