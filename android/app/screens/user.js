import React, {useCallback, useEffect} from 'react';
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
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';
import pizza from '../assets/pizza.webp';
import coldDrink from '../assets/coldDrink.jpg';
import AppModal from '../components/modal';
import AntDesign from "react-native-vector-icons/AntDesign"


function User({navigation, route}) {
  let data = route.params;

  
  const [userData, setUserData] = React.useState([]);
  const [itemCategory, setItemCategory] = React.useState({
    title: '',
    active: false,
  });
  const [mainCategory, setMainCategory] = React.useState({
    items: false,
    deals: false,
  });

  const [dealName, setDealName] = React.useState([]);
  const [allCategory, setAllCategory] = React.useState([]);
  const [itemData, setItemData] = React.useState([]);
  const [dealData, setDealData] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const [width, setWidth] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [orderData, setOrderData] = React.useState([]);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('');
  const [favouriteItems,setFavouriteItems] = React.useState([])
  
  const initialData = {
    orderData: [],
    orderPrice: '',
    orderLocation: '',
    paymentMethod: '',
    userData: '',
  };

  console.log(userData,"user")

  const [bookingData, setBookingData] = React.useState(initialData);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        const {uid} = user;
        setUserData({...userData,id:uid})

        database()
          .ref('users/' + uid)
          .once('value', e => {
            let val = e.val();
            setUserData(val);
          });
      } else {
        navigation.navigate('login');
      }
    });
  }, []);

  useEffect(() => {
    let widths = Dimensions.get('window').width;
    setWidth(widths);
  }, []);

  useEffect(() => {
    console.log(data, 'dataaaa');
    if (
      data &&
      orderData &&
      orderData.length > 0 &&
      orderData.some((e, i) => e.id == data.id)
    ) {
      setOrderData(
        orderData.map((e, i) => {
          console.log(e, 'eeee');
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
      if ((data && data.itemName) || (data && data.dealName)) {
        data.count = 1;
        setOrderData([...orderData, data]);
      }
    }
  }, [data]);


  useEffect(()=>{
      userData.id && database().ref('favourites/' + userData.id).once('value',(e)=>{
        let val = e.val()
        let values = Object.values(val)
        setFavouriteItems(values)
      })
  },[userData,favouriteItems])




  const getCategoryFromDb = () => {
    database()
      .ref('items')
      .once('value', e => {
        let val = e.val();

        let allItemData = Object.entries(val).map(([key, value]) => {
          value.id = key;
          return value;
        });
        setItemData(allItemData);

        val = Object.values(val);

        let category = val.map((e, i) => {
          return e.itemCategory;
        });
        category = [...new Set([...category])];

        let a = [];

        category.map((e, i) => {
          b = {};
          b.title = e;
          b.active = false;
          a.push(b);
        });
        setItemCategory(a);
      });
  };

console.log(userData,"user")

  const getDealsFromDb = () => {
    database()
      .ref('Deals')
      .once('value', e => {
        let val = e.val();

        let allDealData = Object.entries(val).map(([key, value]) => {
          value.id = key;
          return value;
        });
        setDealData(allDealData);

        val = Object.values(val);

        let category = val.map((e, i) => {
          return e.dealName;
        });
        category = [...new Set([...category])];

        let a = [];

        category.map((e, i) => {
          b = {};
          b.title = e;
          b.active = false;
          a.push(b);
        });
        setDealName(a);
      });
  };

  useEffect(() => {
    getCategoryFromDb();
    getDealsFromDb();
  }, []);

  useEffect(() => {
    let a = [];
    itemCategory &&
      itemCategory.length > 0 &&
      itemCategory.map((e, i) => {
        a.push(e);
      });
    let b = [];
    b = [...a, ...dealName];

    setAllCategory(b);

    setAllData([...itemData, ...dealData]);
  }, [dealName, dealData]);

  const activeItem = item => {
    setItemCategory(
      itemCategory.map((e, i) => {
        if (item.title == e.title) {
          return {
            ...e,
            active: e.active ? false : true,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const activeDeals = item => {
    setDealName(
      dealName.map((e, i) => {
        if (item.title == e.title) {
          return {
            ...e,
            active: e.active ? false : true,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const activeAllCategory = item => {
    setAllCategory(
      allCategory.map((e, i) => {
        if (item.title == e.title) {
          return {
            ...e,
            active: e.active ? false : true,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          mainCategory.items
            ? activeItem(item)
            : mainCategory.deals
            ? activeDeals(item)
            : activeAllCategory(item)
        }
        style={{
          width: mainCategory.deals ? 180 : mainCategory.items ? 120 : 180,
          borderWidth: 1,
          borderRadius: 20,
          padding: 10,
          backgroundColor: item.active ? '#8888ee' : 'black',
        }}>
        <Text
          style={{color: item.active ? 'black' : 'white', textAlign: 'center'}}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectMainCategory = selectedCategory => {
    if (selectedCategory == 'items') {
      setMainCategory({
        ...mainCategory,
        items: mainCategory.items ? false : true,
        deals: false,
      });
    } else {
      setMainCategory({
        ...mainCategory,
        deals: mainCategory.deals ? false : true,
        items: false,
      });
    }
  };

  let index = 0;

  const getOrderFromUser = item => {
    console.log(item, 'item');
    let flag = orderData.some((e, i) => {
      console.log(e.id, item.id);
      return e.id == item.id;
    });

    if (orderData && orderData.length > 0 && flag) {
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
    } else {
      if (item) {
        item.count ? item.count + 1 : (item.count = 1);

        setOrderData([...orderData, item]);
      }
    }
  };

  const addItems = item => {
    console.log(item);

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
    if (item.count == 1) {
      setOrderData(
        orderData.filter((e, i) => {
          return e.id !== item.id;
        }),
      );
    } else {
      setOrderData(
        orderData.map((e, i) => {
          if (e.id == item.id) {
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

  console.log(userData,"user")

const submitFavouriteItem = (item) => {

                if(favouriteItems && favouriteItems.length>0 && favouriteItems.some((e,i)=>e.id == item.id)){

                  setFavouriteItems(favouriteItems.map((e,i)=>{
                    console.log(e,"ffff")
                   if(item.itemName == e.itemName) {
                     return {
                       ...e,
                       favourite : e.favourite?false : true
                     }
                   }
                   else {
                     return e
                   }
                  }))
                }

                else{
                  item.favourite = true
                  setFavouriteItems([...favouriteItems,item])
                }

          //      console.log(item,"itemssss")

          //    if(favouriteItems && favouriteItems.length>0){
          //      item = favouriteItems.map((e,i)=>{
                
          //       if(e.itemName==item.itemName){
          //         console.log(e,"eeee")
          //         return {
          //           ...e,
          //           favourite : e.favourite?false: true
          //         }
          //       }
          //      })  
          //    }

          //  else{
          //  item.favourite = true
          // }

          // database().ref('favourite/' +  `${userData.id}/` + item.id ).set(item).then(()=>{
                   
          //   }).catch((error)=>{
          //     console.log(error)
          //   })
          

}


  const RenderAllData = useCallback(
    e => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('singleItem', e)}
          style={{
            width: '49%',
            borderColor: 'black',
            alignItems: 'center',
            padding: 5,
            marginBottom: 5,
            borderRadius: 10,
          }}>
          <Image
            source={e.itemCategory == 'Cold drink' ? coldDrink : pizza}
            style={{
              width: 170,
              height: 120,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <TouchableOpacity onPress={()=>submitFavouriteItem(e)} style={{position:"absolute",right:15,top:15}} >
          {favouriteItems && favouriteItems.length>0 ? favouriteItems.map((item,i)=>{
            if(e.itemName == item.itemName){
          return <AntDesign name="heart" color="white" size={20} />

            }
            else{
             return  <AntDesign name="heart" color="red" size={20} />
            }
          })
          :
              <AntDesign name="heart" color="white" size={20} />

          
          }
          </TouchableOpacity>
          <View
            style={{
              width: 170,
              backgroundColor: 'gray',
              paddingBottom: 5,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              paddingTop: 3,
            }}>
            <Text
              style={{
                color: 'white',
                width: '90%',
                marginLeft: 8,
                fontWeight: '700',
                fontSize: 18,
              }}
              numberOfLines={1}>
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
              numberOfLines={1}>
              {e.dealPrice ? e.dealPrice : e.itemPrice}
            </Text>
            <View style={{alignItems: 'center', marginVertical: 5}}>
              <TouchableOpacity
                onPress={() => getOrderFromUser(e)}
                style={{
                  backgroundColor: 'black',
                  padding: 10,
                  borderRadius: 10,
                  width: '90%',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: '700',
                  }}>
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [allData, orderData],
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

  const orderPlaceForBooking = () => {
    setVisibleModal(true);
  };

  if (bookingData.orderData.length > 0) {
    console.log('myname');
  }

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

  return (
    <View>
      <ScrollView>
        <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
          <View
            style={{
              width: '90%',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TextInput
              style={{width: '80%', color: 'black', fontSize: 18}}
              placeholder="What do you want?"
              placeholderTextColor="black"
              onChangeText={setInputValue}
            />
            <TouchableOpacity>
              <Icon name="search1" size={30} color={'black'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              margin: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => selectMainCategory('items')}
              style={{
                width: 120,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                marginLeft: 10,
                backgroundColor: mainCategory.items ? '#8888ee' : 'black',
              }}>
              <Text
                style={{
                  color: mainCategory.items ? 'black' : 'white',
                  textAlign: 'center',
                }}>
                ITEMS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectMainCategory('deals')}
              style={{
                width: 120,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                marginLeft: 10,
                backgroundColor: mainCategory.deals ? '#8888ee' : 'black',
              }}>
              <Text
                style={{
                  color: mainCategory.deals ? 'black' : 'white',
                  textAlign: 'center',
                }}>
                DEALS
              </Text>
            </TouchableOpacity>
          </View>
          {mainCategory.items ? (
            <FlatList
              data={itemCategory}
              horizontal={true}
              renderItem={renderItem}
              style={{marginTop: 10, width: '100%', marginLeft: 20}}
            />
          ) : mainCategory.deals ? (
            <FlatList
              data={dealName}
              horizontal={true}
              renderItem={renderItem}
              style={{marginTop: 10, width: '100%', marginLeft: 20}}
            />
          ) : allCategory && allCategory.length > 0 ? (
            <FlatList
              data={allCategory}
              horizontal={true}
              renderItem={renderItem}
              style={{marginTop: 10, width: '100%', marginLeft: 20}}
            />
          ) : (
            <ActivityIndicator color="green" size={300} />
          )}
        </View>

        <View
          style={{
            marginTop: 10,
            alignItems: 'center',
            backgroundColor: 'lightblue',
          }}>
          {orderData && orderData.length > 0 && (
            <Text
              style={{
                fontSize: 28,
                textAlign: 'center',
                fontWeight: '800',
                color: 'black',
              }}>
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
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{color: 'black', fontSize: 18}}>
                    {' '}
                    {e.count} {e.itemName ?? e.dealName} {e.itemSize}{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '20%',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity onPress={() => addItems(e)}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 20,
                          fontWeight: '800',
                        }}>
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
                        }}>
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
                onPress={orderPlaceForBooking}>
                <Text
                  style={{
                    color: 'white',
                    fontWeigth: '600',
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  Place Order
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {visibleModal && <AppModal close={closeModal} visible={visibleModal} />}

        {mainCategory.items ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                width: '96%',
                height: '100%',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              {itemCategory &&
                itemCategory.length > 0 &&
                itemCategory.map((e, i) => {
                  if (e.active) {
                    return (
                      itemData &&
                      itemData.map((value, ind) => {
                        if (value.itemCategory === e.title) {
                          if (inputValue && inputValue.length > 0) {
                            if (
                              value.itemName.includes(inputValue) ||
                              value.itemCategory.includes(inputValue)
                            ) {
                              return RenderAllData(value);
                            }
                          } else {
                            return RenderAllData(value);
                          }
                        }
                      })
                    );
                  } else if (!e.active) {
                    index = index + 1;
                  }

                  if (index == itemCategory.length) {
                    index = 0;
                    return (
                      itemData &&
                      itemData.map((e, i) => {
                        if (inputValue) {
                          if (
                            e.itemName.includes(inputValue) ||
                            e.itemCategory.includes(inputValue)
                          ) {
                            return RenderAllData(e);
                          }
                        } else {
                          return RenderAllData(e);
                        }
                      })
                    );
                  }
                })}
            </View>
          </View>
        ) : mainCategory.deals ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                width: '96%',
                height: '100%',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              {dealName &&
                dealName.length > 0 &&
                dealName.map((e, i) => {
                  if (e.active) {
                    return (
                      dealData &&
                      dealData.length > 0 &&
                      dealData.map((value, ind) => {
                        if (e.title == value.dealName)
                          if (inputValue) {
                            if (value.dealName.includes(inputValue)) {
                              return RenderAllData(value);
                            }
                          } else {
                            return RenderAllData(value);
                          }
                      })
                    );
                  } else if (!e.active) {
                    index = index + 1;
                  }

                  if (index == dealName.length) {
                    return (
                      dealData &&
                      dealData.map((e, i) => {
                        if (inputValue) {
                          if (e.dealName.includes(inputValue)) {
                            return RenderAllData(e);
                          }
                        } else {
                          return RenderAllData(e);
                        }
                      })
                    );
                  }
                })}
            </View>
          </View>
        ) : !mainCategory.item && !mainCategory.deals ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                width: '96%',
                height: '100%',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              {allCategory &&
                allCategory.length > 0 &&
                allCategory.map((e, i) => {
                  if (e.active) {
                    return (
                      allData &&
                      allData.length > 0 &&
                      allData.map((value, ind) => {
                        if (
                          value.itemCategory == e.title ||
                          value.dealName == e.title
                        ) {
                          if (inputValue) {
                            if (
                              (value.itemCategory &&
                                value.itemCategory.includes(inputValue)) ||
                              (value.itemName &&
                                value.itemName.includes(inputValue)) ||
                              (value.dealName &&
                                value.dealName.includes(inputValue))
                            ) {
                              return RenderAllData(value);
                            }
                          } else {
                            return RenderAllData(value);
                          }
                        }
                      })
                    );
                  } else if (!e.active) {
                    index = index + 1;
                  }

                  if (index == allCategory.length) {
                    return (
                      allData &&
                      allData.map((e, i) => {
                        if (inputValue) {
                          if (
                            (e.itemName && e.itemName.includes(inputValue)) ||
                            (e.dealName && e.dealName.includes(inputValue)) ||
                            (e.itemCategory &&
                              e.itemCategory.includes(inputValue))
                          ) {
                            return RenderAllData(e);
                          }
                        } else {
                          return RenderAllData(e);
                        }
                      })
                    );
                  }
                })}
            </View>
          </View>
        ) : (
          ''
        )}
      </ScrollView>
    </View>
  );
}

export default User;
