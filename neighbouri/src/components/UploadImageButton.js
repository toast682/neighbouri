import React from 'react';
import {View, Text, Image, Button} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {useState} from 'react';


export default function UploadImageButton() {
    const [image, setImage] = useState({});
    return (
        <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {image && (<Image source = {{uri: image.uri}} style={{width: 300, height:300, borderRadius: 150}} />)}
            <Button title="Choose photo " onPress ={handleChoosePhoto}>
            </Button>
        </View>
    )
    function handleChoosePhoto() {
        const options = {};
        ImagePicker.launchImageLibrary(options, response => {
            console.log('response', response); // use response with firebase.
            if(response) {
                setImage(response);
                return response;
            }
            return response;
        });
    };
}