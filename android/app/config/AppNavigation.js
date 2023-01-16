import React from 'react';
import {View, Text, Button, ToastAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/login';
import Signup from '../screens/signUp';
import Admin from '../screens/admin';
import AddMenu from '../screens/addMenu';
import AddItems from '../screens/addItem';
import AddDeals from '../screens/addDeals';
import ViewMenu from '../screens/viewMenu';
import MenuItemDetail from '../screens/menuItemDetail';
import SingleItem from '../screens/singleItemScreen';
import MapScreen from '../screens/mapScreen';
import OrderBookedScreen from '../screens/orderBookedScreen';
import OrderBookingData from '../screens/bookingData';
import BookedOrderDetail from '../screens/bookedOrderDetailScreen';
import TabStack from './tabNavigator';




const Stack = createNativeStackNavigator();




function AppNavigation () {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='login' >
          <Stack.Screen
            options={{headerShown: false}}
            name="login"
            component={Login}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="signUp"
            component={Signup}
          />
          <Stack.Screen name="admin" component={Admin} />
          <Stack.Screen
            name="tabStack"
            component={TabStack}
            options={{
              headerStyle: {backgroundColor: 'black'},
              title: 'Home',
              headerTintColor: 'white',

            }}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="addMenu"
            component={AddMenu}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="addItem"
            component={AddItems}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="addDeal"
            component={AddDeals}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="viewMenu"
            component={ViewMenu}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="menuItemDetail"
            component={MenuItemDetail}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="singleItem"
            component={SingleItem}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="mapScreen"
            component={MapScreen}
          />
            <Stack.Screen
            options={{headerShown: false}}
            name="orderBooked"
            component={OrderBookedScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="orderBookedData"
            component={OrderBookingData}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="bookedOrderDetailScreen"
            component={BookedOrderDetail}
          />
            
        </Stack.Navigator>


          



      </NavigationContainer>
    </>
  );
};

export default AppNavigation;
