
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/chat";

const suggestions = [
  "How can I maintain a healthy lifestyle?",
  "Help me understand a medical report",
  "What should I ask my doctor?",
];

function formatAIResponse(text = "") {
  return String(text)
    .replace(/&#x20;/gi, " ")
    .replace(/&#32;/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r\n/g, "\n")
    .trim();
}

function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [activeConversationId, setActiveConversationId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const requestIdRef = useRef(0);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const patientId = user?.id;

  // ================= LOAD SAVED CONVERSATIONS =================

  const loadConversations = useCallback(async () => {
    if (!patientId) {
      setConversations([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API}/conversations/${patientId}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          params: {
            refresh: Date.now(),
          },
        }
      );

      if (response.data.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (error) {
      console.error(
        "Error loading saved conversations:",
        error.response?.data || error.message
      );
    }
  }, [patientId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // ================= AUTO SCROLL =================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ================= OPEN PREVIOUS CHAT =================

  const openConversation = async (conversation) => {
    console.log("Opening conversation:", conversation);

    if (!conversation?.conversationId) {
      alert("This conversation does not have a valid ID.");
      return;
    }

    if (!patientId) {
      alert("Please log in again to continue.");
      navigate("/login");
      return;
    }

    const currentRequestId = ++requestIdRef.current;

    try {
      setHistoryLoading(true);
      setSidebarOpen(false);

      const response = await axios.get(
        `${API}/history/${patientId}`,
        {
          params: {
            conversationId: conversation.conversationId,
            refresh: Date.now(),
          },
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      console.log("Conversation history response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to load this conversation."
        );
      }

      const loadedMessages = (response.data.chats || []).map((chat) => ({
        role: chat.role,
        text: chat.message,
      }));

      if (currentRequestId !== requestIdRef.current) return;

      setMessages(loadedMessages);
      setActiveConversationId(conversation.conversationId);
      setMessage("");

    } catch (error) {
      if (currentRequestId !== requestIdRef.current) return;

      console.error(
        "Error opening conversation:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to open this conversation."
      );
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setHistoryLoading(false);
      }
    }
  };

  // ================= START NEW CHAT =================

  const startNewChat = () => {
    if (loading) return;

    requestIdRef.current++;

    setActiveConversationId(null);
    setMessages([]);
    setMessage("");
    setHistoryLoading(false);
    setSidebarOpen(false);
  };

  // ================= SEND MESSAGE =================

  const sendMessage = async (text = message) => {
    const currentMessage = text.trim();

    if (!currentMessage || loading || historyLoading) return;

    if (!patientId) {
      alert("Please log in again to use HealthFlow AI.");
      navigate("/login");
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const payload = {
        patientId,
        message: currentMessage,
      };

      if (activeConversationId) {
        payload.conversationId = activeConversationId;
      }

      const response = await axios.post(
        `${API}/send`,
        payload
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to generate a response."
        );
      }

      if (response.data.conversationId) {
        setActiveConversationId(response.data.conversationId);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: response.data.reply,
        },
      ]);

      // Refresh saved conversation list.
      const listResponse = await axios.get(
        `${API}/conversations/${patientId}`,
        {
          params: {
            refresh: Date.now(),
          },
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (listResponse.data.success) {
        setConversations(listResponse.data.conversations || []);
      }

    } catch (error) {
      console.error(
        "AI Chat Error:",
        error.response?.data || error.message
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            error.response?.data?.message ||
            error.message ||
            "I'm unable to connect right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ================= MESSAGE RENDERING =================

  const renderMessage = (text, isUser) => {
    const formattedText = formatAIResponse(text);

    if (isUser) {
      return (
        <p className="whitespace-pre-wrap break-words leading-7">
          {formattedText}
        </p>
      );
    }

    return (
      <div className="ai-markdown break-words text-sm leading-7">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="mb-4 mt-7 text-2xl font-bold leading-tight text-slate-900 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-3 mt-7 border-b border-slate-200 pb-2 text-lg font-bold leading-snug text-slate-900 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 mt-5 text-base font-bold leading-snug text-slate-900 first:mt-0">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-7 last:mb-0">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-5 ml-1 list-disc space-y-2 pl-5 last:mb-0">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-5 ml-1 list-decimal space-y-3 pl-5 last:mb-0">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="pl-1 leading-7 marker:text-teal-700">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-slate-900">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-slate-700">
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-5 rounded-r-lg border-l-4 border-teal-500 bg-teal-50 px-4 py-3 text-slate-700">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="break-words rounded bg-slate-200 px-1.5 py-0.5 text-[0.9em]">
                {children}
              </code>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-teal-800 underline underline-offset-2"
              >
                {children}
              </a>
            ),
            hr: () => (
              <hr className="my-5 border-slate-200" />
            ),
          }}
        >
          {formattedText}
        </ReactMarkdown>
      </div>
    );
  };

  // ================= MAIN UI =================

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-5">
      <div className="mx-auto flex min-h-[90vh] max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close conversation sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-white transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="border-b border-white/10 p-5">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-5 text-sm text-slate-300 transition hover:text-white"
            >
              ← Back to home
            </button>

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-xl text-teal-300">
                ✳
              </div>

              <div>
                <p className="font-bold">HealthFlow AI</p>
                <p className="text-xs text-slate-400">
                  Health Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50"
            >
              + New Chat
            </button>
          </div>

          {/* Previous Chats */}
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Previous Chats
            </h2>

            <button
              type="button"
              onClick={loadConversations}
              aria-label="Refresh saved conversations"
              title="Refresh conversations"
              className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              ↻
            </button>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-5">
            {conversations.length === 0 ? (
              <p className="px-3 py-4 text-sm text-slate-400">
                No saved conversations yet.
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.conversationId}
                  type="button"
                  onClick={() => openConversation(conversation)}
                  title={conversation.title}
                  className={`w-full cursor-pointer rounded-xl px-3 py-3 text-left text-sm transition ${
                    activeConversationId === conversation.conversationId
                      ? "bg-white/10 text-white ring-1 ring-teal-500/40"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="mb-1 block text-teal-400">
                    ◷
                  </span>

                  <span className="block break-words leading-5">
                    {conversation.title || "Health conversation"}
                  </span>

                  {conversation.updatedAt && (
                    <span className="mt-1 block text-xs text-slate-500">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          <div className="border-t border-white/10 p-4 text-xs leading-5 text-slate-500">
            General health information only. Not a medical diagnosis.
          </div>
        </aside>

        {/* Main Chat Panel */}
        <section className="flex min-w-0 flex-1 flex-col">

          <header className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-5 text-white sm:px-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open previous chats"
                className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 md:hidden"
              >
                ☰
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
                  HealthFlow AI
                </p>

                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                  Health Assistant
                </h1>

                <p className="mt-1 text-sm text-slate-300">
                  Your companion for general health information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              disabled={loading}
              className="rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 md:hidden"
            >
              + New
            </button>
          </header>

          <main
            className="flex-1 space-y-6 overflow-y-auto bg-white px-4 py-6 sm:px-8 sm:py-8"
            aria-live="polite"
          >
            {historyLoading && messages.length === 0 ? (
              <div className="flex min-h-[350px] items-center justify-center text-sm text-slate-500">
                Loading your chat...
              </div>
            ) : messages.length === 0 ? (
              <div className="mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl text-teal-800">
                  ✳
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  How can I help you today?
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                  Ask a general health question or choose a suggestion below
                  to start a conversation.
                </p>

                <div className="mt-8 grid w-full gap-3 text-left sm:grid-cols-3">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      disabled={loading || historyLoading}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium leading-6 text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {suggestion}

                      <span className="mt-2 block text-lg text-teal-700">
                        ↗
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={`${index}-${msg.role}`}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[95%] rounded-2xl px-4 py-4 text-sm leading-7 shadow-sm sm:max-w-[85%] sm:px-6 sm:py-5 ${
                        isUser
                          ? "rounded-br-md bg-teal-800 text-white"
                          : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-800"
                      }`}
                    >
                      {!isUser && (
                        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-teal-800">
                          HealthFlow AI
                        </p>
                      )}

                      {renderMessage(msg.text, isUser)}
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-teal-600" />
                    HealthFlow AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </main>

          {/* Message Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-slate-200 bg-white p-4 sm:p-6"
          >
            <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100">
              <textarea
                aria-label="Your health question"
                rows={1}
                placeholder="Ask a general health question..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                className="max-h-32 min-h-11 flex-1 resize-y bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                disabled={loading || historyLoading}
              />

              <button
                type="submit"
                disabled={loading || historyLoading || !message.trim()}
                className="mb-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
              >
                {loading ? "Sending..." : "Send"}
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <p className="mx-auto mt-3 max-w-4xl text-center text-xs leading-5 text-slate-500">
              AI responses may be inaccurate. This tool provides general
              information, not a diagnosis or a substitute for professional
              medical care. For urgent symptoms, seek appropriate medical help.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AIChat;
