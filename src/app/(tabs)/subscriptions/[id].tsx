import { View, Text } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams } from 'expo-router';


const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details for ID: {id}</Text>
      <Link href="/(tabs)/subscriptions">Back to Subscriptions</Link>
    </View>
  )
}

export default SubscriptionDetails