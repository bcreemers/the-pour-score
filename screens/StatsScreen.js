import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Your Stats</Text>
      <Text>Coming soon...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 }
})
