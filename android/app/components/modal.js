import React, { useCallback, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"
import RadioButtonRN from "radio-buttons-react-native";

const AppModal = (Prop) => {

    const {visible,close} = Prop

const [data,setData] = React.useState([
    {
        label:"Cash on Delivery",
        selected:false
    },

    {
        label:"Other Medium",
        selected:false
    }

])



const getSelectedPaymentMethod = (selectedPaymentMethod) => {
       setData (data && data.map((e,i)=>{
            if(selectedPaymentMethod.label === e.label){
                return {
                    ...e,
                    selected:e.selected?false:true
                }
            }
            else{
                return {
                    ...e,
                    selected:false
                }
            }
        }))        
}

const RadioButton = useCallback((e)=>{




    return (
        <View style={{width:"100%",padding:10,flexDirection:"row",alignItems:"center",marginTop:10}} >
                <TouchableOpacity onPress={()=>getSelectedPaymentMethod(e)}  style={{padding:5,borderColor:"black",borderWidth:1,width:"15%",borderRadius:100,backgroundColor:"white",height:35}} >
                   {e.selected &&  <Icon name="check" size={25} color="blue" />}
                </TouchableOpacity>
                <Text style= {{color:"black",marginLeft:20,fontSize:22}}>{e.label}</Text>
        </View>
    )

},[data])





    

    const closeModal = () => {
            
        let a = ""
        
        data && data.map((e,i)=>{
            if(e.selected){
                a = e.label            }
            })
            


        a && close(a)

        
        
        }



  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          close()
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText,{fontSize:24,fontWeight:"800"}]}>Payment Method !</Text>
            <Icon size={50} color="black" name='dollar' />

            <View style={{width:"100%"}} >



                {data && data.map((e,i)=>{
                    return RadioButton(e)                    
                })}
            </View>


            




            <Pressable
              style={[styles.button, styles.buttonClose,{marginTop:20}]}
              onPress={closeModal}
            >
              <Text style={{color:"white",fontSize:18,textAlign:"center",fontWeight:"700"}}>Proceed Order</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin:10,
    backgroundColor: "white",
    width:"80%",
    padding: 15,
    alignItems: "center",
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "black",
    width:"90%",
    padding:13,
    borderRadius:10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color:"black",
    width:"100%"
  }
});

export default AppModal;