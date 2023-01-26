import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  Alert,
  ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import pizzaImage from "../assets/pizzaImage.webp"




function SignUp({navigation}) {

  const [loader,setLoader] = useState(false)

  const initialData = {
    userName: '',
    email: '',
    password: '',    
    category : "user"
  }




  const [signUpData, setSignUpData] = useState(initialData);

  const sendDatatoDb = () => {
    const {userName, email, password,category} = signUpData;
    console.log(signUpData,"sign")
    
    let flag = Object.values(signUpData)
    let flag1 = flag.some((e,i)=>e=="")
      if(flag1){
        Alert.alert("Sign Up Error Alert","Fill Empty Input Fields", [{text:"Ok",onPress:()=>console.log("cancel button pressed")}]) 
      }
      else{
        setLoader(true)


        console.log(signUpData)

    auth()
    .createUserWithEmailAndPassword(email, password)
    
      .then(success => {
        const user = success.user;
        console.log(user)
        if (user) {
          const {userName, email,category} = signUpData;
    database()
      .ref('users/' + user.uid)
      .set({
        username: userName,
        email: email,
        category:category
      })
      
      .then(val => {
        setLoader(false)
        setSignUpData(initialData)
        navigation.navigate('login')
      })
      .catch(err => {
        setLoader(false)
        console.log(err);
      });
    }
    
      }).catch(error => {
        setLoader(false)
        console.log(error.response(), 'errror');
      });
    }
  };
      


  return ( 
    <View style={styles.container} >
        
    
     <View style={{width:"100%",height:"100%",justifyContent:"center",backgroundColor:"black"}} >
     <View style={{justifyContent:"flex-start",height:"75%"}} >
     
    <View style={{width:"90%",alignItems:"center"}} >
    <Text style={{color:"white",textAlign:"left",width:"87%",fontSize:24}} >
        Sign Up!
    </Text>
    <Text style={{color:"white",textAlign:"left",width:"87%",fontSize:15}} >
        Register to enjoy your favourite Food
    </Text>
    </View>
    <View style={{flexDirection:"row",justifyContent:"center",marginTop:30}} >
   
    <TextInput onChangeText={(e)=>setSignUpData({...signUpData,userName:e})} placeholder='Enter UserName' placeholderTextColor="white" style={[styles.textInput,{width:"90%"}]} />
    </View>

    <View style={{flexDirection:"row",justifyContent:"center",marginTop:30}} >
   
    <TextInput onChangeText={(e)=>setSignUpData({...signUpData,email:e})} placeholder='Enter Your Email' placeholderTextColor="white" style={[styles.textInput,{width:"90%"}]} />
    </View>
    <View style={{flexDirection:"row",justifyContent:"center",marginTop:30}} >
   
    <TextInput secureTextEntry={true}  onChangeText={(e)=>setSignUpData({...signUpData,password:e})} placeholder='Enter Your Password' placeholderTextColor="white" style={[styles.textInput,{width:"90%"}]} />
    </View>

    <TouchableOpacity onPress={sendDatatoDb} style={styles.TouchableOpacity} >
    {loader?<ActivityIndicator size={'large'} color="blue"  />
    :
    <Text style={styles.text} >SignUp</Text>
  }
    </TouchableOpacity>
  
    <View style={{width:"100%",alignItems:"center",marginTop:20,flexDirection:"row",justifyContent:"center"}} >
    <Text style={{color:"rgba(180,180,810,1)",fontSize:16,textAlign:"center",justifyContent:"flex-end",fontWeight:"800"}} >
        already have an account?  
    </Text>
    <TouchableOpacity style={{justifyContent:"flex-end",marginLeft:4}} onPress={()=>navigation.navigate('login')}  >
            <Text style={{color:"white",fontWeight:"700",fontSize:16}} >Login</Text>
    </TouchableOpacity>
    </View>
    </View>
    </View>
    
    </View>
)
}

  
export default SignUp;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
  },

  image: {
    height: 200,
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  textInput: {
    borderColor:"white",
    borderWidth:1,
    padding:10,
    borderRadius:20,
    color:"white",
    textAlign:"center",
    height:60,
    fontSize:18
  },
  TouchableOpacity: {
    marginTop:40,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"rgba(180,180,810,0.7)",
    padding:15,
    width:"100%"
  },
});
