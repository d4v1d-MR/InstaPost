import { create } from 'zustand';
import { Location } from '../../interfaces/location';
import { clearWatchLocation, getCurrentLocation, watchCurrentLocation } from '../../actions/location/location';

interface LocationState {
  lastKnownLocation: Location | null;
  watchId: number | null;
  locationError: boolean;
  
  getLocation: () => Promise<Location | null>;
  watchLocation: () => void;
  clearWatchLocation: () => void;
  setLocationError: (hasError: boolean) => void;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  lastKnownLocation: null,
  watchId: null,
  locationError: false,
  
  getLocation: async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        set({ 
          lastKnownLocation: location,
          locationError: false
        });
      } else {
        set({ locationError: true });
      }
      return location;
    } catch (error) {
      console.error('Error en getLocation:', error);
      set({ locationError: true });
      return null;
    }
  },
  
  watchLocation: () => {
    try {
      const watchId = get().watchId;
      if(watchId !== null) get().clearWatchLocation();
      
      const id = watchCurrentLocation(
        (location) => {
          if (location) {
            set({
              lastKnownLocation: location,
              locationError: false
            });
          }
        },
        (error) => {
          console.log('Error en watchLocation:', error);
          set({ locationError: true });
        }
      );

      set({ watchId: id });
    } catch (error) {
      console.error('Error al iniciar watchLocation:', error);
      set({ locationError: true });
    }
  },

  clearWatchLocation: () => {
    try {
      const watchId = get().watchId;
      if(watchId !== null) clearWatchLocation(watchId);
      set({ watchId: null });
    } catch (error) {
      console.error('Error al limpiar watchLocation:', error);
    }
  },

  setLocationError: (hasError: boolean) => {
    set({ locationError: hasError });
  }
}));