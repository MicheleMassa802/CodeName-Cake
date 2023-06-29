import { StatusBar as ExpoStatusBar} from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screen imports
import WelcomeScreen from './app/screens/WelcomeScreen';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import HomeScreen from './app/screens/HomeScreen';
import StatsScreen from './app/screens/StatsScreen';
import ViewOrdersScreen from './app/screens/ViewOrdersScreen';
import CalendarScreen from './app/screens/CalendarScreen';
import AddOrderScreen from './app/screens/AddOrderScreen';
import AddOrderFurtherDetailsScreen from './app/screens/AddOrderFurtherDetailsScreen';
import ViewReceiptScreen from './app/screens/ViewReceiptScreen';
import UpdateOrderFurtherDetailsScreen from './app/screens/UpdateOrderFurtherDetailsScreen';

export default function App() {

  console.log(StatusBar.currentHeight);

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  });

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown: false, headerLeft: null}}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false, headerLeft: null}}/>
          <Stack.Screen name="StatsScreen" component={StatsScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ViewOrdersScreen" component={ViewOrdersScreen} options={{headerShown: false}}/>
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{headerShown: false}}/>
          <Stack.Screen name="AddOrderScreen" component={AddOrderScreen} options={{headerShown: false}}/>
          <Stack.Screen name="AddOrderFurtherDetailsScreen" component={AddOrderFurtherDetailsScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ViewReceiptScreen" component={ViewReceiptScreen} options={{headerShown: false}}/>
          <Stack.Screen name="UpdateOrderFurtherDetailsScreen" component={UpdateOrderFurtherDetailsScreen} options={{headerShown: false}}/>

        </Stack.Navigator>

      </NavigationContainer>
    </SafeAreaView>

    // <RegisterScreen/>
  );
}
