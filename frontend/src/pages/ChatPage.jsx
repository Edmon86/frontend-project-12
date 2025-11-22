import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { fetchChannels, fetchMessages, addMessage } from '../slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import Channels from '../components/Channels.jsx';
import socket from '../socket.js';

const ChatPage = ({ setIsAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channels, messages, currentChannelId } = useSelector((state) => state.chat);

  const [status, setStatus] = useState('connected');
  const messagesEndRef = useRef(null);

  const currentChannel = channels.find((ch) => ch.id === currentChannelId);
  const channelMessages = messages.filter((m) => m.channelId === currentChannelId);
  const messageCount = channelMessages.length;

  // Загружаем каналы при старте
  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  // Загружаем сообщения при выборе канала
  useEffect(() => {
    if (!currentChannelId) return;

    dispatch(fetchMessages(currentChannelId));

    const handleNewMessage = (message) => {
      if (message.channelId === currentChannelId) {
        dispatch(addMessage(message));
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [currentChannelId, dispatch]);

  // Скролл вниз при появлении новых сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  // Статус соединения
  useEffect(() => {
    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
  }, []);

  // Отправка сообщения
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = e.target.elements.message.value.trim();
    if (!text) return;
    
    const username = localStorage.getItem('username') || 'me';

    const message = {
      channelId: currentChannelId,
      username,
      text,
    };

    try {
      await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(message),
      });
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
    }

    e.target.reset();
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuth(false);
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column h-100 bg-light">
      {/* Навбар */}
      <nav className="navbar navbar-light bg-white shadow-sm p-3">
        <div className="container d-flex justify-content-between">
          <h5 className="mb-0">Hexlet Chat</h5>
          <div>
            <span className={`me-3 text-${status === 'connected' ? 'success' : 'danger'}`}>
              {status === 'connected' ? 'Подключено' : 'Нет соединения'}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </nav>

      {/* Центрированный контент */}
      <div className="d-flex justify-content-center flex-grow-1 py-4">
        <div
          className="d-flex bg-white shadow rounded p-3"
          style={{
            width: '80%',
            maxWidth: '1500px',
            minHeight: '80vh',
          }}
        >
          {/* Список каналов */}
          <div className="border-end pe-3" style={{ width: '250px' }}>
            <Channels />
          </div>

          {/* Сообщения */}
          <div className="flex-grow-1 ps-4 d-flex flex-column">
            {currentChannel && (
              <div
                className="mb-3 pb-2"
                style={{
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: 'bold',
                  color: '#495057',
                }}
              >
                #{currentChannel.name} • {messageCount}{' '}
                {messageCount === 1 ? 'сообщение' : 'сообщений'}
              </div>
            )}

            {/* Список сообщений */}
            <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '60vh' }}>
              {channelMessages.map((m, index) => (
                <div key={index} className="mb-2">
                  <strong>{m.username}: </strong>
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Форма ввода */}
            <form onSubmit={handleSendMessage}>
              <input
                name="message"
                className="form-control"
                placeholder="Введите сообщение..."
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
