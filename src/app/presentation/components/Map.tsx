import React, { useEffect, useRef, useState } from 'react'
import { Platform, Alert, StyleSheet, Linking } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Location } from '../../interfaces/location';
import { FAB } from './ui/FAB';
import { useLocationStore } from '../store/useLocationStore';
import { useGlobalSettings } from '../hooks';
import Geolocation from '@react-native-community/geolocation';

interface Props {
  initialLocation: Location | null
}

export const Map = ({initialLocation}: Props) => {
  const mapRef = useRef<MapView>(null);
  const { showUserLocation } = useGlobalSettings();
  const currentLocation = useRef<Location>(initialLocation ?? { latitude: 28.094167, longitude: -15.418519 });
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const { 
    getLocation,
    lastKnownLocation,
    watchLocation,
    clearWatchLocation,
    locationError,
    setLocationError
  } = useLocationStore();

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        Geolocation.requestAuthorization(
          () => {
            console.log('Permiso de ubicación concedido');
            setLocationPermissionGranted(true);
            watchLocation();
          },
          (error) => {
            console.log('Error de permiso de ubicación:', error);
            setLocationPermissionGranted(false);
            setLocationError(true);
            Alert.alert(
              "Permiso denegado",
              "Has denegado el permiso de ubicación. Algunas funciones no estarán disponibles.",
              [{ text: "OK" }]
            );
          }
        );
      } catch (error) {
        console.error("Error al verificar permisos de ubicación:", error);
        setLocationPermissionGranted(false);
        setLocationError(true);
        Alert.alert(
          "Error de permisos",
          "No se pudieron verificar los permisos de ubicación. Por favor, inténtalo de nuevo.",
          [{ text: "OK" }]
        );
      }
    };

    checkLocationPermission();

    return () => {
      clearWatchLocation();
    };
  }, []);

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current || !location) return;

    mapRef.current.animateCamera({
      center: location
    });

    currentLocation.current = location;
  };

  const moveToCurrentLocation = async () => {
    try {
      if (!locationPermissionGranted) {
        Alert.alert(
          "Permiso de ubicación",
          "La aplicación necesita acceso a tu ubicación para funcionar correctamente.",
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Ir a Configuración", 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return;
      }

      if (lastKnownLocation && !locationError) {
        moveCameraToLocation(lastKnownLocation);
        return;
      }

      const location = await getLocation();
      if (location) {
        moveCameraToLocation(location);
      } else {
        Alert.alert(
          "Ubicación no disponible",
          "No se pudo obtener tu ubicación actual. Verifica que los servicios de ubicación estén activados.",
          [
            { text: "Cancelar", style: "cancel" },
            { 
              text: "Ir a Configuración", 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      Alert.alert(
        "Error de ubicación",
        "No se pudo obtener tu ubicación actual. Verifica que los servicios de ubicación estén activados.",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Ir a Configuración", 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
    }
  };

  return (
    <>
      <MapView
        ref={mapRef}
        showsUserLocation={locationPermissionGranted}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={{
          latitude: currentLocation.current?.latitude,
          longitude: currentLocation.current?.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >
        {lastKnownLocation && !locationError && (
          <Marker
            coordinate={{
              latitude: lastKnownLocation.latitude,
              longitude: lastKnownLocation.longitude
            }}
            style={styles.marker}
            title='Estás aquí'
            description='Esta es tu ubicación actual'
            image={require('../../assets/marker.png')}
          />
        )}
      </MapView>

      <FAB
        iconName='compass-outline'
        disabled={!showUserLocation || lastKnownLocation === null}
        onPress={moveToCurrentLocation}
        style={styles.fab}
      />
    </>
  )
}

const styles = StyleSheet.create({
  marker: {
    width: 30,
    height: 30,
  },
  fab: {
    bottom: 20,
    right: 20
  }
});
