import * as React from 'react';
import {Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Modal} from 'react-native';
import auth from '@react-native-firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


export default class HomeScreen extends React.Component {

    constructor()
    {
        super();
        this.state={
            show:false,
            photo: null,
        }
    }

    choosePhoto = () => {
        const options = {
          noData: true,
        }
        launchImageLibrary(options,response => {
           console.log("response", response);
         })
    }

    takePhoto = () => {
            const options = {
              noData: true,
            }
            launchCamera(options,response => {
               console.log("response", response);
             })
        }

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{"Your postings"}</Text>
                <Button
                    title="Add a posting"
                    onPress={()=>{this.setState({show:true})}}
                />

                <Modal
                transparent={true}
                visible={this.state.show}
                >
                <View style={styles.modalOuterContainer}>
                <View style={styles.modalInnerContainer}>
                <Text style={styles.title}> New Posting </Text>

                <Button
                    style={styles.button}
                    title="Add a picture"
                    onPress={this.takePhoto}
                />

                <TouchableOpacity style={styles.button} onPress={()=>{this.setState({show:false})}}>
                    <Text>{"Close"}</Text>
                </TouchableOpacity>

                </View>
                </View>
                </Modal>
            </View>
        );
    }
  }

  const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: "#ffffff",
       alignItems: "center",
     },

    title: {
      color: "#3dafe0",
      fontSize: 30,
      fontWeight: "bold",
      marginTop: 50,
      marginBottom: 70,
    },

    modalOuterContainer: {
        flex: 1,
        backgroundColor: "#000000aa",
    },

    modalInnerContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        margin: 50,
        padding: 40,
        borderRadius: 10,
        alignItems: "center",
    },

    button: {
        color: "#3dafe0",
        margin: 50,
    }

   });


