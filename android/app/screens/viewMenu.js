import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import pizza from '../assets/pizza.webp';
import coldDrink from '../assets/coldDrink.jpg';
import database from '@react-native-firebase/database';
import Header from '../components/header';

function ViewMenu({navigation, route}) {
  const [itemData, setItemData] = React.useState([]);
  const [dealData, setDealData] = React.useState([]);
  const [editData, setEditData] = React.useState([]);

  const data = route.params;

  const getItemDataFromDb = () => {
    database()
      .ref('items')
      .once('value', e => {
        let val = e.val();

        val = Object.entries(val).map(([key,value])=>{
            value.id = key
            return value
        })

        setItemData(val);
      });
  };

  const getDealDataFromDb = () => {
    database()
      .ref('Deals')
      .once('value', e => {
        let val = e.val();
        val = Object.entries(val).map(([key, value]) => {
          value.id = key;
          return value;
        });
        val = Object.values(val);
        val.reverse();
        setDealData(val);
      });
  };

  useEffect(() => {
    getItemDataFromDb();
    getDealDataFromDb();
  }, []);

  useEffect(() => {
    data && !data.edit
      ? setDealData(
          dealData.filter((e, i) => {
            return e.id !== data.id;
          }),
        )
      : setEditData(data);
  }, [data]);

  useEffect(() => {
    data && data.delete
      && setItemData(
          itemData.filter((e, i) => {
            return e.id !== data.id;
          }),
        )
      
  }, [data]);


  useEffect(() => {
    editData &&
      setDealData(
        dealData.map((e, i) => {
          if (editData.id == e.id) {
            return editData;
          } else {
            return e;
          }
        }),
      );
  }, [editData]);

  const RenderItem = ({item}) => {
    return (
      <View
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: 'black',
          height: 250,
          borderRadius: 10,
          marginHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('menuItemDetail', item)}
          style={{width: 200, height: 150, borderRadius: 10}}>
          {item.itemCategory == 'Pizza' ? (
            <Image
              source={pizza}
              style={{width: 200, height: 150, borderRadius: 10}}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={coldDrink}
              style={{width: 200, height: 150, borderRadius: 10}}
            />
          )}
          <Text
            numberOfLines={1}
            style={{color: 'black', fontSize: 20, marginLeft: 5}}>
            {item.itemName} {item.itemSize}
          </Text>
          <Text
            numberOfLines={1}
            style={{color: 'black', fontSize: 20, marginLeft: 5}}>
            {item.itemDescription}
          </Text>
          <Text
            numberOfLines={1}
            style={{color: 'black', fontSize: 20, marginLeft: 5}}>
            {item.itemPrice}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItems = ({item}) => {
    console.log(item);

    return (
      <View
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: 'black',
          height: 230,
          borderRadius: 10,
          marginHorizontal: 10,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('menuItemDetail', item)}
          style={{width: 200, height: 150, borderRadius: 10}}>
          <Image
            source={pizza}
            style={{width: 200, height: 150, borderRadius: 10}}
          />
          <Text
            numberOfLines={1}
            style={{color: 'black', fontSize: 20, marginLeft: 5, marginTop: 5}}>
            {item.dealName}
          </Text>
          <Text
            numberOfLines={1}
            style={{color: 'black', fontSize: 20, marginLeft: 5}}>
            {item.dealPrice.includes('Rs')
              ? item.dealPrice
              : `Rs ${item.dealPrice}/-`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{width: '100%', height: '100%', padding: 15,paddingVertical:10}}>
    
    <Header back dark navigation={navigation}  />
    <ScrollView  >
      <View style={{width: '100%', alignItems: 'center'}}>
        <Text style={{fontSize: 25, color: 'black'}}>Resturant Menu</Text>
        <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>
          Here You can see the Items You have added in your resturant Menu.
        </Text>
      </View>

      <Text
        style={{
          color: 'black',
          fontSize: 36,
          marginLeft: 10,
          marginBottom: 10,
        }}>
        Items
      </Text>
      <FlatList data={itemData} renderItem={RenderItem} horizontal={true} />
      <Text
        style={{
          color: 'black',
          fontSize: 36,
          marginLeft: 10,
          marginBottom: 10,
          marginTop: 10,
        }}>
        Deals
      </Text>
      <FlatList data={dealData} renderItem={renderItems} horizontal={true} />
      </ScrollView>
    </View>
  );
}

export default ViewMenu;
