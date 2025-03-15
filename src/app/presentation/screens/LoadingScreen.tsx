import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Loading } from '../components/ui/Loading';

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Loading />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})