import React from "react";
import { TouchableOpacity, View,Text } from "react-native"; 
import Icon from "react-native-vector-icons/AntDesign"


function Header (Prop)  {
    const {back,dark,navigation,style,onPress,buttonOnRight,buttonTitle,textOnMiddle,middleText} = Prop
   return   (
    <View style={{flexDirection:"row",width:"100%",alignItems:"center",padding:7,backgroundColor:"black",borderBottomColor:"white",borderWidth:3,paddingBottom:10}} >
    <TouchableOpacity    onPress={()=>navigation.goBack()} style={{width:"20%",...style}} >
    {back &&   <Icon name="arrowleft" size={25} color= {dark?"black" : "white"} />  }
    </TouchableOpacity>
    <View style={{width:"40%",justifyContent:"center"}} >
    {textOnMiddle && <Text style={{fontSize:24,color:"white",fontWeight:"700"}} >{middleText}</Text>}
    </View>
    {buttonOnRight && <TouchableOpacity    onPress={onPress} style={{borderWidth:2,borderColor:"white",padding:8,borderRadius:10,width:120,marginLeft:10, ...style}} >
                     <Text style={{textAlign:"center",fontWeight:"700",fontSize:16,color:"white"}} >{buttonTitle}</Text>
    </TouchableOpacity>}
    </View>
    )
}

export default Header