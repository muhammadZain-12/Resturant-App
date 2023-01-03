import React from "react"
import {View,Text, TouchableOpacity} from 'react-native'
import Icon from "react-native-vector-icons/AntDesign"


function OrderBookedScreen ({route,navigation}) {
    
let data = route.params


// let orderPrice = data.orderPrice.toString()

// orderPrice = data.orderPrice && data.orderPrice.includes('Rs')?data.orderPrice : `Rs${data.orderPrice}/-`
console.log(data,"data")
console.log(typeof data.orderPrice)




    return (
        <View style={{width:"100%",height:"100%",backgroundColor:"black"}} >
        <View style={{width:"100%",alignItems:"center",marginTop:60,padding:5}} >
            <Icon size={100} color="yellow" name="smileo" />
            <Text style={{color:"white",fontSize:32,textAlign:'center',marginTop:10}} >Congratulations</Text>
            <Text style={{color:"white",fontSize:28,textAlign:'center',fontWeight:"700"}} >{data.userData.username}</Text>
            <Text style={{color:"white",fontSize:18,textAlign:'center',marginTop:10}} >You have successfully booked Your order</Text>
        </View>
        <View style={{marginTop:20,padding:10,paddingHorizontal:20}} >
            <Text style={{color:"white",fontSize:24,fontWeight:"700"}} >Your Orders Items:</Text>
            {data.orderData.map((e,i)=>{
                return (
                    <Text style={{}} >{e.count} {e.itemName??e.dealName} {e.itemSize} </Text>
                )  
            })}       
            <Text style={{color:"white",fontSize:24,fontWeight:"700",marginTop:10}} >Your Orders Amount:</Text>
            <Text style={{fontSize:14}} > Rs {data.orderPrice}/- </Text>
            <Text style={{color:"white",fontSize:24,fontWeight:"700",marginTop:10}} >Payment Method:</Text>
            <Text style={{fontSize:14}} >  {data.paymentMethod} </Text>
        </View>

        <View style={{padding:10}} >
        <Text style={{fontSize:14,textAlign:"center",marginTop:10}} >Dear customer Your order has been cooking you will be delivered your order soon</Text>
        </View>

            <TouchableOpacity onPress={()=>navigation.navigate('user')} style={{width:"100%",marginTop:30,alignItems:"center",position:"absolute",bottom:20}} >
                <Text style={{textAlign:"center",borderWidth:1,borderColor:"white",width:"90%",padding:14,borderRadius:10}} >Go to Home Page</Text>
            </TouchableOpacity>

        </View>
    )
}

export default OrderBookedScreen