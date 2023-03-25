import { useEffect, useState, useRef, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../../config";

import NetsLogo from "../../assets/nets_logo.png";

import "./ChatScreen.css";

type MessageData = {
  message: {
    text: string;
    isSystemMessage?: boolean;
  };
};

function ThreeDotsLine() {
  const lineStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "28px",
  };
  const dotStyle: React.CSSProperties = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#085474",
    margin: "0 12px",
  };
  return (
    <div style={lineStyle}>
      <div style={dotStyle}></div>
      <div style={dotStyle}></div>
      <div style={dotStyle}></div>
    </div>
  );
}

function Message({
  messageData,
  username,
}: {
  messageData: MessageData;
  username: string;
}) {
  const sharedClassName = "w-fit mx-4 my-2 p-2 rounded-lg clearfix";
  const { text, isSystemMessage } = messageData.message;
  function renderTextComponentHelper() {
    if (isSystemMessage) {
      return (
        <div
          className={`bg-yellow-300 ${sharedClassName}`}
        >{`System: ${text} `}</div>
      );
    }
    const [receivedUsername, receivedMessage] = text.split(/:(.*)/s);

    if (receivedUsername === username) {
      return (
        <div className={`float-right bg-blue-300 ${sharedClassName}`}>
          {receivedMessage}
        </div>
      );
    }

    return (
      <div className={`bg-gray-300 ${sharedClassName}`}>
        {receivedUsername}: {receivedMessage}
      </div>
    );
  }

  return <div className="clearfix">{renderTextComponentHelper()}</div>;
}

function History({
  messages,
  username,
}: {
  messages: MessageData[];
  username: string;
}) {
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
          <Message key={index} messageData={messageData} username={username} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}

function SendMessageSection({ username }: { username: string }) {
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
    <div
      className="flex justify-between"
      style={{
        bottom: "0px",
      }}
    >
      <textarea
        className="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
        rows={1}
        placeholder="Message..."
        style={{
          outline: "none",
        }}
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button
        className="m-2"
        style={{
          outline: "none",
        }}
        onClick={handleSubmit}
      >
        <svg
          className="svg-inline--fa text-blue-600 fa-paper-plane fa-w-16 w-6 h-6 py-2 mr-2"
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

export function ChatScreen({ username }: { username: string }) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  useWebSocket(WS_URL, {
    onMessage: (event) => {
      console.log("NewMessage", event.data, typeof event.data);
      const messageData: MessageData = JSON.parse(event.data);
      setMessages([...messages, messageData]);
    },
  });

  return (
    <div className="chat-screen-background">
      <div className="chat-screen-main-section">
        <div className="chat-screen-main-frame">
          <img
            height={"40px"}
            id="defaultLogo"
            src={NetsLogo}
            alt="Nets logo"
          />
          <div className="chat-screen-intro-header">Global group chat</div>
          <History messages={messages} username={username} />
          <SendMessageSection username={username} />
        </div>
      </div>
    </div>
  );
}
