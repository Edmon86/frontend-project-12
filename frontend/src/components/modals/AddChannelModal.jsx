import { Modal, Button } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import getChannelSchema from '../../validation/channelSchema'

const AddChannelModal = ({ show, handleClose, channels, t, handleAddChannel }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>{t('channels.addTitle')}</Modal.Title>
    </Modal.Header>

    <Formik
      initialValues={{ name: '' }}
      validationSchema={getChannelSchema(channels, t)}
      onSubmit={async ({ name }, { setSubmitting }) => {
        await handleAddChannel(name, setSubmitting)
      }}
    >
      {({ isSubmitting }) => (
        <Form className="p-3">
          <label htmlFor="add-channel-name" className="form-label">{t('channels.placeholder')}</label>
          <Field id="add-channel-name" type="text" name="name" className="form-control" autoFocus />
          <ErrorMessage name="name" component="div" className="text-danger mt-2" />
          <div className="text-end mt-3">
            <Button type="submit" disabled={isSubmitting}>{t('channels.add')}</Button>
          </div>
        </Form>
      )}
    </Formik>
  </Modal>
)

export default AddChannelModal
