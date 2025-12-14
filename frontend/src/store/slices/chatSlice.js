import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// === Загрузка каналов ===
export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const response = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.map(c => ({
        ...c,
        removable: c.removable,
      }))
    }
    catch {
      return rejectWithValue('Ошибка при загрузке каналов')
    }
  },
)

// === Загрузка сообщений ===
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const response = await axios.get(`/api/v1/messages?channelId=${channelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch {
      return rejectWithValue('Ошибка при загрузке сообщений')
    }
  },
)

// === Добавить канал ===
export const addChannelServer = createAsyncThunk(
  'chat/addChannelServer',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      const response = await axios.post(
        '/api/v1/channels',
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return { ...response.data, removable: true }
    }
    catch {
      return rejectWithValue('Ошибка при добавлении канала')
    }
  },
)

// === Переименовать канал ===
export const renameChannelServer = createAsyncThunk(
  'chat/renameChannelServer',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      await axios.patch(
        `/api/v1/channels/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return { id, name }
    }
    catch {
      return rejectWithValue('Ошибка при переименовании канала')
    }
  },
)

// === Удалить канал ===
export const removeChannelServer = createAsyncThunk(
  'chat/removeChannelServer',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      await axios.delete(`/api/v1/channels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return id
    }
    catch {
      return rejectWithValue('Ошибка при удалении канала')
    }
  },
)

// === Slice ===
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.channels = action.payload
        if (!state.currentChannelId && state.channels.length > 0) {
          const general = state.channels.find(c => c.name === 'general')
          state.currentChannelId = general ? general.id : state.channels[0].id
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(addChannelServer.fulfilled, (state, action) => {
        state.channels.push(action.payload)
        state.currentChannelId = action.payload.id
      })
      .addCase(renameChannelServer.fulfilled, (state, action) => {
        const { id, name } = action.payload
        const channel = state.channels.find(c => c.id === id)
        if (channel) channel.name = name
      })
      .addCase(removeChannelServer.fulfilled, (state, action) => {
        const id = action.payload
        state.channels = state.channels.filter(c => c.id !== id)
        if (state.currentChannelId === id && state.channels.length > 0) {
          state.currentChannelId = state.channels[0].id
        }
      })
  },
})

export const { setCurrentChannelId, addMessage } = chatSlice.actions
export default chatSlice.reducer
