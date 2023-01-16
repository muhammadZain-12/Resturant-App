import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import database from '@react-native-firebase/database';
import Header from '../components/header';
import AntDesign from 'react-native-vector-icons/AntDesign';

function OrderBookingData({navigation, route}) {
  const [bookingData, setBookingData] = React.useState([]);
  const [reload, setReload] = React.useState(false);

  const data = route.params;

  useEffect(() => {
    database()
      .ref('booking')
      .once('value', e => {
        let val = e.val();
        let values = Object.values(val);
        setBookingData(values);
      });
  }, [data]);

  const renderItem = items => {
    const {item, index} = items;
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('bookedOrderDetailScreen', item)}
        style={{
          width: '100%',
          borderWidth: 1,
          borderColor: 'white',
          padding: 10,
          flexDirection: 'row',
          marginTop: 10,
          borderRadius: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '400'}}>
            {index + 1})
          </Text>
          <View style={{marginLeft: 10}}>
            <Text style={{color: 'white', fontSize: 18, fontWeight: '800'}}>
              {item.userData.username}
            </Text>

            <Text style={{color: 'white', fontSize: 18}}>
              {item.userData.email}
            </Text>
            <Text style={{color: 'orange', fontSize: 18}}>
              {item.orderStatus ?? 'No Status Updated Yet'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('bookedOrderDetailScreen', item)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="right" color="skyblue" size={25} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        padding: 10,
        alignItems: 'center',
      }}>
      <Header back navigation={navigation} />
      <ScrollView>
        <View style={{width: '100%'}}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 28,
              fontWeight: '700',
            }}>
            Booking Data
          </Text>
          <Text style={{textAlign: 'center', fontSize: 14, fontWeight: '700'}}>
            Here you can see the user order booking and proceed their order to
            make them delivered.
          </Text>
        </View>
        <View style={{width: '90%', height: '100%', alignItems: 'center'}}>
          <FlatList
            data={bookingData}
            renderItem={renderItem}
            keyExtractor={(item, index) => item + index}
            style={{width:"98%"}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default OrderBookingData;
