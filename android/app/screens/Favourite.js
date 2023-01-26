import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

import React, {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ViewBase,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import pizza from '../assets/pizza.webp';
import coldDrink from '../assets/coldDrink.jpg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppModal from '../components/modal';
import Header from '../components/header';

function Favourite({navigation, route}) {
  const [favouriteData, setFavouriteData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('');
  const [reload, setReload] = useState(false);

  const initialData = {
    orderData: [],
    orderPrice: '',
    orderLocation: '',
    paymentMethod: '',
    userData: '',
  };

  const [bookingData, setBookingData] = React.useState(initialData);

  let data = route.params;

  useEffect(() => {
    if (data) {
      if (
        orderData &&
        orderData.length > 0 &&
        orderData.some((e, i) => e.id == data.id)
      ) {
        setOrderData(
          orderData.map((e, i) => {
            if (e.id == data.id) {
              return {
                ...e,
                count: e.count + 1,
              };
            } else {
              return e;
            }
          }),
        );
      } else {
        data.count = 1;
        setOrderData([...orderData, data]);
      }
    }
  }, [data]);

  const getUserData = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      setUserData(parsed);
    } catch (error) {
      console.log(error, 'user data not found');
    }
  };

  const getFavouriteData = () => {
    userData.id &&
      database()
        .ref('favourite/' + userData.id)
        .once('value', e => {
          let val = e.val();
          let values = Object.values(val);
          setFavouriteData(values);
        });
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getFavouriteData();
  }, [userData, reload]);

  const makeItemUnfavourite = item => {
    setFavouriteData(
      favouriteData &&
        favouriteData.length > 0 &&
        favouriteData.map((e, i) => {
          if (e.id == item.id) {
            return {
              ...e,
              favourite: e.favourite ? false : true,
            };
          } else {
            return e;
          }
        }),
    );

    database()
      .ref('favourite/' + `${userData.id}/` + item.id)
      .set({...item, favourite: false})
      .then(() => {
        console.log('item successfully unfavourite');
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  const getOrderItems = data => {
    let flag = orderData.some((e, i) => e.id == data.id);

    console.log(flag, 'flag');

    if (orderData && orderData.length > 0 && flag) {
      console.log(data, 'dataaaa');

      setOrderData(
        orderData.map((e, i) => {
          if (e.id == data.id) {
            return {
              ...e,
              count: e.count + 1,
            };
          } else {
            return e;
          }
        }),
      );
    } else {
      data.count = 1;
      setOrderData([...orderData, data]);
    }
  };

  const addItems = item => {
    setOrderData(
      orderData.map((e, i) => {
        if (e.id == item.id) {
          return {
            ...e,
            count: e.count + 1,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const lessItems = item => {
    console.log(item, 'items');

    if (item.count == 1) {
      setOrderData(
        orderData.filter((e, i) => {
          return e.id !== item.id;
        }),
      );
    } else {
      setOrderData(
        orderData.map((e, i) => {
          if (e.id === item.id) {
            return {
              ...e,
              count: e.count - 1,
            };
          } else {
            return e;
          }
        }),
      );
    }
  };

  const orderPlaceForBooking = () => {
    setVisibleModal(true);
  };

  const closeModal = paymentMethod => {
    if (paymentMethod) {
      setSelectedPaymentMethod(paymentMethod);

      bookingData.orderData = orderData;
      bookingData.orderPrice = b;
      bookingData.userData = userData;
      bookingData.paymentMethod = paymentMethod;

      paymentMethod == 'Cash on Delivery' &&
        navigation.navigate('mapScreen', bookingData);
      setOrderData([]);
      setBookingData(initialData);
      setVisibleModal(false);
    } else {
      setVisibleModal(false);
    }
  };

  const navigateToSingleScreen = e => {
    navigation.navigate('singleItem', e);
  };

  const RenderAllData = useCallback(
    e => {
      return (
        <TouchableOpacity
          style={{
            width: '49%',
            borderColor: 'black',
            alignItems: 'center',
            padding: 5,
            marginBottom: 5,
            borderRadius: 10,
          }}
          onPress={() => navigateToSingleScreen(e)}
        >
          <Image
            source={{uri: e.imageUri}}
            style={{
              width: 170,
              height: 120,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => makeItemUnfavourite(e)}
            style={{position: 'absolute', right: 15, top: 15}}
          >
            {<AntDesign name="heart" color="red" size={20} />}
          </TouchableOpacity>
          <View
            style={{
              width: 170,
              backgroundColor: 'gray',
              paddingBottom: 5,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              paddingTop: 3,
            }}
          >
            <Text
              style={{
                color: 'white',
                width: '90%',
                marginLeft: 8,
                fontWeight: '700',
                fontSize: 18,
              }}
              numberOfLines={1}
            >
              {e.dealName ? e.dealName : e.itemName}
            </Text>
            <Text
              style={{
                color: 'white',
                width: '100%',
                marginLeft: 8,
                fontSize: 16,
                fontWeight: '500',
              }}
              numberOfLines={1}
            >
              {e.dealPrice ? e.dealPrice : e.itemPrice}
            </Text>
            <View style={{alignItems: 'center', marginVertical: 5}}>
              <TouchableOpacity
                onPress={() => getOrderItems(e)}
                style={{
                  backgroundColor: 'black',
                  padding: 10,
                  borderRadius: 10,
                  width: '90%',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '700',
                  }}
                >
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [favouriteData, userData, orderData, reload],
  );

  let b = 0;

  orderData &&
    orderData.length >= 1 &&
    orderData.map((e, i) => {
      let a = 0;
      if (
        (e.itemPrice && e.itemPrice.includes('Rs')) ||
        (e.dealPrice &&
          e.dealPrice.includes('Rs') &&
          e.itemPrice &&
          e.itemPrice.length == 8) ||
        (e.dealPrice && e.dealPrice.length == 8)
      ) {
        a = e.itemPrice ? e.itemPrice.slice(3, 6) : e.dealPrice.slice(3, 6);
        b = b + Number(a) * e.count;
      } else if (
        (e.itemPrice && e.itemPrice.includes('Rs')) ||
        (e.dealPrice &&
          e.dealPrice.includes('Rs') &&
          e.itemPrice &&
          e.itemPrice.length == 9) ||
        (e.dealPrice && e.dealPrice.length == 9)
      ) {
        a = e.itemPrice ? e.itemPrice.slice(3, 7) : e.dealPrice.slice(3, 7);
        b = b + Number(a) * e.count;
      } else {
        b = b + Number(e.itemPrice ? e.itemPrice : e.dealPrice) * e.count;
      }
    });

  const SignOut = () => {
    navigation.navigate('login');
  };

  return (
    <ScrollView
      style={{width: '100%', height: '100%', backgroundColor: 'black'}}
    >
      <View
        style={{
          height: '10%',
          justifyContent: 'center',
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
      >
        <Header
          buttonOnRight
          onPress={SignOut}
          buttonTitle="Sign Out"
          textOnMiddle
          middleText="FAVOURITE"
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            color: 'white',
            fontWeight: '700',
            width: '70%',
          }}
        >
          FAVOURITE ITEMS
        </Text>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => setReload(!reload)}>
            <Icon name="reload1" color="white" size={25} />
          </TouchableOpacity>
          <Text>Tap to Reload</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          alignItems: 'center',
          backgroundColor: 'lightblue',
        }}
      >
        {orderData && orderData.length > 0 && (
          <Text
            style={{
              fontSize: 28,
              textAlign: 'center',
              fontWeight: '800',
              color: 'black',
            }}
          >
            Your Order
          </Text>
        )}
        {orderData &&
          orderData.length > 0 &&
          orderData.map((e, i) => {
            return (
              <TouchableOpacity
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderColor: 'skyblue',
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text numberOfLines={1} style={{color: 'black', fontSize: 18}}>
                  {' '}
                  {e.count} {e.itemName ?? e.dealName} {e.itemSize}{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '20%',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity onPress={() => addItems(e)}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: '800',
                      }}
                    >
                      {' '}
                      +{' '}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => lessItems(e)}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 20,
                        fontWeight: '800',
                      }}
                    >
                      {' '}
                      -{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        {orderData && orderData.length > 0 && (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View style={{marginTop: 5}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '800'}}>
                Total Bill: Rs {b}/-
              </Text>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 10,
                borderWidth: 1,
                backgroundColor: 'black',
                width: '90%',
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
              onPress={orderPlaceForBooking}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeigth: '600',
                  fontSize: 20,
                  textAlign: 'center',
                }}
              >
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {visibleModal && <AppModal close={closeModal} visible={visibleModal} />}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 20,
        }}
      >
        {favouriteData &&
          favouriteData.length > 0 &&
          favouriteData.map((e, i) => {
            if (e.favourite) {
              return RenderAllData(e);
            }
          })}
      </View>
    </ScrollView>
  );
}

export default Favourite;
