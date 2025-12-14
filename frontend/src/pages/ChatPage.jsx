import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannels, fetchMessages, addMessage } from '../store/slices/chatSlice'
import { useNavigate } from 'react-router-dom'
import Channels from '../components/Channels.jsx'
import Navbar from '../components/Navbar.jsx'
import socket from '../socket.js'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import leoProfanity from 'leo-profanity'

const ChatPage = ({ setIsAuth }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { channels, messages, currentChannelId } = useSelector(state => state.chat)

  const [status, setStatus] = useState('connected')
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  const currentChannel = channels.find(ch => ch.id === currentChannelId)
  const channelMessages = messages.filter(m => m.channelId === currentChannelId)
  const messageCount = channelMessages.length

  useEffect(() => {
    if (currentChannelId) {
      messageInputRef.current?.focus()
    }
  }, [currentChannelId])

  useEffect(() => {
    dispatch(fetchChannels())
      .unwrap()
      .catch(() => {
        if (!navigator.onLine) {
          toast.error(t('chat.errors.noNetwork'))
        }
        else {
          toast.error(t('chat.errors.loadChannels'))
        }
      })
  }, [dispatch, t])

  useEffect(() => {
    if (!currentChannelId) return

    dispatch(fetchMessages(currentChannelId))
      .unwrap()
      .catch(() => {
        if (!navigator.onLine) {
          toast.error(t('chat.errors.noNetwork'))
        }
        else {
          toast.error(t('chat.errors.loadMessages'))
        }
      })

    const handleNewMessage = (message) => {
      if (message.channelId === currentChannelId) {
        dispatch(addMessage(message))
      }
    }

    socket.on('newMessage', handleNewMessage)
    return () => socket.off('newMessage', handleNewMessage)
  }, [currentChannelId, dispatch, t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [channelMessages])

  useEffect(() => {
    socket.on('connect', () => setStatus('connected'))
    socket.on('disconnect', () => setStatus('disconnected'))
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const text = e.target.elements.message.value.trim()
    if (!text) return

    const username = localStorage.getItem('username') || 'me'
    leoProfanity.add(leoProfanity.getDictionary('ru'))
    const cleanText = leoProfanity.clean(text)

    const message = { body: cleanText, channelId: currentChannelId, username }

    try {
      await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(message),
      })
    }
    catch {
      if (!navigator.onLine) {
        toast.error(t('chat.errors.noNetwork'))
      }
      else {
        toast.error(t('chat.errors.sendMessage'))
      }
    }

    e.target.reset()
  }

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    setIsAuth(false)
    navigate('/login')
  }

  return (
    <div className="d-flex flex-column h-100 bg-light">
      <Navbar status={status} onLogout={handleLogout} />

      <div className="d-flex justify-content-center flex-grow-1 py-4">
        <div
          className="d-flex flex-column flex-md-row bg-white shadow rounded p-3"
          style={{ width: '90%', maxWidth: '1500px', minHeight: '80vh' }}
        >
          <div className="border-end pe-3 mb-3 mb-md-0" style={{ width: '250px' }}>
            <Channels />
          </div>

          <div className="flex-grow-1 ps-0 ps-md-4 d-flex flex-column">
            {currentChannel && (
              <div
                className="mb-3 pb-2"
                style={{ borderBottom: '1px solid #dee2e6', fontWeight: 'bold', color: '#495057' }}
              >
                <div>
                  #
                  {currentChannel.name}
                </div>
                <div className="text-muted">
                  {t('messages.count', { count: messageCount })}
                </div>
              </div>
            )}

            <div
              className="flex-grow-1 overflow-auto mb-3"
              style={{ maxHeight: '690px', scrollBehavior: 'smooth' }} // ограничиваем высоту блока сообщений, плавный скролл
            >
              {channelMessages.map((m, index) => (
                <div key={index} className="mb-2">
                  <strong>
                    {m.username}
                    :
                  </strong>
                  {m.body}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="d-flex">
              <input
                ref={messageInputRef}
                name="message"
                className="form-control me-2 flex-grow-1"
                placeholder={t('messages.placeholder')}
                aria-label={t('messages.newMessage')}
              />
              <button type="submit" className="btn btn-primary">
                {t('messages.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
