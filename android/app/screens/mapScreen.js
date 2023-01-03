import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';

function MapScreen({route, navigation}) {
  const data = route.params;

  const [orderBookingData, setOrderBookingData] = React.useState([]);
  const [location, setLocation] = React.useState('');

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(e => setLocation(e));
  };

  const getBookingData = () => {
    setOrderBookingData(data);
    !location && getUserLocation();
  };
  useEffect(() => {
    getBookingData();
  }, []);

  const confirmBooking = () => {
    data.orderLocation = location;
    data.id = database().ref().push().key;
    database()
      .ref('booking/' + data.id)
      .set(data)
      .then(success => {
        ToastAndroid.show(
          'Your Booking Done You will be given your delivery soon ',
          ToastAndroid.SHORT,
        );

        
        setTimeout(() => {
          navigation.navigate('orderBooked',data);
          
        }, 1000);
      })
      .catch(error => {
        console.log(error);
      });
  };

  

  return (
    location && 
    <View style={{width: '100%', height: '100%'}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={{
          longitude: location && location.coords.longitude,
          latitude: location && location.coords.latitude,
          latitudeDelta: location && 0.6,
          longitudeDelta: location && 0.5,
        }}
        showsCompass={false}
        style={{width: '100%', height: '90%'}}>
        <Marker
          coordinate={{
            longitude: location && location.coords.longitude,
            latitude: location && location.coords.latitude,
            latitudeDelta: location && 0.5,
            longitudeDelta: location && 0.4,
          }}
        />
      </MapView>
      <TouchableOpacity
        onPress={confirmBooking}
        style={{width: '100%', alignItems: 'center', marginTop: 10}}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            width: '90%',
            backgroundColor: 'black',
            padding: 15,
            borderRadius: 10,
          }}>
          Confirm My Booking
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default MapScreen;
