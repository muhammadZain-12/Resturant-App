import React from 'react';
import {View, Text, Image, TouchableOpacity, ToastAndroid, Alert} from 'react-native';
import pizza from '../assets/pizzaStore.png';
import auth from '@react-native-firebase/auth';
import Header from '../components/header';
import { BackHandler } from 'react-native';


function Admin({navigation, route}) {
  let [data] = route.params;

  const routeToOtherPage = route => {
    navigation.navigate(route);
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(success => {
        ToastAndroid.show('SignOut Successfully', ToastAndroid.SHORT);
        setTimeout(() => {
          navigation.navigate('login');
        }, 1000);
      });
  };

//   React.useEffect(() => {
//     navigation.addListener('beforeRemove', (e) => {
//         e.preventDefault();
//     });
// }, [navigation]);

  return (
    <View style={{flex: 1,backgroundColor:"black"}}>
      <Header buttonOnRight buttonTitle="SignOut" textOnMiddle middleText="Admin" onPress={signOut} />
      <View
        style={{
          width: '100%',
          height:"20%",
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            padding: 10,
            textAlign: 'center',
            fontWeight: '800',
            marginTop: 10,
            textTransform: 'capitalize',
            paddingHorizontal:20,
            
          }}
        >
          Welcome {data.username} !
        </Text>
        <Text style={{textAlign:"center",paddingHorizontal:20}} >
            Here You Can View Customer Bookings,Add Menu of your Resturant and also view your resturant menu
        </Text>
      </View>
      <View style={{width: '100%', alignItems: 'center', marginTop: 10,height:"50%"}}>
        <TouchableOpacity
          onPress={() => routeToOtherPage('orderBookedData')}
          style={{
            backgroundColor: 'skyblue',
            width: '90%',
            padding: 20,
            borderRadius: 10,
            marginBottom:20
          }}
        >
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            View Bookings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => routeToOtherPage('viewMenu')}
          style={{
            backgroundColor: 'skyblue',
            width: '90%',
            padding: 20,
            borderRadius: 10,
            marginTop: 10,
            marginBottom:20

          }}
        >
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            View Menu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => routeToOtherPage('addMenu')}
          style={{
            backgroundColor: 'skyblue',
            width: '90%',
            padding: 20,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
            }}
          >
            Add Menu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Admin;
