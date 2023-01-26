import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image,ScrollView} from 'react-native';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import pizza from '../assets/pizza.jpg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import avatar from '../assets/avatar.jpg';
import {ActivityIndicator} from 'react-native';
import database from '@react-native-firebase/database';
import Header from '../components/header';

function Profile({navigation}) {
  const [userData, setUserData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [userBookings, setUserBookings] = React.useState([]);
  const [mostItemsOrder, setMostItemsOrder] = React.useState(false);
  const [orderDatas, setOrderDatas] = React.useState([]);
  const [mostOrderedItem, setMostOrderedItem] = React.useState('');
  const [dealOrder, setDealOrder] = React.useState([]);
  const [mostDealItem, setMostDealItem] = React.useState([]);
  const [mostDealOrder, setMostDealOrder] = React.useState([]);
  const [pageReload,setPageReload] = React.useState(false)

  const displayData = async () => {
    try {
      let user = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(user);
      setUserData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  const bookingData = () => {
    database()
      .ref('booking')
      .once('value', e => {
        let val = e.val();
        let values = Object.values(val);

        let bookings = [];

        bookings = values.filter((e, i) => {
          return e.userData.email == userData.email;
        });

        setUserBookings(bookings);

        let item = [];
        let deal = [];
        bookings.forEach((e, i) => {
          e.orderData.map((value, index) => {
            value.itemName ? item.push(value) : deal.push(value);
          });

          setOrderDatas(item);
          setDealOrder(deal);
        });
      });
  };

  useEffect(() => {
    displayData();
  }, []);

  useEffect(() => {
    bookingData();
  }, [userData,pageReload]);

  const uploadImage = () => {
    launchImageLibrary('Photo', Response => {
      const Image = Response.assets[0];

      if (Image) {
        setLoading(true);
        storage()
          .ref(`userImages/${userData.email}`)
          .putFile(Image.uri)
          .then(e => {
            storage()
              .ref(`userImages/${userData.email}`)
              .getDownloadURL()
              .then(URL => {
                setUserData({...userData, imageUri: URL});
                setLoading(false);
              });
          });
      }
    });
  };

  useEffect(() => {
    !userData.imageUri &&
      storage()
        .ref(`userImages/${userData.email}`)
        .getDownloadURL()
        .then(URL => {
          setUserData({...userData, imageUri: URL});
        });
  }, [userData]);

  useEffect(() => {
    let bookings = [];
    let obj = {};

    orderDatas &&
      orderDatas.length > 0 &&
      orderDatas.map((e, i) => {
        let flag = bookings.some((value, index) => e.id == value.id);

        if (bookings && bookings.length > 0 && flag) {
          bookings = bookings.map((values, index) => {
            if (e.id == values.id) {
              return {
                ...values,
                count: e.count + values.count,
              };
            } else {
              return values;
            }
          });
        } else {
          obj = {
            itemName: e.itemName,
            id: e.id,
            itemSize: e.itemSize,
            count: e.count,
          };

          bookings.push(obj);
        }
      });

    setMostItemsOrder(bookings);
  }, [userBookings,pageReload]);

  useEffect(() => {
    let bookings = [];
    let obj = {};

    dealOrder &&
      dealOrder.length > 0 &&
      dealOrder.map((e, i) => {
        if (
          bookings &&
          bookings.length > 0 &&
          bookings.some((value, ind) => e.id == value.id)
        ) {
          bookings = bookings.map((values, index) => {
            if (values.id == e.id) {
              return {
                ...values,
                count: e.count + values.count,
              };
            } else {
              return values;
            }
          });
        } else {
          obj = {
            dealName: e.dealName,
            id: e.id,
            count: e.count,
          };

          bookings.push(obj);
        }

        setMostDealItem(bookings);
      });
  }, [userBookings,pageReload]);

  useEffect(() => {
    let count = 0;

    let a = [];

    mostItemsOrder &&
      mostItemsOrder.filter((e, i) => {
        if (e.count > count) {
          count = e.count;
          a = e;
        }
      });

    setMostOrderedItem(a);
  }, [mostItemsOrder,pageReload]);

  useEffect(() => {
    let count = 0;

    let a = [];

    mostDealItem &&
      mostDealItem.filter((e, i) => {
        if (e.count > count) {
          count = e.count;
          a = e;
        }
      });

    setMostDealOrder(a);
  }, [mostDealItem,pageReload]);


const routeToOtherPage = (route) => {
    navigation.navigate(route)
}

const SignOut = () => {
  navigation.navigate("login")
}

  return (
    <View style={{width: '100%', height: '100%', backgroundColor: '#000'}}>
      <ScrollView>      
      <View style={{height:'10%',justifyContent:"center",paddingHorizontal:10}} >
        <Header buttonOnRight onPress={SignOut} buttonTitle="Sign Out" textOnMiddle middleText="Profile" />
        </View>
      <View style={{padding: 15}}>
      
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}} >
        <Text style={{color: 'white', fontSize: 27, fontWeight: '800'}}>
          My Profile
        </Text>
        <TouchableOpacity style={{justifyContent:"center",alignItems:"center"}}  onPress={()=>setPageReload(!pageReload)} >
        <AntDesign name="reload1" size={25} color="white" />
        <Text> Double tap to reload</Text>
        </TouchableOpacity>
        </View>

        <View style={{marginTop: 10, flexDirection: 'row'}}>
          {loading ? (
            <View
              style={{
                width: 120,
                height: 120,
                borderWidth: 1,
                borderColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : userData.imageUri ? (
            <View>
              <Image
                source={{uri: userData.imageUri}}
                style={{width: 120, height: 120, borderRadius: 20}}
              />
              <TouchableOpacity
                onPress={uploadImage}
                style={{position: 'relative', top: -23, left: 100}}>
                <AntDesign size={30} name="camera" color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Image
                source={avatar}
                style={{width: 120, height: 120, borderRadius: 20}}
              />
              <TouchableOpacity
                onPress={uploadImage}
                style={{position: 'relative', top: -23, left: 100}}>
                <AntDesign size={30} name="camera" color="white" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{marginLeft: 20, justifyContent: 'center', height: 120}}>
            <Text style={{color: 'white', fontSize: 24, fontWeight: '700'}}>
              {userData.username}
            </Text>
            <Text style={{fontSize: 18, fontWeight: '600'}}>
              {userData.email}
            </Text>
          </View>
        </View>

        <View>
          <Text style={{fontSize: 22, color: 'white'}}>ORDER BOOKINGS :</Text>
          <Text style={{fontSize: 16, marginTop: 5}}>
            TOTAL ORDERS : {userBookings.length} ORDERS
          </Text>
          <Text style={{fontSize: 22, color: 'white', marginTop: 20}}>
            FAVOURITE ITEMS :
          </Text>
          <Text style={{fontSize: 16, marginTop: 5}}>
            MOST ORDERED ITEM : {mostOrderedItem.itemName}{' '}
            {mostOrderedItem.itemSize}
          </Text>
          <Text style={{fontSize: 16, marginTop: 5}}>
            FAVOURITE ITEM ORDER COUNT : {mostOrderedItem.count}
          </Text>
          <Text style={{fontSize: 22, color: 'white', marginTop: 20}}>
            FAVOURITE DEAL :
          </Text>
          <Text style={{fontSize: 16, marginTop: 5}}>
            MOST ORDERED DEAL : {mostDealOrder.dealName}
          </Text>
          <Text style={{fontSize: 16, marginTop: 5}}>
            FAVOURITE DEAL ORDER COUNT : {mostDealOrder.count}
          </Text>
        </View>

        <View style={{width:"100%",alignItems:"center",marginTop:20}} >
        <TouchableOpacity onPress={()=>routeToOtherPage('currentBooking')} style={{width:"90%",padding:20,borderWidth:1,borderColor:"white",borderRadius:10,alignItems:"center",justifyContent:"space-between",flexDirection:"row"}} >
            <Text style={{width:"80%"}} >SEE BOOKINGS</Text>
            <AntDesign name="right" size={20}   />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>routeToOtherPage('favourite')} style={{width:"90%",padding:20,borderWidth:1,borderColor:"white",borderRadius:10,alignItems:"center",justifyContent:"space-between",flexDirection:"row",marginTop:15,marginBottom:10}} >
            <Text style={{width:"80%"}} >Go TO FAVOURITE</Text>
            <AntDesign name="right" size={20}   />
        </TouchableOpacity>

    </View>
      </View>
    </ScrollView>
    </View>
  );
}

export default Profile;
