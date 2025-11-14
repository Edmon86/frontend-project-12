import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  setCurrentChannelId,
  addChannelServer,
  renameChannelServer,
  removeChannelServer,
} from '../slices/chatSlice';

const ChannelSchema = (channels) =>
  Yup.object().shape({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .required('Введите имя канала')
      .test(
        'unique',
        'Канал с таким именем уже существует',
        (value) => !channels.some((c) => c.name.toLowerCase() === value.toLowerCase())
      ),
  });

const Channels = () => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.chat);

  const [showAdd, setShowAdd] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleSelectChannel = (id) => dispatch(setCurrentChannelId(id));

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => setShowAdd(false);

  const openRename = (channel) => {
    setSelectedChannel(channel);
    setShowRename(true);
  };
  const closeRename = () => setShowRename(false);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6>Каналы</h6>
        <Button size="sm" onClick={openAdd}>+</Button>
      </div>

      <ul className="list-group">
        {channels.map((c) => (
          <li
            key={c.id}
            onClick={() => handleSelectChannel(c.id)}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              c.id === currentChannelId ? 'active' : ''
            }`}
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget.querySelector('.channel-actions');
              if (btn) btn.style.opacity = 1;
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget.querySelector('.channel-actions');
              if (btn) btn.style.opacity = 0;
            }}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={c.name}
            >
              # {c.name}
            </span>

            {c.name !== 'general' && c.name !== 'random' && (
              <Dropdown
                className="channel-actions"
                onClick={(e) => e.stopPropagation()} // предотвращаем переключение канала при клике на меню
                style={{
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <Dropdown.Toggle
                  variant="variant"
                  size="sm"
                  style={{ padding: '0.2rem 0.5rem' }}
                />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => openRename(c)}>Переименовать</Dropdown.Item>
                  <Dropdown.Item onClick={() => dispatch(removeChannelServer(c.id))}>
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </li>
        ))}
      </ul>

      {/* Добавить канал */}
      <Modal show={showAdd} onHide={closeAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={ChannelSchema(channels)}
          onSubmit={async (values, { setSubmitting }) => {
            await dispatch(addChannelServer(values.name));
            setSubmitting(false);
            closeAdd();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="p-3">
              <Field
                name="name"
                className="form-control mb-2"
                placeholder="Имя канала"
                autoFocus
              />
              <ErrorMessage name="name" component="div" className="text-danger mb-2" />
              <div className="text-end">
                <Button type="submit" disabled={isSubmitting}>
                  Добавить
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Переименовать канал */}
      <Modal show={showRename} onHide={closeRename} centered>
        <Modal.Header closeButton>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>
        {selectedChannel && (
          <Formik
            initialValues={{ name: selectedChannel.name }}
            validationSchema={ChannelSchema(
              channels.filter((c) => c.id !== selectedChannel.id)
            )}
            onSubmit={async ({ name }, { setSubmitting }) => {
              await dispatch(renameChannelServer({ id: selectedChannel.id, name }));
              setSubmitting(false);
              closeRename();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="p-3">
                <Field name="name" className="form-control mb-2" autoFocus />
                <ErrorMessage name="name" component="div" className="text-danger mb-2" />
                <div className="text-end">
                  <Button type="submit" disabled={isSubmitting}>Сохранить</Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </div>
  );
};

export default Channels;

