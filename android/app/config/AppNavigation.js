import React from "react";
import { View,Text,Button, ToastAndroid } from "react-native";
import  {NavigationContainer}  from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "../screens/login";
import Signup from "../screens/signUp";
import Admin from "../screens/admin";
import User from "../screens/user";
import AddMenu from "../screens/addMenu";
import AddItems from "../screens/addItem";
import AddDeals from "../screens/addDeals";
import ViewMenu from "../screens/viewMenu";
import MenuItemDetail from "../screens/menuItemDetail";
import auth from "@react-native-firebase/auth";
import SingleItem from "../screens/singleItemScreen";

const Stack = createNativeStackNavigator();


const AppNavigation   = ({navigation}) => {
  

const signOut = () => {
  auth().signOut().then(()=>{
    ToastAndroid.show("Sign Out Successfully",ToastAndroid.SHORT)

  })
}



    return (
        <>
 
        <NavigationContainer>


 

 

        <Stack.Navigator>



          <Stack.Screen options={{headerShown:false}}  name="login" component={Login} />
          <Stack.Screen options={{headerShown:false}}  name="signUp" component={Signup} />
          <Stack.Screen   name="admin" component={Admin} />
          <Stack.Screen   name="user" component={User} options={{headerStyle:{backgroundColor:"black"},title:"Home",headerTintColor: 'white', headerRight: () => (
            <Button
              onPress={signOut}
              title="Sign Out"
              color="black"
            />
          ),}} />
          <Stack.Screen options={{headerShown:false}}  name="addMenu" component={AddMenu} />
          <Stack.Screen options={{headerShown:false}}  name="addItem" component={AddItems} />
          <Stack.Screen options={{headerShown:false}}  name="addDeal" component={AddDeals} />
          <Stack.Screen options={{headerShown:false}}  name="viewMenu" component={ViewMenu} />
          <Stack.Screen options={{headerShown:false}}  name="menuItemDetail" component={MenuItemDetail} />
          <Stack.Screen options={{headerShown:false}}  name="singleItem" component={SingleItem} />
        </Stack.Navigator>
      </NavigationContainer>
      </>
    );
  };

  export default AppNavigation