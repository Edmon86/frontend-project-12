import React, { useEffect, useState } from 'react';

export default function ChatPage() {
  const [channels, setChannels] = useState([]);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('/api/v1/channels')
      .then((r) => r.json())
      .then((data) => {
        setChannels(data);
        if (data.length) setCurrentChannelId(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!currentChannelId) return;
    fetch(`/api/v1/messages?channelId=${currentChannelId}`)
      .then((r) => r.json())
      .then(setMessages);
  }, [currentChannelId]);

  return (
    <div className="d-flex h-100">
      <div className="flex-shrink-0 border-end p-3" style={{ width: '250px' }}>
        <h5>Каналы</h5>
        <ul className="list-group">
          {channels.map((c) => (
            <li
              key={c.id}
              className={`list-group-item ${c.id === currentChannelId ? 'active' : ''}`}
              onClick={() => setCurrentChannelId(c.id)}
              style={{ cursor: 'pointer' }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow-1 d-flex flex-column p-3">
        <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '500px' }}>
          {messages.map((m, i) => (
            <div key={i}>
              <strong>{m.username}: </strong>
              {m.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = e.target.elements.message.value;
            setMessages([...messages, { username: 'me', text }]);
            e.target.reset();
          }}
        >
          <input name="message" className="form-control" placeholder="Введите сообщение" />
        </form>
      </div>
    </div>
  );
}

