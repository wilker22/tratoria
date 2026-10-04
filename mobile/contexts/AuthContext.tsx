import api from "@/services/api";
import { LoginResponse, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      await loadStorageData();
    }
    loadData();
  }, []);

  async function loadStorageData() {
    try {
      setLoading(true);

      const storedToken = await AsyncStorage.getItem("@token:pizzaria");
      const storedUser = await AsyncStorage.getItem("@user:pizzaria");

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post<LoginResponse>("/session", {
        email: email,
        password: password,
      });

      const { token, ...userData } = response.data;
      await AsyncStorage.setItem("@token:pizzaria", token);
      await AsyncStorage.setItem("@user:pizzaria", JSON.stringify(userData));

      setUser(response.data);
    } catch (error: any) {
      if (error.response?.data?.error) {
        console.log(error.response?.data?.error);
        return;
      }
      console.log(error);
    }
  }

  async function signOut() {
    await AsyncStorage.multiRemove(["@user:pizzaria", "@token:pizzaria"]);
    setUser(null);
  }

  return (
    <AuthContext
      value={{
        signed: !!user, //true or false
        loading,
        signIn,
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Contexto não encontrado!");
  }

  return context;
}
