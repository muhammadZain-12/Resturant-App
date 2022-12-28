import React from 'react'
import {View,Text,Image, TouchableOpacity} from 'react-native'
import pizza from "../assets/pizza.webp"
import coldDrink from "../assets/coldDrink.jpg"
import database from '@react-native-firebase/database'

function MenuItemDetail ({route,navigation}) {
    const [item,setItem] = React.useState([])
    const [deal,setDeal] = React.useState([])


    const data = route.params


React.useEffect(()=>{
    data.dealItem ? setDeal(data) : setItem(data)
},[data])




const deleteDeal = () => {

    deal.edit = false

    database().ref('Deals/' + deal.id).remove().then((success)=>{
        console.log('value Deleted')
        navigation.navigate('viewMenu',deal)
    }).catch((error)=>{
        console.log(error)
    })

}

    return (

        deal  && deal.dealItem   ?

        <View>
            <Image source={pizza} style={{width:"100%",height:250}} /> 
            <View style={{padding:10}} >
            <Text style={{color:"black",fontSize:32,color:"black",textAlign:"center"}} > {deal.dealName}  </Text>
            <Text style={{color:"black",fontSize:28,color:"red",marginLeft:8}} >Deal Items :-</Text>
            {deal.dealItem.map((e,i)=>{
                return (
                    <Text style={{color:"black",marginLeft:5,fontSize:18,marginLeft:10}} >{e.count} {e.itemCategory} {e.itemName} {e.itemSize} </Text>
                )
            })}
            
            <Text style={{color:"red",marginTop:20,fontSize:24,marginLeft:10}} >
                Deal Price: <Text style={{fontWeight:"900",fontSize:24,color:"black",textAlign:"center"}} > {deal.dealPrice.includes("Rs")?deal.dealPrice:`Rs ${deal.dealPrice}/-` } </Text> 
            </Text>

            <TouchableOpacity onPress={()=>navigation.navigate('addDeal',deal)}  style={{width:"100%",alignItems:"center",marginTop:30 }}  >
            <Text style={{color:"black",fontSize:22,textAlign:"center",marginTop:20,width:"90%",backgroundColor:"skyblue",padding:10,borderRadius:10}} >Want To Edit Deal?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>deleteDeal()} style={{width:"100%",alignItems:"center" }}  >
            <Text style={{color:"black",fontSize:22,textAlign:"center",marginTop:20,width:"90%",backgroundColor:"skyblue",padding:10,borderRadius:10}} >Delete Deal</Text>
            </TouchableOpacity>
            <TouchableOpacity>
            </TouchableOpacity>
            </View>
        </View>
        :
        <View>
                
        </View>
    )
}

export default MenuItemDetail