import React, { useEffect } from 'react'
import { View,Text, FlatList, TouchableOpacity } from "react-native";
import database from '@react-native-firebase/database';
import { createConfigItem } from '@babel/core';
import Header from '../components/header';


function OrderBookingData ({navigation}) {
    const [bookingData,setBookingData] = React.useState([]) 
    
useEffect(()=>{
    database().ref('booking').once('value',(e)=>{
        let val = e.val()
        let values = Object.values(val)
        setBookingData(values)
    })
},[])
    

const renderItem = ({item}) => {
    return (
        <TouchableOpacity onPress={()=>navigation.navigate('bookedOrderDetailScreen',item)} style={{width:"100%",borderWidth:1,borderColor:"white",padding:10,flexDirection:"row",marginTop:10,borderRadius:10,justifyContent:"space-between",alignItems:"center"}} >
                <View>
                <Text style={{color:"white",fontSize:18,fontWeight:"800"}} >
                    {item.userData.username}
                </Text>

                <Text style={{color:"white",fontSize:18}} >
                    {item.userData.email}
                </Text>
                </View>

                <TouchableOpacity onPress={()=>navigation.navigate('bookedOrderDetailScreen',item)} style={{borderWidth:1,borderColor:"white",borderRadius:10,justifyContent:"center",width:"35%",alignItems:"center",height:40}} >
                        <Text style={{color:'lightblue',fontSize:14}} >OrderDetail</Text>                        
                </TouchableOpacity>

        </TouchableOpacity>
    )
}



    
    return (
        <View style={{width:"100%",height:"100%",backgroundColor:"black",padding:10,alignItems:"center"}} >
        <Header back navigation={navigation} />
        <View style={{width:"100%"}} >
            <Text style={{color:"white",textAlign:"center",fontSize:28,fontWeight:"700"}} >
                Booking Data
            </Text>
            <Text style={{textAlign:"center",fontSize:14,fontWeight:"700"}} >
                Here you can see the user order booking and proceed their order to make them delivered.
            </Text>
            </View>
            <View style={{width:"90%",height:"100%",alignItems:"center"}} >
            <FlatList

                data={bookingData}
                renderItem={renderItem}
                keyExtractor={(item,index)=>item+index}
                contentContainerStyle={{
                    width:"100%",
                }}
                style={{width:"100%"}}

            />
            </View>
        </View>
    )
}

export default OrderBookingData