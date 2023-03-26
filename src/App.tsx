import { LoginScreen } from "./modules/preauth/LoginScreen";

import { ChatScreen } from "./modules/postauth/ChatScreen";
import useAuth, { AuthProvider } from "./contexts/auth";

function App() {
  const { username } = useAuth();

  if (username === "") {
    return <LoginScreen />;
  }

  return <ChatScreen />;
}

function AuthProviderWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AuthProviderWrapper;
