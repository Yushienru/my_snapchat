import React, {Component} from 'react';
import {View, Text, AsyncStorage, TouchableOpacity, Image, Picker, TextInput} from 'react-native';
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import styles from '../constants/FormStyle';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            time: 10,
            dest: 'default',
            usersList: [],
            image: null
        }
        this.disconnect = this.disconnect.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.renderSend = this.renderSend.bind(this);
        this.sendPicture = this.sendPicture.bind(this);
    }

    sendPicture = () => {
        if (this.state.time < 0 || this.state.time > 10 || Number.isInteger(this.state.time) === false)
            alert("Veuillez sélectionner une durée entre 0 et 10 secondes");
        else if (this.state.dest === "default")
            alert("Veuillez sélectionner un destinataire");
        else {
            console.log(this.state.image)
            const data = new FormData();
            data.append('duration', this.state.time);
            data.append('to', this.state.dest);
            data.append("image", {
                name: "image.jpg",
                type: this.state.image.type,
                uri:
                  Constants.platform.android ? this.state.image.uri : this.state.image.uri.replace("file://", "")
              });
            axios.post('mongodb://localhost:27042/Snapchat', data, {
              headers: {
                "Content-Type": "multipart/form-data",
                token: this.state.token
              }
            })
            .then(res => {
                console.log(res.data);
                this.setState({time: 10, dest: 'default', image: null})
            })
            // .catch(err => {
            //     console.log(err.response.data);
            // })
        }
    }

    async componentDidMount() {
        const newToken = await AsyncStorage.getItem("token");
        this.setState({token: newToken});
        this.getPermissionAsync();
        this.getUsers();
    }

    getUsers = async () => {
         axios.get('https://10.18.207.201:8080/all', {
            headers: {
                token: this.state.token
            },
            email: this.state.email
        })
        
        console.log('eeeeeee')
        
        .then(res => {
            console.log('aaaaaaa')
            AsyncStorage.setItem("token", res.data.email);
            this.props.navigation.navigate('Home', {email: res.data.email});
        })
        .catch(err => {
            console.log('error')
            this.setState({errors: err.response.data.data});
            console.log(errors);
        })
    }
        
       

    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }

    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        this.setState({ image: result });
      }
    };

    disconnect() {
        AsyncStorage.removeItem('token');
        this.props.navigation.navigate('Login');
    }
        
    camera() {
        this.props.navigation.navigate('camera');    
    }

    renderSend = () => {
        return (
            <View style={{padding: 20}}>
                <Image source={{ uri: this.state.image.uri }} style={{ width: 200, height: 200 }} />
                <Picker selectedValue={this.state.dest} style={{height: 20, width: 300}}
                    onValueChange={(itemValue, itemIndex) => this.setState({dest: itemValue})}>
                    <Picker.Item label="Sélectionnez un destinataire" value="default" />
                    {this.state.usersList.map((data, index) =>
                        <Picker.Item key={index} label={data.email} value={data.email} />
                    )}
                </Picker>
                  <TextInput style={{marginTop: 50}}
                        placeholderTextColor="rgba(0,0,0,0.7)" placeholder="Duration (default 10)"
                          returnKeyType="next" onChangeText={(val) => this.setState({time: parseInt(val,10)})}/>
                      <View style={{marginTop:50}}>
                      <TouchableOpacity style={styles.buttonContainer} onPress={this.sendPicture}>
                          <Text style={styles.buttonTxt}>Envoyer l'image</Text>
                      </TouchableOpacity>
                  </View>
            </View>
        )
    }

    render() {
        return (
          <View style={styles.container}>
              <View style={styles.imageContainer}>
                  <TouchableOpacity style={styles.buttonContainerSpec} onPress={this._pickImage}>
                      <Text style={styles.buttonTxt}>Sélectionnez une image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonContainerSpec} onPress={this.disconnect}>
                      <Text style={styles.buttonTxt}>Logout</Text>
                  </TouchableOpacity>
              </View>
              {this.state.image && this.renderSend()}
          </View>
        );
    }
}

export default Home;
