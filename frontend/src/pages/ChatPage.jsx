import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatPage = ({ setIsAuth }) => {
  const navigate = useNavigate();

  // ✅ Список каналов (можно потом брать с сервера)
  const [channels, setChannels] = useState([
    { id: 1, name: 'general' },
    { id: 2, name: 'random' },
  ]);

  const [currentChannelId, setCurrentChannelId] = useState(1);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Пример стартовых сообщений
    setMessages([
      { id: 1, username: 'Admin', text: 'Добро пожаловать в чат!' },
      { id: 2, username: 'System', text: 'Вы в канале general' },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setIsAuth(false);
    navigate('/login');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = e.target.elements.message.value.trim();
    if (!text) return;

    const newMessage = {
      id: Date.now(),
      username: 'me',
      text,
    };

    setMessages((prev) => [...prev, newMessage]);
    e.target.reset();
  };

  return (
    <div className="d-flex flex-column h-100">
      <nav className="navbar navbar-light bg-light shadow-sm p-3">
        <div className="container d-flex justify-content-between">
          <h5 className="mb-0">Hexlet Chat</h5>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Список каналов */}
        <div className="border-end p-3" style={{ width: '250px' }}>
          <h6>Каналы</h6>
          <ul className="list-group">
            {channels.map((c) => (
              <li
                key={c.id}
                onClick={() => setCurrentChannelId(c.id)}
                className={`list-group-item ${c.id === currentChannelId ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                # {c.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Сообщения */}
        <div className="flex-grow-1 d-flex flex-column p-3">
          <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '500px' }}>
            {messages.map((m) => (
              <div key={m.id}>
                <strong>{m.username}: </strong>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage}>
            <input
              name="message"
              className="form-control"
              placeholder="Введите сообщение"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
