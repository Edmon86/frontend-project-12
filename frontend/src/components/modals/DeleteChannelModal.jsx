import { Modal, Button } from 'react-bootstrap'

const DeleteChannelModal = ({ show, handleClose, selectedChannel, t, handleDeleteChannel }) => {
  if (!selectedChannel) return null

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.delete')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {t('channels.deleteConfirm', { name: selectedChannel.name })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>{t('channels.cancel')}</Button>
        <Button variant="danger" onClick={() => handleDeleteChannel(selectedChannel.id)}>{t('channels.delete')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannelModal
