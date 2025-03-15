import Geolocation from '@react-native-community/geolocation'
import { Location } from '../../interfaces/location'

export const getCurrentLocation = async (): Promise<Location | null> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition((info) => {
      resolve({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude
      })
    }, (error) => {
      console.log('Error al obtener ubicación:', error);
      // Resolver con null en lugar de rechazar la promesa
      resolve(null);
    }, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    })
  })
}

export const watchCurrentLocation = (
  locationCallback: (location: Location) => void,
  errorCallback?: (error: any) => void
): number => {
  return Geolocation.watchPosition(info => {
    locationCallback({
      latitude: info.coords.latitude,
      longitude: info.coords.longitude
    })
  }, (error) => {
    console.log('Error en watchPosition:', error);
    // Llamar al callback de error si existe
    if (errorCallback) {
      errorCallback(error);
    }
    // No lanzar error para evitar bloqueos
  }, {
    enableHighAccuracy: true,
    distanceFilter: 10, // Actualizar solo cuando el usuario se mueva al menos 10 metros
    interval: 5000, // Intervalo en ms (solo Android)
    fastestInterval: 2000 // Intervalo más rápido (solo Android)
  })
}

export const clearWatchLocation = (watchId: number) => {
  try {
    Geolocation.clearWatch(watchId);
  } catch (error) {
    console.log('Error al limpiar watch:', error);
  }
}