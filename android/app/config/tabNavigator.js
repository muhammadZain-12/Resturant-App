import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Profile from '../screens/profile';
import User from '../screens/user';
import CurrentBookings from '../screens/currentBooking';
import Favourite from '../screens/Favourite';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Reviews from '../screens/reviews';



const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {backgroundColor: 'black', padding: 5},
        tabBarInactiveTintColor: 'white',
        tabBarActiveTintColor: 'blue',
      }}>
      <Tab.Screen
        name="user"
        component={User}
        options={{
          tabBarIcon: ({color, size}) => {
            return <AntDesign name="home" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => {
            return <AntDesign name="user" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="currentBooking"
        component={CurrentBookings}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Entypo name="bowl" color={color} size={size} />;
          },
        }}
      />
            <Tab.Screen
        name="favourite"
        component={Favourite}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Entypo name="heart" color={color} size={size} />;
          },
        }}
      />
      {/* <Tab.Screen
        name="reviews"
        component={Reviews}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Entypo name="star" color={color} size={size} />;
          },
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default TabStack;
