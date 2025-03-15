import { 
  createContext, 
  PropsWithChildren, 
  useEffect, 
  useState 
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface LoggedUserContextProps {
  username: string | undefined;
  isLoading: boolean;
  saveUsername: (name: string) => Promise<boolean>;
  clearUsername: () => Promise<boolean>;
  logout: () => void;
}

export const LoggedUserContext = createContext({} as LoggedUserContextProps);

export const LoggedUserProvider = ({ children }: PropsWithChildren) => {
  const [username, setUsername] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUsername = async () => {
      setIsLoading(true);
      try {
        const username = await AsyncStorage.getItem('username');
        if (username) setUsername(username)
      } catch (error) {
        console.error('Error loading username:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsername();
  }, [])

  const saveUsername = async (name: string) => {
    try {
      await AsyncStorage.setItem('username', name);
      setUsername(name);
      return true;
    } catch (error) {
      console.error('Error saving username:', error);
      return false;
    }
  };

  const clearUsername = async () => {
    try {
      await AsyncStorage.removeItem('username');
      setUsername(undefined);
      return true;
    } catch (error) {
      console.error('Error clearing username:', error);
      return false;
    }
  };

  const logout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a introducir tu nombre de usuario.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            const success = await clearUsername();
            if (success) {
              console.log('Sesion cerrada correctamente')
            }
          }
        }
      ]
    );
  };

  return (
    <LoggedUserContext.Provider
      value={{
        username,
        isLoading,
        saveUsername,
        clearUsername,
        logout
      }}
    >
      {children}
    </LoggedUserContext.Provider>
  )
}
