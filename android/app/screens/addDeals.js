import React from "react";
import { View,Text, TouchableOpacity, ScrollView, FlatList, TextInput, ToastAndroid, Alert } from "react-native";
import database from "@react-native-firebase/database";




function AddDeals () {
const [items,setItems] = React.useState([])
const [dealItems,setDealItems] = React.useState([])

const initialData = {
    dealName : "",
    dealItem:[],
    dealPrice:""
} 


const [dealDetail,setdealDetail] = React.useState(initialData)


React.useEffect(()=>{

    database().ref('items').once('value',(e)=>{
        let val = e.val()
        val = Object.values(val)

        setItems(val)
    })


},[])


 

    

    

    const addItemsInDeals = (items) => {

        dealItems && dealItems.length>0 && dealItems.some((e,i)=>{
                return e.itemName==items.itemName && e.itemSize == items.itemSize
        })
        
        ?
        

        // setDealItems(dealItems.map((e,i)=>{

        //     console.log("my name ,",i)

        //         if(e.itemName==items.itemName && e.itemSize==items.itemSize ){
        //                 return {
        //                     ...e,
        //                     count : e.count  = e.count + 1
        //                 }
        //         } 

        //         else{
                    
        //                 return {
        //                     ...e,
        //                     count : e.count
        //                 }
        //         }
        // }))


        setDealItems(...dealItems,dealItems.map((e,i)=>{
            if(e.itemName==items.itemName&&e.itemSize==items.itemSize){
                let count = e.count + 1

                return  {
                        ...e,
                        count:count
                         }
                
            }
            else{
                return {
                    ...e,
                    count : e.count
                }
            }
        }))


        

        :

        

        items.count = 1
        setDealItems([...dealItems,items])
        
    }



    const RenderItem = ({item}) => {
            
        return (
            <TouchableOpacity onPress={()=>addItemsInDeals(item)} style={{width:"100%",backgroundColor:"skyblue",padding:20,marginTop:10,borderRadius:10}} >
                <Text style={{color:"black",textAlign:"center"}} >
                    {item.itemName + " " + item.itemSize}
                </Text>
            </TouchableOpacity>
        )
    }


const dealSubmittedToDb = () => {


    setdealDetail({...dealDetail,dealItem:dealItems})

    const flag = Object.values(dealDetail)
    let flag1 = flag.some((e,i)=> e=="")

    if(flag1){
        Alert.alert('Error Alert',"Fill Empty Input Fields")
    }
    else{
    dealDetail.id = database().ref().push().key
    database().ref('Deals/' + dealDetail.id ).set(dealDetail).then((success)=>{
        ToastAndroid.show("Deal Successfully Added",ToastAndroid.SHORT)
        setdealDetail(initialData)

    
    }).catch((error)=>{
        console.log(error)
    })
}
}

    
console.log(dealItems,"deal")
console.log(dealDetail,"dealDetails")

    return (
        <View style={{width:"100%",height:"100%",alignItems:"center"}} >
            <Text style={{color:"black",padding:10,fontSize:28,textAlign:"center",fontWeight:"600"}} >
                Add Deals
            </Text>
            

            <TextInput onChangeText={(e)=>setdealDetail({...dealDetail,dealName:e})} placeholder="Deal Name" placeholderTextColor='black' style={{color:"black",borderWidth:1,borderColor:"black",width:"90%",borderRadius:10,padding:10,fontSize:20}} />

            <Text style={{color:"black",marginTop:10,textTransform:"capitalize"}} >Select below items to add in deals</Text>
            <FlatList
            data={items}
            renderItem={RenderItem}
            scrollEnabled={true}
            horizontal={false}
            style={{
                height: 200,
                maxHeight: 200,
                width:"90%",
                
                
            
            }}



            /> 
                <View style={{width:"100%",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-around"}} >
            {dealItems && dealItems.length>0 && dealItems.map((e,i)=>{
                    
                return (
                    <TouchableOpacity key={i} style={{width:'48%',backgroundColor:"green",marginTop:10,padding:10}} > 
                        <Text style={{color:"black"}} >{e.count} {e.itemName} {e.itemSize}</Text>
                    </TouchableOpacity>
                )
            })}
                </View>
            <TextInput onChangeText={(e)=>setdealDetail({...dealDetail,dealPrice:e})} placeholder="Deal Price" placeholderTextColor='black' style={{color:"black",borderWidth:1,borderColor:"black",width:"90%",borderRadius:10,padding:10,fontSize:20,marginTop:10}} />
        <TouchableOpacity onPress={dealSubmittedToDb} style={{width:"100%",position:"absolute",bottom:20,backgroundColor:"skyblue",padding:20}} >
            <Text style={{color:"black",textAlign:"center",fontSize:20}}>ADD DEAL</Text>
        </TouchableOpacity>
            
        </View>
    )
}


export default AddDeals