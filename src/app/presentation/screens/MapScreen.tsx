import { Map } from '../components/Map';
import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useLocationStore } from '../store/useLocationStore';
import { LoadingScreen } from './LoadingScreen';

export const MapScreen = () => {
  const { lastKnownLocation, getLocation } = useLocationStore()

  useEffect(() => {
    if (lastKnownLocation === null)
      getLocation();
  }, [])
  
  return (
    <View style={styles.container}>
      <Map initialLocation={lastKnownLocation!} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  }
});