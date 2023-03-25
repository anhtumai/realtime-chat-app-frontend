import React, { useState } from "react";

import { LoginScreen } from "./modules/preauth/LoginScreen";

import "./App.css";
import { ChatScreen } from "./modules/postauth/ChatScreen";

function App() {
  const [username, setUsername] = useState("");

  if (username === "") {
    return <LoginScreen setUsername={setUsername} />;
  }

  return <ChatScreen username={username} />;
}

export default App;
