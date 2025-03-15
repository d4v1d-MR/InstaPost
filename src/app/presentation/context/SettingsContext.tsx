import { 
  createContext, 
  PropsWithChildren, 
  useEffect, 
  useState 
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalSettings } from "../../interfaces/globalSettings";

interface SettingsContextProps {
  showUserName: string;
  showUserLocation: boolean;
  isLoading: boolean;
  saveSettings: (settings: GlobalSettings) => Promise<boolean>;
}

export const SettingsContext = createContext({} as SettingsContextProps);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [showUserName, setShowUserName] = useState<string>('yes');
  const [showUserLocation, setShowUserLocation] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await AsyncStorage.getItem('globalSettings');
        if (settings) {
          const parsedSettings: GlobalSettings = JSON.parse(settings);
          setShowUserName(parsedSettings.showUserName);
          setShowUserLocation(parsedSettings.showUserLocation);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [])

  const saveSettings = async (settings: GlobalSettings) => {
    try {
      await AsyncStorage.setItem('globalSettings', JSON.stringify(settings));
      setShowUserName(settings.showUserName);
      setShowUserLocation(settings.showUserLocation);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        showUserName,
        showUserLocation,
        isLoading,
        saveSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
