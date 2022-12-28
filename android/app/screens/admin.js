import React from "react"
import { View,Text,Image, TouchableOpacity } from "react-native"
import pizza from "../assets/pizzaStore.png"


function Admin ({navigation,route}) {

    let [data] = route.params


const routeToOtherPage = (route) => {

        navigation.navigate(route)

}


    return (
        <View style={{flex:1}} >
            <Image source={pizza} style={{width:"100%",height:"50%"}} />
            <Text style={{color:"black",fontSize:24,padding:10,textAlign:"center",fontWeight:"800",marginTop:10}} >
                Welcome {data.username}
            </Text>
            <View style={{width:"100%",alignItems:"center",marginTop:10}} >
            <TouchableOpacity style={{backgroundColor:"skyblue",width:"90%",padding:20,borderRadius:10}}  >
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