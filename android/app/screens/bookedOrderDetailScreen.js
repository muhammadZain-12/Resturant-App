import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, ToastAndroid, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import Header from '../components/header';

function BookedOrderDetail({route, navigation}) {
  const data = route.params;



console.log(data,"data")

  const [bookingData, setBookingData] = React.useState([]);

  useEffect(() => {
    setBookingData({
      ...data,
      orderStatus: '',
    });
  }, [data]);

  
console.log(data,"data")

  const [orderStatus, setOrderStatus] = React.useState([
    {
      label: 'Order Received',
      orderStatus: 'isReceived',
      selected: true,
    },
    {
      label: 'Order Cooking',
      orderStatus: 'isCooking',
      selected: false,
    },
    {
      label: 'Rider is On the Way',
      orderStatus: 'RiderIsOnTheWay',
      selected: false,
    },
    {
      label: 'Order Delivered',
      orderStatus: 'isDelivered',
      selected: false,
    },
  ]);




useEffect(()=>{
        setOrderStatus(orderStatus.map((e,i)=>{
          if(e.orderStatus==data.orderStatus){
            return {
              ...e,
              selected : true
            }
          }
          else{
            return {
              ...e,
              selected:false
            }
          }
        }))
},[data])


  const changeOrderStatus = selectedOrderStatus => {
    setOrderStatus(
      orderStatus.map((e, i) => {
        if (e.label == selectedOrderStatus.label) {
          return {
            ...e,
            selected: true,
          };
        } else {
          return {
            ...e,
            selected: false,
          };
        }
      }),
    );
  };

  const RadioButton = useCallback(e => {
    console.log(e, 'ee');

    return (
      <View style={{flexDirection: 'row', width: '100%', marginTop: 10}}>
        <TouchableOpacity
          onPress={() => changeOrderStatus(e)}
          style={{
            backgroundColor: e.selected ? 'skyblue' : 'white',
            borderRadius: 110,
            width: 22,
            heigth: 30,
          }}></TouchableOpacity>
        <Text style={{marginLeft: 10, fontSize: 16}}>{e.label}</Text>
      </View>
    );
  }, [data]);

  console.log(data, 'datass');

  const submitOrderStatusInDb = () => {
    let selectedStatus = '';
    orderStatus.map((e, i) => {
      if (e.selected) {
        selectedStatus = e.orderStatus;
      }
    });

    bookingData.orderStatus = selectedStatus;
    setBookingData({
      ...data,
      orderStatus: selectedStatus,
    });

    database()
      .ref('booking/' + data.id)
      .set(bookingData)
      .then(success => {
        ToastAndroid.show(
          'Order Status Successfully Submitted',
          ToastAndroid.SHORT,
        );

        setTimeout(() => {
          navigation.navigate('orderBookedData',bookingData.id)
        }, 1000);


      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  return (
    <View
      style={{
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
        padding: 10,
        paddingHorizontal: 20
      }}>
      <ScrollView>
      <Header back navigation={navigation}  />
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            width: '90%',
            fontSize: 32,
            fontWeight: '800',
          }}>
          Booked Orders
        </Text>
      </View>

      <View style={{width: '100%', marginTop: 10}}>
        <Text style={{fontSize: 28, fontWeight: '700', color: 'white'}}>
          User Detail:
        </Text>
        <Text style={{fontSize: 16, fontWeight: '400'}}>
          User Name: {data.userData.username}
        </Text>
        <Text style={{fontSize: 16, fontWeight: '400'}}>
          User Email: {data.userData.email}
        </Text>
      </View>

      <View style={{width: '100%', marginTop: 10}}>
        <Text style={{fontSize: 28, fontWeight: '700', color: 'white'}}>
          Order Detail:
        </Text>
        {data.orderData.map((e, i) => {
          return (
            <Text style={{fontSize: 16, fontWeight: '400'}}>
              {e.count} {e.itemName ?? e.dealName} {e.itemSize}
            </Text>
          );
        })}
      </View>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: 'white',
          marginTop: 10,
        }}>
        Order Price:- Rs{data.orderPrice}/-
      </Text>

      <View style={{width: '100%', marginTop: 10}}>
        <Text style={{fontSize: 28, fontWeight: '700', color: 'white'}}>
          User Location:
        </Text>

        <Text style={{fontSize: 16, fontWeight: '400'}}>
          Longitude {data.orderLocation.coords.longitude}
        </Text>
        <Text style={{fontSize: 16, fontWeight: '400'}}>
          latitude {data.orderLocation.coords.latitude}
        </Text>

        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: 'white',
              marginTop: 10,
            }}>
            Order Status:-
          </Text>
          <Text style={{fontSize: 14, fontWeight: '400', textAlign: 'center'}}>
            submit Order Status so the user could know about his order status
          </Text>

          {orderStatus &&
            orderStatus.map((e, i) => {
              return e && RadioButton(e);
            })}

          <TouchableOpacity
            onPress={() => submitOrderStatusInDb()}
            style={{marginTop: 15, alignItems: 'center', width: '100%'}}>
            <Text
              style={{
                textAlign: 'center',
                width: '90%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'white',
                padding: 10,
              }}>
              Submit Order Status
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        </ScrollView>
    </View>
  );
}

export default BookedOrderDetail;
