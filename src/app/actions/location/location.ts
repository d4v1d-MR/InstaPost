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
    if (errorCallback) {
      errorCallback(error);
    }
  }, {
    enableHighAccuracy: true,
    distanceFilter: 10,
    interval: 5000,
    fastestInterval: 2000
  })
}

export const clearWatchLocation = (watchId: number) => {
  try {
    Geolocation.clearWatch(watchId);
  } catch (error) {
    console.log('Error al limpiar watch:', error);
  }
}