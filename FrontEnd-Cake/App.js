import { StatusBar as ExpoStatusBar} from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
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

export default function App() {

  console.log(StatusBar.currentHeight);

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* <WelcomeScreen /> */}
      {/* <RegisterScreen/> */}
      {/* <LoginScreen/> */}
      {/* <HomeScreen/> */}
      {/* <StatsScreen/> */}
      {/* <ViewOrdersScreen/> */}
      {/* <CalendarScreen/> */}
      <AddOrderScreen/>
      {/* <AddOrderFurtherDetailsScreen/> */}
      {/* <ViewReceiptScreen/> */}

    </SafeAreaView>

    // <RegisterScreen/>
  );
}
