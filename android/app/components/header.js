import React from "react";
import { TouchableOpacity, View,Text } from "react-native"; 
import Icon from "react-native-vector-icons/AntDesign"


function Header (Prop)  {
    const {back,dark,navigation,style} = Prop
   return   (
    <TouchableOpacity    onPress={()=>navigation.goBack()} style={{width:"100%",...style}} >
    {back &&   <Icon name="arrowleft" size={25} color= {dark?"black" : "white"} />  }
    </TouchableOpacity>
    )
}

export default Header