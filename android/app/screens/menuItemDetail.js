import React from 'react';
import {View, Text, Image, TouchableOpacity, ToastAndroid, ScrollView} from 'react-native';
import pizza from '../assets/pizza.webp';
import coldDrink from '../assets/coldDrink.jpg';
import database from '@react-native-firebase/database';
import Header from '../components/header';

function MenuItemDetail({route, navigation}) {
  const [item, setItem] = React.useState([]);
  const [deal, setDeal] = React.useState([]);

  const data = route.params;


    console.log(data,"data")

  React.useEffect(() => {
    data.dealItem ? setDeal(data) : setItem(data);
  }, [data]);

  const deleteDeal = () => {
    deal.edit = false;

    database()
      .ref('Deals/' + deal.id)
      .remove()
      .then(success => {
        console.log('value Deleted');
        navigation.navigate('viewMenu', deal);
      })
      .catch(error => {
        console.log(error);
      });
  };



  const deleteItem = () => {

    item.delete = true

    database().ref('items/' + item.id).remove().then((success)=>{
    
        
        ToastAndroid.show("Item Successfully Deleted",ToastAndroid.SHORT)

    
    
        setTimeout(()=>{
                navigation.navigate('viewMenu',item)
        },3000  )
    })
  }

  console.log(item,"item")

  return deal && deal.dealItem ? (
    <View>
    <ScrollView>
      <Image source={pizza} style={{width: '100%', height: 250}} />
      <Header back navigation={navigation} style={{position:"absolute",top:10,left:15}} />
      <View style={{padding: 10}}>
        <Text
          style={{
            color: 'black',
            fontSize: 32,
            color: 'black',
            textAlign: 'center',
          }}>
          {' '}
          {deal.dealName}{' '}
        </Text>
        <Text
          style={{color: 'black', fontSize: 28, color: 'red', marginLeft: 8}}>
          Deal Items :-
        </Text>
        {deal.dealItem.map((e, i) => {
          return (
            <Text
              style={{
                color: 'black',
                marginLeft: 5,
                fontSize: 18,
                marginLeft: 10,
              }}>
              {e.count} {e.itemCategory} {e.itemName} {e.itemSize}{' '}
            </Text>
          );
        })}

        <Text
          style={{color: 'red', marginTop: 20, fontSize: 24, marginLeft: 10}}>
          Deal Price:{' '}
          <Text
            style={{
              fontWeight: '900',
              fontSize: 24,
              color: 'black',
              textAlign: 'center',
            }}>
            {' '}
            {deal.dealPrice.includes('Rs')
              ? deal.dealPrice
              : `Rs ${deal.dealPrice}/-`}{' '}
          </Text>
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('addDeal', deal)}
          style={{width: '100%', alignItems: 'center', marginTop: 30}}>
          <Text
            style={{
              color: 'black',
              fontSize: 22,
              textAlign: 'center',
              marginTop: 20,
              width: '90%',
              backgroundColor: 'skyblue',
              padding: 10,
              borderRadius: 10,
            }}>
            Want To Edit Deal?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteDeal()}
          style={{width: '100%', alignItems: 'center'}}>
          <Text
            style={{
              color: 'black',
              fontSize: 22,
              textAlign: 'center',
              marginTop: 20,
              width: '90%',
              backgroundColor: 'skyblue',
              padding: 10,
              borderRadius: 10,
            }}>
            Delete Deal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity></TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  ) : (

    

    <View>
    <ScrollView>
    <Image source={item.itemCategory=="Pizza"?pizza : coldDrink} style={{width: '100%', height: 250}} />
    <Header back navigation={navigation} style={{position:"absolute",top:10,left:15}} />
    <View style={{padding: 10}}>
        <Text
          style={{
            color: 'black',
            fontSize: 32,
            color: 'black',
            textAlign: 'center',
            fontWeight:"800"
          }}>
          {item.itemName} {item.itemCategory}
        </Text>
        <View style={{width:"100%",flexDirection:"row",marginTop:20}} >
            <Text
             style={{color: 'black', fontSize: 26, color: 'red', marginLeft: 8}}>
             Item Category :- 
            </Text>
            <Text
             style={{color: 'black', fontSize: 26, color: 'black', marginLeft: 8,fontWeight:"800"}}>
             {item.itemCategory} 
            </Text>
        </View>
        <View style={{width:"100%",flexDirection:"row",marginTop:20}} >
            <Text
             style={{color: 'black', fontSize: 26, color: 'red', marginLeft: 8}}>
             Item Name :- 
            </Text>
            <Text
             style={{color: 'black', fontSize: 26, color: 'black', marginLeft: 8,fontWeight:"800"}}>
             {item.itemName} 
            </Text>
        </View>
        <View style={{width:"100%",flexDirection:"column",marginTop:20}} >
            <Text
             style={{color: 'black', fontSize: 26, color: 'red', marginLeft: 8}}>
             Item Description: 
            </Text>
            <Text
             style={{color: 'black', fontSize: 20, color: 'black', marginLeft: 8,fontWeight:"600"}}>
             {item.itemDescription} 
            </Text>
            

            <Text style={{color: 'red', marginTop: 20, fontSize: 24, marginLeft: 10}} >
            Item Price: <Text style={{
              fontWeight: '900',
              fontSize: 24,
              color: 'black',
              textAlign: 'center',
            }} >

                {item.itemPrice && item.itemPrice.includes('Rs')?item.itemPrice : `Rs ${item.itemPrice}/-`}

            </Text>
            </Text>
        
        
        </View>
        

        </View>
        <TouchableOpacity
          onPress={() => deleteItem()}
          style={{width: '100%', alignItems: 'center'}}>
          <Text
            style={{
              color: 'black',
              fontSize: 22,
              textAlign: 'center',
              marginTop:30,
              width: '90%',
              backgroundColor: 'skyblue',
              padding: 10,
              borderRadius: 10,
            }}>
            Delete Item
          </Text>
        </TouchableOpacity>
            
        </ScrollView>

    </View>
  );
}

export default MenuItemDetail;
