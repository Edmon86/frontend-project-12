import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown, Modal } from 'react-bootstrap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  setCurrentChannelId,
  addChannelServer,
  renameChannelServer,
  removeChannelServer,
} from '../slices/chatSlice'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LanguageSwitcher from './LanguageSwitcher'

const createSchema = (channels, t) =>
  Yup.object({
    name: Yup.string()
      .min(3, t('channels.errors.min3'))
      .max(20, t('channels.errors.max20'))
      .required(t('channels.errors.required'))
      .test(
        'unique',
        t('channels.errors.unique'),
        (value) => !channels.some((c) => c.name.toLowerCase() === value.toLowerCase()),
      ),
  })

const Channels = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { channels, currentChannelId } = useSelector((state) => state.chat)

  const [showAdd, setShowAdd] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  const openAdd = () => setShowAdd(true)
  const closeAdd = () => setShowAdd(false)

  const openRename = (channel) => {
    setSelectedChannel(channel)
    setShowRename(true)
  }
  const closeRename = () => setShowRename(false)

  // --- Функция добавления канала с уведомлениями ---
  const handleAddChannel = async(name, setSubmitting) => {
    try {
      await dispatch(addChannelServer(name)).unwrap()
      toast.success(t('channels.addSuccess'))
      closeAdd()
    } catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      } else {
        toast.error(t('channels.addError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  // --- Функция переименования канала с уведомлениями ---
  const handleRenameChannel = async(id, name, setSubmitting) => {
    try {
      await dispatch(renameChannelServer({ id, name })).unwrap()
      toast.success(t('channels.renameSuccess'))
      closeRename()
    } catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      } else {
        toast.error(t('channels.renameError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  // --- Функция удаления канала с уведомлениями ---
  const handleDeleteChannel = async(id) => {
    try {
      await dispatch(removeChannelServer(id)).unwrap()
      toast.success(t('channels.deleteSuccess'))
    } catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      } else {
        toast.error(t('channels.deleteError'))
      }
    }
  }

  return (
    <div>

      {/* HEADER + LANGUAGE SWITCHER */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="m-0">{t('channels.title')}</h6>
        <div className="d-flex gap-2">
          <LanguageSwitcher />
          <Button size="sm" onClick={openAdd}>+</Button>
        </div>
      </div>

      {/* CHANNEL LIST */}
      <ul className="list-group">
        {channels.map((c) => (
          <li
            key={c.id}
            onClick={() => dispatch(setCurrentChannelId(c.id))}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              c.id === currentChannelId ? 'active' : ''
            }`}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              # {c.name}
            </span>

            {c.removable && (
              <Dropdown
                className="position-absolute"
                style={{ right: '10px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <Dropdown.Toggle size="sm" variant="variant" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => openRename(c)}>
                    {t('channels.rename')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeleteChannel(c.id)}>
                    {t('channels.delete')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </li>
        ))}
      </ul>

      {/* ADD CHANNEL MODAL */}
      <Modal show={showAdd} onHide={closeAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('channels.addTitle')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={createSchema(channels, t)}
          onSubmit={async({ name }, { setSubmitting }) => {
            await handleAddChannel(name, setSubmitting)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="p-3">
              <Field
                name="name"
                className="form-control"
                placeholder={t('channels.placeholder')}
                autoFocus
              />
              <ErrorMessage name="name" component="div" className="text-danger mt-2" />
              <div className="text-end mt-3">
                <Button type="submit" disabled={isSubmitting}>{t('channels.add')}</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* RENAME CHANNEL MODAL */}
      <Modal show={showRename} onHide={closeRename} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('channels.renameTitle')}</Modal.Title>
        </Modal.Header>
        {selectedChannel && (
          <Formik
            initialValues={{ name: selectedChannel.name }}
            validationSchema={createSchema(
              channels.filter((c) => c.id !== selectedChannel.id),
              t,
            )}
            onSubmit={async({ name }, { setSubmitting }) => {
              await handleRenameChannel(selectedChannel.id, name, setSubmitting)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="p-3">
                <Field name="name" className="form-control" autoFocus />
                <ErrorMessage name="name" component="div" className="text-danger mt-2" />
                <div className="text-end mt-3">
                  <Button type="submit" disabled={isSubmitting}>{t('channels.save')}</Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  )
}

export default Channels
