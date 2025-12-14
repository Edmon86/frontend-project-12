import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import getChannelSchema from '../../validation/channelSchema'

const RenameChannelModal = ({ show, handleClose, channels, selectedChannel, t, handleRenameChannel }) => {
  if (!selectedChannel) return null

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameTitle')}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: selectedChannel.name }}
        validationSchema={getChannelSchema(channels, t)}
        onSubmit={async ({ name }, { setSubmitting }) => {
          await handleRenameChannel(selectedChannel.id, name, setSubmitting)
        }}
      >
        {({ isSubmitting }) => (
          <Form className="p-3">
            <label htmlFor="rename-channel-name" className="form-label">{t('channels.placeholder')}</label>
            <Field id="rename-channel-name" type="text" name="name" className="form-control" autoFocus />
            <ErrorMessage name="name" component="div" className="text-danger mt-2" />
            <div className="text-end mt-3">
              <Button type="submit" disabled={isSubmitting}>{t('channels.save')}</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
