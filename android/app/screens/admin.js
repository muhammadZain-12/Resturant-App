import React from "react"
import { View,Text,Image, TouchableOpacity, ToastAndroid } from "react-native"
import pizza from "../assets/pizzaStore.png"
import auth from "@react-native-firebase/auth"



function Admin ({navigation,route}) {

    let [data] = route.params


const routeToOtherPage = (route) => {

        navigation.navigate(route)

}


const signOut = () => {

    auth().signOut().then((success)=>{
        ToastAndroid.show('SignOut Successfully',ToastAndroid.SHORT)
        setTimeout(()=>{
                navigation.navigate('login')
        },1000)
    })


}


    return (
        <View style={{flex:1}} >
            
            <Image source={pizza} style={{width:"100%",height:"40%"}} />
            
            <View style={{justifyContent:"space-between",width:"100%",flexDirection:"row"}} >
            <Text style={{color:"black",fontSize:24,padding:10,textAlign:"center",fontWeight:"800",marginTop:10}} >
                Welcome {data.username}
            </Text>
            <TouchableOpacity onPress={signOut} style={{alignItems:"flex-end",marginRight:5}} >
            <Text style={{color:"black",fontSize:20,padding:10,textAlign:"center",fontWeight:"800",marginTop:10,borderWidth:1,borderColor:"skyblue",backgroundColor:"aqua",borderRadius:10}} >
                Sign Out
            </Text>
            </TouchableOpacity>
            </View>
            <View style={{width:"100%",alignItems:"center",marginTop:10}} >
            <TouchableOpacity onPress={()=>routeToOtherPage('orderBookedData')} style={{backgroundColor:"skyblue",width:"90%",padding:20,borderRadius:10}}  >
                <Text style={{color:"black",textAlign:"center",fontSize:20,fontWeight:"700"}} >
                    View Bookings
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>routeToOtherPage('viewMenu')}  style={{backgroundColor:"skyblue",width:"90%",padding:20,borderRadius:10,marginTop:10}}  >
                <Text style={{color:"black",textAlign:"center",fontSize:20,fontWeight:"700"}} >
                    View Menu
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>routeToOtherPage("addMenu")} style={{backgroundColor:"skyblue",width:"90%",padding:20,borderRadius:10,marginTop:10}}  >
                <Text style={{color:"black",textAlign:"center",fontSize:20,fontWeight:"700"}} >
                    Add Menu
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default Admin