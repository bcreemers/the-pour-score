import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native'
import { supabase } from '../lib/supabase'
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

export default function HomeScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [drinks, setDrinks] = useState([])


useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <Button title="Stats 📊" onPress={() => navigation.navigate('Stats')} />
    ),
  });
}, [navigation]);
  

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) fetchDrinks(user.id)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      const loggedInUser = session?.user ?? null
      setUser(loggedInUser)
      if (loggedInUser) fetchDrinks(loggedInUser.id)
    })
  }, [])
  

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? error.message : 'Check your email for confirmation!')
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      fetchDrinks(user.id)
    }
    setMessage(error ? error.message : 'Login successful!')
  }

  const handleLogDrink = async () => {
  if (!user) {
    setMessage('Please log in first')
    return
  }

  const { error } = await supabase.from('drinks').insert([
    {
      user_id: user.id,
      drink_type: 'beer',
      timestamp: new Date().toISOString(),
      location: null,
    }
  ])

  if (!error) {
    await fetchDrinks(user.id)
    setMessage('🍺 Drink logged!')
  } else {
    console.error(error)
    setMessage(error.message)
  }
}

  const fetchDrinks = async (userId) => {
  console.log('Fetching drinks for user ID:', userId)
  const { data, error } = await supabase
    .from('drinks')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching drinks:', error.message)
    setMessage(error.message)
  } else {
    console.log('Fetched drinks:', data)
    setDrinks(data)
  }
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>The Pour Score 🍻</Text>

      {!user && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          <View style={styles.buttonContainer}>
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Login" onPress={handleLogin} />
          </View>
        </>
      )}

      {user && (
        <>
          <Text style={styles.subtitle}>Welcome, {user.email}!</Text>
          <Button title="Log a Drink 🍺" onPress={handleLogDrink} />

          <Text style={styles.subtitle}>Your Drink History</Text>
          {drinks.length > 0 ? (
  drinks.map((drink) => (
    <View key={drink.id} style={styles.drinkItem}>
      <Text style={{ fontSize: 16 }}>
        🥤 {drink.drink_type}  
        {"\n"}🕒 {new Date(drink.timestamp).toLocaleString()}
      </Text>
    </View>
  ))
) : (
  <Text style={{ marginTop: 10, fontStyle: 'italic' }}>
    No drinks logged yet!
  </Text>
)}
        </>
      )}

      <Text style={{ marginTop: 20 }}>{message}</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20, paddingTop: 60, alignItems: 'center'
  },
  title: {
    fontSize: 24, marginBottom: 20
  },
  subtitle: {
    fontSize: 18, marginVertical: 20
  },
  input: {
    width: '100%', borderWidth: 1, borderColor: '#ccc',
    padding: 10, marginBottom: 10, borderRadius: 5
  },
  buttonContainer: {
    flexDirection: 'row', gap: 10, marginBottom: 10
  },
  drinkItem: {
    marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, width: '100%'
  }
})