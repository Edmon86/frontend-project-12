import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown } from 'react-bootstrap'
import {
  setCurrentChannelId,
  addChannelServer,
  renameChannelServer,
  removeChannelServer,
} from '../store/slices/chatSlice'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LanguageSwitcher from './LanguageSwitcher'
import leoProfanity from 'leo-profanity'

import AddChannelModal from './modals/AddChannelModal'
import RenameChannelModal from './modals/RenameChannelModal'
import DeleteChannelModal from './modals/DeleteChannelModal'

const Channels = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { channels, currentChannelId } = useSelector(state => state.chat)

  const [showAdd, setShowAdd] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  const openAdd = () => setShowAdd(true)
  const closeAdd = () => setShowAdd(false)

  const openRename = (channel) => {
    setSelectedChannel(channel)
    setShowRename(true)
  }
  const closeRename = () => setShowRename(false)

  const openDelete = (channel) => {
    setSelectedChannel(channel)
    setShowDelete(true)
  }
  const closeDelete = () => setShowDelete(false)

  const handleAddChannel = async (name, setSubmitting) => {
    const cleanName = leoProfanity.clean(name)
    try {
      await dispatch(addChannelServer(cleanName)).unwrap()
      toast.success(t('channels.addSuccess'))
      closeAdd()
    }
    catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      }
      else {
        toast.error(t('channels.addError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleRenameChannel = async (id, name, setSubmitting) => {
    const cleanName = leoProfanity.clean(name)
    try {
      await dispatch(renameChannelServer({ id, name: cleanName })).unwrap()
      toast.success(t('channels.renameSuccess'))
      closeRename()
    }
    catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      }
      else {
        toast.error(t('channels.renameError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteChannel = async (id) => {
    try {
      await dispatch(removeChannelServer(id)).unwrap()
      toast.success(t('channels.deleteSuccess'))
      closeDelete()
    }
    catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      }
      else {
        toast.error(t('channels.deleteError'))
      }
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="m-0">{t('channels.title')}</h6>
        <div className="d-flex gap-2">
          <LanguageSwitcher />
          <Button size="sm" onClick={openAdd}>+</Button>
        </div>
      </div>

      <ul className="list-group">
        {channels.map(c => (
          <li
            key={c.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${c.id === currentChannelId ? 'active' : ''}`}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <button
              type="button"
              onClick={() => dispatch(setCurrentChannelId(c.id))}
              style={{
                all: 'unset',
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                width: '100%',
              }}
            >
              <span># </span>
              <span>{c.name}</span>
            </button>

            {c.removable && (
              <Dropdown
                className="position-absolute"
                style={{ right: '10px' }}
                onClick={e => e.stopPropagation()}
              >
                <Dropdown.Toggle size="sm" variant="variant">
                  <span className="visually-hidden">{t('channels.manage')}</span>
                  <span aria-hidden="true"> </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => openRename(c)}>{t('channels.rename')}</Dropdown.Item>
                  <Dropdown.Item onClick={() => openDelete(c)}>{t('channels.delete')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </li>
        ))}
      </ul>

      {/* Модалки */}
      <AddChannelModal
        show={showAdd}
        handleClose={closeAdd}
        channels={channels}
        t={t}
        handleAddChannel={handleAddChannel}
      />
      <RenameChannelModal 
        show={showRename}
        handleClose={closeRename}
        channels={channels.filter(c => c.id !== selectedChannel?.id)}
        selectedChannel={selectedChannel}
        t={t}
        handleRenameChannel={handleRenameChannel}
      />
      <DeleteChannelModal 
        show={showDelete}
        handleClose={closeDelete}
        selectedChannel={selectedChannel}
        t={t}
        handleDeleteChannel={handleDeleteChannel}
      />
    </div>
  )
}

export default Channels
