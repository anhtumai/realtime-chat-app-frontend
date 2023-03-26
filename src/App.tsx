import { LoginScreen } from "./modules/preauth/LoginScreen";
import { ChatScreen } from "./modules/postauth/ChatScreen";
import useAuth, { AuthProvider } from "./contexts/auth";

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <ChatScreen />;
  }

  return <LoginScreen />;
}

function AuthProviderWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AuthProviderWrapper;
