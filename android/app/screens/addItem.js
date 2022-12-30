import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Modal,
} from 'react-native';
import database from '@react-native-firebase/database';
import Header from '../components/header';

function AddItems({navigation}) {
  const initialData = {
    itemCategory: '',
    itemName: '',
    itemDescription: '',
    itemSize: '',
    itemPrice: '',
  };

  const [itemDetail, setItemDetail] = React.useState(initialData);

  let modal = {};
  const setItemInDb = () => {
    let flag = Object.values(itemDetail);

    let flag1 = flag.some((e, i) => e == '');

    if (flag1) {
      Alert.alert('Error Alert', 'Fill Empty Input Field ', [{text: 'cancel'}]);
    } else {
      modal.id = database().ref().push().key;
      database()
        .ref('items/' + modal.id)
        .set(itemDetail)
        .then(success => {
          ToastAndroid.show('Item Successfully Added', ToastAndroid.SHORT);
          setItemDetail(initialData);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{position:"absolute",top:10,left:10}} >
        <Header back navigation={navigation} dark />
      </View>
      <View>
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontSize: 24,
            marginTop: 10,
            fontWeight: '700',
          }}>
          Hey Admin
        </Text>
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '600',
          }}>
          Kindly fill the below form to add items
        </Text>
      </View>

      <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
        <TextInput
          value={itemDetail.itemCategory}
          onChangeText={e => setItemDetail({...itemDetail, itemCategory: e})}
          placeholder="Item Category"
          placeholderTextColor="black"
          style={{
            width: '90%',
            padding: 12,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            fontSize: 18,
            color: 'black',
          }}
        />
        <TextInput
          value={itemDetail.itemName}
          onChangeText={e => setItemDetail({...itemDetail, itemName: e})}
          placeholder="Item Name"
          placeholderTextColor="black"
          style={{
            width: '90%',
            padding: 12,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            fontSize: 18,
            marginTop: 10,
            color: 'black',
          }}
        />
        <TextInput
          value={itemDetail.itemDescription}
          onChangeText={e => setItemDetail({...itemDetail, itemDescription: e})}
          placeholder="Item Description"
          placeholderTextColor="black"
          style={{
            width: '90%',
            padding: 12,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            fontSize: 18,
            marginTop: 10,
            color: 'black',
          }}
        />
        <TextInput
          value={itemDetail.itemSize}
          onChangeText={e => setItemDetail({...itemDetail, itemSize: e})}
          placeholder="Item Size"
          placeholderTextColor="black"
          style={{
            width: '90%',
            padding: 12,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            fontSize: 18,
            marginTop: 10,
            color: 'black',
          }}
        />
        <TextInput
          value={itemDetail.itemPrice}
          onChangeText={e => setItemDetail({...itemDetail, itemPrice: e})}
          placeholder="Item Price"
          placeholderTextColor="black"
          style={{
            width: '90%',
            padding: 12,
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 10,
            fontSize: 18,
            marginTop: 10,
            color: 'black',
          }}
        />
      </View>

      <TouchableOpacity
        onPress={setItemInDb}
        style={{
          width: '90%',
          padding: 20,
          backgroundColor: 'skyblue',
          borderRadius: 10,
          marginTop: 30,
        }}>
        <Text
          style={{
            color: 'black',
            fontWeight: '800',
            fontSize: 18,
            textAlign: 'center',
          }}>
          ADD ITEM
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default AddItems;
