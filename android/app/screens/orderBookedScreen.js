import React from 'react';
import {View, Text, TouchableOpacity, ToastAndroid,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';


function OrderBookedScreen({route, navigation}) {
  let data = route.params;

  const [isConfirm,setIsConfirm] = React.useState(false)

console.log(data)

  const confirmDelivery = () => {
    setIsConfirm(true)
    data.customerConfimation  = true
    
    database().ref('booking/' + data.id).set(data).then(()=>{
        ToastAndroid.show("Delivery Has been successfully confirmed",ToastAndroid.SHORT)
    }).catch((error)=>{
        console.log(error)
    })
 
  }



  return (
    
    <View style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
    <ScrollView style={{height:"100%"}} >
    <View style={{height:"100%",width:"100%"}} >
      <View
        style={{
          width: '100%',
          
          alignItems: 'center',
          marginTop: 60,
          padding: 5,
        }}>
        <Icon size={100} color="yellow" name="smileo" />
        <Text
          style={{
            color: 'white',
            fontSize: 32,
            textAlign: 'center',
            marginTop: 10,
          }}>
          Congratulations
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 28,
            textAlign: 'center',
            fontWeight: '700',
          }}>
          {data.userData.username}
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            marginTop: 10,
          }}>
          {data.orderStatus == 'isDelivered'
            ? 'Your order has been Delivered'
            : 'You have successfully booked Your order'}
        </Text>
      </View>
      <View style={{marginTop: 20, padding: 10, paddingHorizontal: 20}}>
        <Text style={{color: 'white', fontSize: 24, fontWeight: '700'}}>
          Your Orders Items:
        </Text>
        {data.orderData.map((e, i) => {
          return (
            <Text style={{}}>
              {e.count} {e.itemName ?? e.dealName} {e.itemSize}{' '}
            </Text>
          );
        })}
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: '700',
            marginTop: 10,
          }}>
          Your Orders Amount:
        </Text>
        <Text style={{fontSize: 14}}> Rs {data.orderPrice}/- </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: '700',
            marginTop: 10,
          }}>
          Payment Method:
        </Text>
        <Text style={{fontSize: 14}}> {data.paymentMethod} </Text>
      </View>

      <View style={{padding: 10}}>
        {data.orderStatus && data.orderStatus == 'isCooking' ? (
          <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
            Dear customer Your order has been cooking you will be delivered your
            order soon
          </Text>
        ) : data.orderStatus == 'isReceived' ? (
          <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
            Dear customer Your order has been Received you will be delivered
            your order soon
          </Text>
        ) : data.orderStatus == 'RiderIsOnTheWay' ? (
          <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
            Rider is on the way You will be delivered your order soon{' '}
          </Text>) 
          :
           data.orderStatus == 'isDelivered' && data.customerConfimation || isConfirm ? (
          <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
          Dear Customer You have been Delivered Your Order and we have been received delivery confirmation by you
          </Text>
        ) : data.orderStatus == 'isDelivered' ? (
          <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
            {' '}
            Dear Customer You have been Delivered Your Order Kindly confirm to
            click the button below
          </Text>
        ) : (
          <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}}>
            Dear customer Your order has been Received you will be delivered
            your order soon
          </Text>
        )}
        {data.orderStatus == 'isDelivered' && !isConfirm && !data.customerConfimation ? (
          <TouchableOpacity onPress={confirmDelivery} style={{width: '100%', alignItems: 'center'}}>
            <Text
              style={{
                width: '50%',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '700',
                borderWidth: 1,
                borderColor: 'orange',
                padding: 10,
                borderRadius: 10,
                marginTop: 10,
              }}>
              Confirm
            </Text>
          </TouchableOpacity>
        )
        :
        data.orderStatus == "isDelivered" ?
        <Text style={{fontSize: 14, textAlign: 'center', marginTop: 10}} >
            You have successfully confirmed this order delivery
        </Text>
        :
        ""
        }
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('currentBooking', data.id)}
        style={{
          width: '100%',
          marginTop: 30,
          alignItems: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            borderWidth: 1,
            borderColor: 'white',
            width: '90%',
            padding: 14,
            borderRadius: 10,
          }}>
          Go to Booking Page
        </Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
    
  );
}

export default OrderBookedScreen;
