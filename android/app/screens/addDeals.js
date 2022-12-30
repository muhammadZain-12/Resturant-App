import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import database from '@react-native-firebase/database';
import Header from '../components/header';

function AddDeals({navigation, route}) {
  const [items, setItems] = React.useState([]);
  const [dealItems, setDealItems] = React.useState([]);
  const [routeData, setRouteData] = React.useState([]);
  const [data, setData] = React.useState([]);

  const initialData = {
    dealName: '',
    dealItem: [],
    dealPrice: '',
  };

  const [dealDetail, setdealDetail] = React.useState(initialData);

  const myData = route.params;

  useEffect(() => {
    setData(myData);
    myData && setRouteData(myData.dealItem);
  }, []);

  React.useEffect(() => {
    database()
      .ref('items')
      .once('value', e => {
        let val = e.val();
        val = Object.entries(val).map(([key, value]) => {
          value.id = key;
          return value;
        });
        setItems(val);
      });
  }, []);

  const addItemsInDeals = items => {
    let flag = dealItems && dealItems.some((e, i) => e.id == items.id);
    if (dealItems && dealItems.length > 0 && flag) {
      setDealItems(
        dealItems &&
          dealItems.map((e, i) => {
            if (e.id === items.id) {
              return {
                ...e,
                count: (e.count = e.count + 1),
              };
            } else return e;
          }),
      );
    } else {
      items.count = 1;
      setDealItems([...dealItems, items]);
    }
  };

  const addEditDealsItems = items => {
    let flag = routeData && routeData.some((e, i) => e.id == items.id);
    if (routeData && routeData.length > 0 && flag) {
      setRouteData(
        routeData &&
          routeData.map((e, i) => {
            if (e.id === items.id) {
              return {
                ...e,
                count: (e.count = e.count + 1),
              };
            } else return e;
          }),
      );
    } else {
      items.count = 1;
      setRouteData([...routeData, items]);
    }
  };

  const RenderItem = ({item}) => {
    console.log(myData, 'data');
    return (
      <TouchableOpacity
        onPress={() =>
          !myData ? addItemsInDeals(item) : addEditDealsItems(item)
        }
        style={{
          width: '100%',
          backgroundColor: 'skyblue',
          padding: 20,
          marginTop: 10,
          borderRadius: 10,
        }}>
        <Text style={{color: 'black', textAlign: 'center'}}>
          {item.itemName + ' ' + item.itemSize}
        </Text>
      </TouchableOpacity>
    );
  };

  const dealSubmittedToDb = () => {
    dealDetail.dealItem = dealItems;

    const flag = Object.values(dealDetail);
    let flag1 = flag.some((e, i) => e == '');
    if (flag1) {
      Alert.alert('Error Alert', 'Fill Empty Input Fields');
    } else {
      dealDetail.id = database().ref().push().key;
      database()
        .ref('Deals/' + dealDetail.id)
        .set(dealDetail)
        .then(success => {
          ToastAndroid.show('Deal Successfully Added', ToastAndroid.SHORT);
          setdealDetail(initialData);
          setDealItems([]);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const lessItem = (value, index) => {
    if (value.count == 1) {
      setDealItems(
        dealItems.filter((e, i) => {
          return i !== index;
        }),
      );
    } else {
      setDealItems(
        dealItems.map((e, i) => {
          if (index === i) {
            return {
              ...e,
              count: (e.count = e.count - 1),
            };
          } else {
            return e;
          }
        }),
      );
    }
  };

  const AddItem = (value, index) => {
    setDealItems(
      dealItems.map((e, i) => {
        if (index == i) {
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

  const AddEditDealItem = (e, i) => {
    console.log(i, i);
    setRouteData(
      routeData.map((value, ind) => {
        console.log(ind, 'index');
        if (ind === i) {
          return {
            ...e,
            count: e.count + 1,
          };
        } else {
          return value;
        }
      }),
    );
  };

  const lessEditDealItem = (value, ind) => {
    console.log(value, 'value');

    if (value.count == 1) {
      setRouteData(
        routeData.filter((e, i) => {
          return e.id !== value.id;
        }),
      );
    } else {
      setRouteData(
        routeData.map((e, i) => {
          if (ind == i) {
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

  const editDealDataInDb = () => {
    data.dealItem = routeData;
    data.edit = true;

    database()
      .ref('Deals/' + data.id)
      .set(data)
      .then(success => {
        ToastAndroid.show('Data Successfully Edit', ToastAndroid.SHORT);
        navigation.navigate('viewMenu', data);
        setData([]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
      <Header
        back
        navigation={navigation}
        dark
        style={{marginLeft: 15, marginTop: 5}}
      />

      <Text
        style={{
          color: 'black',
          padding: 10,
          fontSize: 28,
          textAlign: 'center',
          fontWeight: '600',
        }}>
        Add Deals
      </Text>

      <TextInput
        onChangeText={e =>
          data && data.dealItem
            ? setData({...data, dealName: e})
            : setdealDetail({...dealDetail, dealName: e})
        }
        placeholder={data ? data.dealName : 'Deal Name'}
        value={data ? data.dealName : dealDetail.dealName}
        placeholderTextColor="black"
        style={{
          color: 'black',
          borderWidth: 1,
          borderColor: 'black',
          width: '90%',
          borderRadius: 10,
          padding: 10,
          fontSize: 20,
        }}
      />

      <Text
        style={{color: 'black', marginTop: 10, textTransform: 'capitalize'}}>
        Select below items to add in deals
      </Text>

      {items && items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={RenderItem}
          scrollEnabled={true}
          horizontal={false}
          style={{
            height: 200,
            maxHeight: 200,
            width: '90%',
          }}
        />
      ) : (
        <ActivityIndicator size={200} color="skyblue" />
      )}
      <View style={{height: 200, width: '100%'}}>
        <ScrollView style={{width: '100%', height: 100}}>
          {data && data.dealItem
            ? routeData.map((e, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      width: '100%',
                      backgroundColor: 'aqua',
                      padding: 10,
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'black', width: '60%'}}>
                      {e.count} {e.itemName} {e.itemSize}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => AddEditDealItem(e, i)}>
                        <Text style={{color: 'white', fontSize: 34}}> + </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => lessEditDealItem(e, i)}>
                        <Text style={{color: 'white', fontSize: 34}}> - </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            : dealItems &&
              dealItems.length > 0 &&
              dealItems.map((e, i) => {
                return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      width: '100%',
                      backgroundColor: 'aqua',
                      padding: 10,
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'black', width: '60%'}}>
                      {e.count} {e.itemName} {e.itemSize}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={() => AddItem(e, i)}>
                        <Text style={{color: 'white', fontSize: 34}}> + </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => lessItem(e, i)}>
                        <Text style={{color: 'white', fontSize: 34}}> - </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>
      <TextInput
        onChangeText={e =>
          data && data.dealItem
            ? setData({...data, dealPrice: e})
            : setdealDetail({...dealDetail, dealPrice: e})
        }
        placeholder={data && data.length > 0 ? data.dealPrice : 'Deal Price'}
        value={data ? data.dealPrice : dealDetail.dealPrice}
        placeholderTextColor="black"
        style={{
          color: 'black',
          borderWidth: 1,
          borderColor: 'black',
          width: '90%',
          borderRadius: 10,
          padding: 10,
          fontSize: 20,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      <TouchableOpacity
        onPress={data ? editDealDataInDb : dealSubmittedToDb}
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 20,
          backgroundColor: 'skyblue',
          padding: 20,
        }}>
        <Text style={{color: 'black', textAlign: 'center', fontSize: 20}}>
          {data ? 'Edit Deal' : 'ADD DEAL'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default AddDeals;
