import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Text, View, Platform, Image} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './src/screens/Profile';
import HistoryScreen from './src/screens/History';
import LoginScreen from './src/screens/LogIn';
import SignUpScreen from './src/screens/SignUp';
import HomeScreen from './src/screens/Home';
import Saved from './src/screens/Saved';
import ProfileInfoScreen from './src/screens/ProfileInfo';
import CreatePostingScreen from './src/screens/CreatePosting';
import ListingDetailsScreen from './src/screens/ListingDetails';
import ChatScreen from './src/screens/ChatScreen';
import CardFormScreen from './src/screens/CardFormScreen';
import Checkout from './src/screens/Checkout';
import ThankYou from './src/screens/ThankYou';

enableScreens();

const HomeStack = createStackNavigator();

function Home() {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="ListingDetails"
        component={ListingDetailsScreen}
      />
      <HomeStack.Screen name="Checkout" component={Checkout} />
      <HomeStack.Screen name="CardFormScreen" component={CardFormScreen} />
      <HomeStack.Screen name="ThankYou" component={ThankYou} />
    </HomeStack.Navigator>
  );
}

const SavedStack = createStackNavigator();

function SavedScreen() {
  return (
        <SavedStack.Navigator
          initialRouteName='Saved'
          screenOptions={{
            headerShown: false,
          }}
        >
          <SavedStack.Screen name='Saved' component={Saved} />
          <SavedStack.Screen name='ListingDetails' component={ListingDetailsScreen} />
        </SavedStack.Navigator>
  );
}

function CreateScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="CreatePosting"
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="CreatePosting" component={CreatePostingScreen} />
    </HomeStack.Navigator>
  );
}

function FeedScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Feed!</Text>
    </View>
  );
}

const ProfileStack = createNativeStackNavigator();
function Profile() {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="History" component={HistoryScreen} />
      <ProfileStack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
    </ProfileStack.Navigator>
  );
}

const SignUpLoginStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <SignUpLoginStack.Navigator
          initialRouteName="SignUpScreen"
          screenOptions={{headerShown: false}}>
          <SignUpLoginStack.Screen name="SignUp" component={SignUpScreen} />
          <SignUpLoginStack.Screen
            name="LogIn"
            component={LoginScreen}
            options={{title: 'Checkout'}}
          />
        </SignUpLoginStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: '#FFF0CA',
        inactiveBackgroundColor: '#FFF0CA',
        style: {
          backgroundColor: '#FFF0CA'
        }
      }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/assets/HomeF.png')
                    : require('./src/assets/Home.png')
                }
                style={{
                  width: '60%',
                  height: '60%',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/assets/SavedF.png')
                    : require('./src/assets/Saved.png')
                }
                style={{
                  width: '60%',
                  height: '60%',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Create"
          component={CreateScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <Image
                source={require('./src/assets/Create.png')}
                style={{
                  width: Platform.OS === 'ios' ? 70 : 60,
                  height: Platform.OS === 'ios' ? 70 : 60,
                  resizeMode: 'contain',
                  marginTop: Platform.OS === 'ios' ? 0 : -5,
                }}
              />
            ),
          }}
        />
        {/* <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/assets/NotificationF.png')
                    : require('./src/assets/Notification.png')
                }
                style={{
                  width: '60%',
                  height: '60%',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
              />
            ),
          }}
        /> */}
         <Tab.Screen
          name="Feed"
          component={ChatScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/assets/NotificationF.png')
                    : require('./src/assets/Notification.png')
                }
                style={{
                  width: '60%',
                  height: '60%',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('./src/assets/ProfileF.png')
                    : require('./src/assets/Profile.png')
                }
                style={{
                  width: '60%',
                  height: '60%',
                  resizeMode: 'contain',
                  marginTop: 20,
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
