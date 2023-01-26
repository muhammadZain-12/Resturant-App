import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import database from '@react-native-firebase/database';
import {TabView, SceneMap} from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../components/header';

function CurrentBookings({navigation, route}) {
  const [currentBooking, setCurrentBooking] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [userData, setUserData] = useState([]);
  const layout = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [routeData, setRouteData] = useState('');
  const [routes] = useState([
    {
      key: 'first',
      title: 'Current Bookings',
    },
    {
      key: 'second',
      title: 'Previous Bookings',
    },
  ]);

  let data = route.params;

  useEffect(() => {
    setRouteData(data);
    data = '';
  }, [data]);

  const getUserData = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      setUserData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  const getBookingData = () => {
    setIsLoading(true);
    setRouteData('');
    database()
      .ref('booking')
      .once('value', e => {
        let val = e.val();
        let value = Object.values(val);

        setCurrentBooking(
          value.filter((e, i) => {
            if (e.userData.email == userData.email) {
              return e.orderStatus !== 'isDelivered';
            }
          }),
        );

        setPreviousBookings(
          value.filter((e, i) => {
            if (e.userData.email == userData.email)
              return e.orderStatus == 'isDelivered';
          }),
        );
      });
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);
  useEffect(() => {
    getBookingData();
  }, [userData, routeData]);


  const SignOut = () => {
    navigation.navigate("login")
  }

  const firstRoute = useCallback(() => {
    const renderItem = items => {
      const {index, item} = items;

      return (
        <TouchableOpacity
          style={{
            width: '100%',
            marginTop: 15,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'gray',
            padding: 20,
            borderRadius: 10,
            justifyContent: 'space-between',
            backgroundColor: '#115544',
          }}
          onPress={() => navigation.navigate('orderBooked', item)}>
          <View style={{flexDirection: 'row', width: '60%'}}>
            <Text style={{color: 'white'}}>{index + 1}) </Text>

            <Text style={{color: 'white', marginLeft: 10}}>
              <Text style={{color: 'orange'}}>Status:</Text>{' '}
              {item.orderStatus ?? 'Not Updated'}
            </Text>
          </View>
          <Text style={{color: 'white', marginLeft: 10, color: 'orange'}}>
            Rs {item.orderPrice}/-
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('orderBooked', item)}>
            <AntDesign name="right" size={20} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    };

    return currentBooking && currentBooking.length > 0 ? (
      <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
        <FlatList
          data={currentBooking}
          renderItem={renderItem}
          keyExtractor={data => data.id}
          style={{width: '95%', marginTop: 20}}
        />
      </View>
    ) : (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{textTransform: 'capitalize', color: 'white', fontSize: 24}}>
          There are no current Bookings
        </Text>
      </View>
    );
  }, [currentBooking, previousBookings]);

  const secondRoute = useCallback(() => {
    const renderItem = items => {
      const {index, item} = items;

      return (
        <TouchableOpacity
          style={{
            width: '100%',
            marginTop: 15,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'gray',
            padding: 20,
            borderRadius: 10,
            justifyContent: 'space-between',
            backgroundColor: '#115544',
          }}
          onPress={() => navigation.navigate('orderBooked', item)}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'white'}}>{index + 1}) </Text>
            <Text style={{color: 'white', marginLeft: 10}}>
              {item.customerConfimation
                ? 'Delivery Confirmed'
                : 'Delivery Not Confirmed'}
            </Text>
          </View>
          <Text style={{color: 'white', marginLeft: 10, color: 'orange'}}>
            Rs {item.orderPrice}/-
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('orderBooked', item)}>
            <AntDesign name="right" size={20} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    };

    return previousBookings && previousBookings.length > 0 ? (
      <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
        <FlatList
          data={previousBookings}
          renderItem={renderItem}
          keyExtractor={data => data.id}
          style={{width: '90%', marginTop: 20}}
        />
      </View>
    ) : (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: '700', color: 'white'}}>
          There is no Previous Bookings
        </Text>
      </View>
    );
  }, [previousBookings, currentBooking]);

  const renderScene = SceneMap({
    first: firstRoute,
    second: secondRoute,
  });

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={200} color="black" />
    </View>
  ) : (
    <View style={{backgroundColor: 'black', width: '100%', height: '100%'}}>
          <View style={{height:'10%',justifyContent:"center",paddingHorizontal:10,marginBottom:20}} >
        <Header buttonOnRight onPress={SignOut} buttonTitle="Sign Out" textOnMiddle middleText="BOOKINGS" />
        </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={state => {
          let {
            navigationState: {routes},
          } = state;
          return (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                borderBottomWidth: 1,
                justifyContent: 'space-around',
                borderBottomColor: '#424359',
              }}>
              {routes.map((item, i) => (
                <TouchableOpacity
                  onPress={() => setIndex(i)}
                  style={{
                    height: 40,
                    paddingHorizontal: 20,
                    marginBottom: -2.5,
                    borderBottomColor: 'gray',
                    flexDirection: 'row',
                    borderBottomWidth: index == i ? 5 : 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  key={i}>
                  <Text
                    style={{marginLeft: 10}}
                    color={index == i ? 'gray' : '#424359'}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        }}
      />
    </View>
  );
}

export default CurrentBookings;
