import { useEffect, useState, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../../config";

import NetsLogo from "../../assets/nets_logo.png";

import "./ChatScreen.css";
import useAuth from "../../contexts/auth";

type MessageData = {
  message: {
    text: string;
    isSystemMessage?: boolean;
  };
};

function ThreeDotsLine() {
  const dotClassName = "w-2 h-2 rounded-full bg-nets-color mx-5";
  return (
    <div className="flex items-center justify-center mb-7">
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
      <div className={dotClassName}></div>
    </div>
  );
}

function Message({ messageData }: { messageData: MessageData }) {
  const { username } = useAuth();
  const { text, isSystemMessage } = messageData.message;
  function renderTextComponentHelper() {
    if (isSystemMessage) {
      return (
        <div
          className={`bg-yellow-300 chat-history-message`}
        >{`System: ${text} `}</div>
      );
    }
    const [receivedUsername, receivedMessage] = text.split(/:(.*)/s);

    if (receivedUsername === username) {
      return (
        <div className={`float-right bg-blue-300 chat-history-message`}>
          {receivedMessage}
        </div>
      );
    }

    return (
      <div className={`bg-gray-300 chat-history-message`}>
        {receivedUsername}: {receivedMessage}
      </div>
    );
  }

  return <div className="clearfix">{renderTextComponentHelper()}</div>;
}

function History({ messages }: { messages: MessageData[] }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    (messagesEndRef.current as any).scrollIntoView({ behaviour: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-history">
      <ThreeDotsLine />
      <div
        style={{
          overflowY: "auto",
          maxHeight: "80%",
        }}
      >
        {messages.map((messageData, index) => (
          <Message key={index} messageData={messageData} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}

function SendMessageSection() {
  const { username } = useAuth();

  const { sendJsonMessage } = useWebSocket(WS_URL);

  const [message, setMessage] = useState("");

  function handleSubmit() {
    if (message.length <= 0) {
      return;
    }
    sendJsonMessage(
      {
        message: {
          text: `${username}: ${message}`,
        },
      },
      true,
    );
    setMessage("");
  }

  return (
    <div className="flex justify-between">
      <textarea
        className="flex-grow chat-send-message-textarea outline-none"
        rows={1}
        placeholder="Message..."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button className="m-2 outline-none" onClick={handleSubmit}>
        <svg
          className="chat-send-message-button-svg"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="paper-plane"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
          />
        </svg>
      </button>
    </div>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <button
      className="outline-none"
      title="Logout"
      onClick={() => {
        if (window.confirm("Do you wish to logout")) {
          logout();
        }
      }}
    >
      <svg
        className="chat-logout-button-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384.971 384.971"
      >
        <path
          fill="currentColor"
          d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03
			C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03
			C192.485,366.299,187.095,360.91,180.455,360.91z"
        />
        <path
          fill="currentColor"
          d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279
			c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179
			c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"
        />
      </svg>
    </button>
  );
}

export function ChatScreen() {
  const { username } = useAuth();
  const [messages, setMessages] = useState<MessageData[]>([]);
  useWebSocket(WS_URL, {
    onMessage: (event) => {
      console.log("NewMessage", event.data, typeof event.data);
      const messageData: MessageData = JSON.parse(event.data);
      setMessages([...messages, messageData]);
    },
  });

  return (
    <div className="bg-nets-color">
      <div className="chat-main-section">
        <div className="chat-main-frame">
          <div className="flex flex-row justify-between">
            <div>
              <img
                height={"40px"}
                id="defaultLogo"
                src={NetsLogo}
                alt="Nets logo"
              />
              <div className="chat-intro-header">Global group chat</div>
            </div>
            <LogoutButton />
          </div>
          <div className="chat-login-as-info">Logged in as {username}</div>
          <History messages={messages} />
          <SendMessageSection />
        </div>
      </div>
    </div>
  );
}
