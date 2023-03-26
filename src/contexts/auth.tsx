import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  username: string;
  setUsername: (value: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [username, setUsername] = useState("");

  function logout() {
    setUsername("");
  }

  function isAuthenticated() {
    return username !== "";
  }

  return (
    <AuthContext.Provider
      value={{
        username,
        setUsername,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
