import React from "react"
import { View,Text, TouchableOpacity } from "react-native"

function AddMenu ({navigation}) {
    return(
        <View style={{width:"100%",height:"100%",justifyContent:"center",backgroundColor:'aqua'}} >
            <Text style={{color:"black",textAlign:"center",fontSize:24,fontWeight:"700"}} >
                Add Menu
            </Text>
            <Text style={{color:"black",textAlign:"center",fontSize:18,fontWeight:"600"}}  >
                Want to Add Items & Deals
            </Text>
            <Text style={{color:"black",textAlign:"center",fontSize:16,fontWeight:"500"}}  >
                Kindly select from below
            </Text>

            <View style={{width:"100%",alignItems:"center",marginTop:20}} >
                <TouchableOpacity onPress={()=>navigation.navigate('addItem')}  style={{width:"90%",backgroundColor:"skyblue",padding:15,borderRadius:15}} >
                    <Text style={{color:"black",fontWeight:"700",textAlign:"center",fontSize:20}} >
                        Add Items
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('addDeal')}  style={{width:"90%",backgroundColor:"skyblue",padding:15,borderRadius:15,marginTop:20}} >
                <Text style={{color:"black",fontWeight:"700",textAlign:"center",fontSize:20}} >
                        Add Deals
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    )
    }

export default AddMenu








