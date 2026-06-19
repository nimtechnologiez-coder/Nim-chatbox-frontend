import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import logo from '../images/nimlogo.png';

const suggestions = [
  'Explain Django REST API simply',
  'Create React login page code',
  'How to connect MySQL with Django?',
  'Give project ideas for freshers',
];

export default function Chat() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [profile, setProfile] = useState({ username: 'User' });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const username = profile?.username || localStorage.getItem('username') || 'User';
  const avatarLetter = username.charAt(0).toUpperCase();

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/api/auth/me/');
      setProfile(data);
      localStorage.setItem('username', data.username || 'User');
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  };

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/api/chat/conversations/');
      setConversations(data);
      return data;
    } catch (err) {
      if (err.response?.status === 401) logout();
      return [];
    }
  };

  const loadHistory = async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      const { data } = await api.get(`/api/chat/history/?conversation_id=${conversationId}`);
      setMessages(data);
    } catch (err) {
      if (err.response?.status === 401) logout();
      else setMessages([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token || token === "undefined" || token === "null") {
      logout();
      return;
    }

    loadProfile();
    loadConversations().then((items) => {
      if (items.length > 0) {
        setActiveConversationId(items[0].id);
        loadHistory(items[0].id);
      }
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInput('');
    setEditingId(null);
    setEditText('');
  };

  const openConversation = (id) => {
    if (loading) return;
    setActiveConversationId(id);
    setEditingId(null);
    setEditText('');
    loadHistory(id);
  };

  const upsertConversation = (conversation) => {
    if (!conversation) return;
    setConversations((prev) => {
      const withoutCurrent = prev.filter((item) => item.id !== conversation.id);
      return [conversation, ...withoutCurrent];
    });
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    if (loading) return;

    const ok = window.confirm('Delete this old chat?');
    if (!ok) return;

    try {
      await api.delete(`/api/chat/conversations/${id}/delete/`);
      setConversations((prev) => prev.filter((item) => item.id !== id));

      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      if (err.response?.status === 401) logout();
      else alert('Chat delete aagala. Backend check pannunga.');
    }
  };

  const startEdit = (msg) => {
    if (msg.pending || loading) return;
    setEditingId(msg.id);
    setEditText(msg.user_message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (messageId) => {
    const text = editText.trim();
    if (!text || loading) return;

    setLoading(true);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, user_message: text, ai_reply: 'Thinking...', pending: true } : msg
      )
    );

    try {
      const { data } = await api.patch(`/api/chat/messages/${messageId}/edit/`, { message: text });
      const updatedChat = data.chat;
      const updatedConversation = data.conversation;

      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? updatedChat : msg)));
      upsertConversation(updatedConversation);
      setEditingId(null);
      setEditText('');
    } catch (err) {
      if (err.response?.status === 401) logout();
      else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, ai_reply: 'Edit failed. Backend running ah check pannunga.', pending: false }
              : msg
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e, customText = '') => {
    e?.preventDefault();
    const text = (customText || input).trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    const tempMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      user_message: text,
      ai_reply: '',
      pending: true,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const payload = { message: text };
      if (activeConversationId) payload.conversation_id = activeConversationId;

      const { data } = await api.post('/api/chat/send/', payload);
      const savedChat = data.chat || data;
      const savedConversation = data.conversation;

      if (savedConversation?.id) {
        setActiveConversationId(savedConversation.id);
        upsertConversation(savedConversation);
      } else {
        loadConversations();
      }

      setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? savedChat : msg)));
    } catch (err) {
      if (err.response?.status === 401) logout();
      else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, ai_reply: 'Message send failed. Backend running ah check pannunga.', pending: false }
              : msg
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gptApp">
      <aside className="gptSidebar">
        <div className="brandBlock">
          <div className="brandIcon">
            <img src={logo} alt="Nim Chatbox Logo" />
          </div>
          <div>
            <strong>Nim Chatbox</strong>
            <span>AI Assistant</span>
          </div>
        </div>

        <button className="newChatBtn" onClick={startNewChat}>
          <span>+</span> New chat
        </button>

        <div className="sideSection">
          <p>Recent</p>
          {conversations.length === 0 ? (
            <div className="emptyRecent">No old chats yet</div>
          ) : (
            conversations.map((item) => (
              <div
                key={item.id}
                className={`recentItem ${item.id === activeConversationId ? 'recentActive' : ''}`}
                onClick={() => openConversation(item.id)}
                title={item.title}
              >
                <span>{item.title || item.last_message || 'New chat'}</span>
                <button
                  className="deleteChatBtn"
                  onClick={(e) => deleteConversation(e, item.id)}
                  title="Delete chat"
                  aria-label="Delete chat"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="sideFooter">
          <button className="profileBtn" title={username}>
            <span className="avatarDot">{avatarLetter}</span>
            <span className="profileName">{username}</span>
          </button>
          <button className="logoutLink" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="gptMain">
        <header className="topBar">
          <button className="mobileMenu">☰</button>
          <div>
            <h1>{activeConversationId ? 'Nim Chatbox' : 'New Chat'}</h1>
            <p>{username} logged in</p>
          </div>
          <button className="upgradeBtn">Protected</button>
        </header>

        <section className="chatCanvas">
          {messages.length === 0 ? (
            <div className="welcomePanel">
              <div className="welcomeLogo">N</div>
              <h2>What can I help with?</h2>
              <div className="promptGrid">
                {suggestions.map((item) => (
                  <button key={item} onClick={(e) => sendMessage(e, item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messageList">
              {messages.map((msg) => (
                <div className="messageGroup" key={msg.id}>
                  <div className="messageRow userRow">
                    <div className="userMessageWrap">
                      {editingId === msg.id ? (
                        <div className="editBox">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows="3"
                            autoFocus
                          />
                          <div className="editActions">
                            <button type="button" onClick={cancelEdit}>Cancel</button>
                            <button type="button" onClick={() => saveEdit(msg.id)} disabled={!editText.trim() || loading}>
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="messageBubble userMessage">{msg.user_message}</div>
                          {!msg.pending && (
                            <button className="editMsgBtn" onClick={() => startEdit(msg)} title="Edit message">
                              Edit
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <div className="miniAvatar">{avatarLetter}</div>
                  </div>
                  <div className="messageRow aiRow">
                    <div className="aiIcon">N</div>
                    <div className="messageBubble aiMessage">
                      {msg.pending ? (
                        <span className="typingDots">Thinking...</span>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.ai_reply}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <form className="composer" onSubmit={sendMessage}>
          <div className="composerInner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
              }}
              placeholder="Message Nim Chatbox..."
              rows="1"
            />
            <button disabled={loading || !input.trim()}>{loading ? '...' : '➜'}</button>
          </div>
          <p>Nim Chatbox can make mistakes. Check important info.</p>
        </form>
      </main>
    </div>
  );
}
