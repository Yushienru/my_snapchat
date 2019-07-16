import React, {Component} from 'react';
import {Text, View, AsyncStorage, TouchableOpacity, Image} from 'react-native';
import styles from '../constants/FormStyle';
import axios from 'axios';

class ReceiveSnap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            snapList: [],
            token: '',
            image: ''
        }
        this.displaySnap = this.displaySnap.bind(this);
        this.chargeSnapList = this.chargeSnapList.bind(this);
    }

    async componentDidMount() {
        const newToken = await AsyncStorage.getItem("token");
        this.setState({token: newToken});
        this.chargeSnapList();
    }

    async chargeSnapList() {
        const res = await axios.get('https://snapchat.improve-code.net/snaps', {
            headers: {
                token: this.state.token
            }
        });
        this.setState({snapList: res.data.data});
    }

    displaySnap = (duration, snap_id) => {
        axios({
            method: 'get',
            url: 'https://snapchat.improve-code.net/snap/' + snap_id,
            headers: {
                'Content-Type': 'application/json',
                'token': this.state.token
            }
        }).then(res => {
            this.setState({image: res.request.responseURL});
            setTimeout(() => {
                this.setState({image: ""});
                axios.post('https://snapchat.improve-code.net/seen',{ id: snap_id}, {
                    headers: {
                        "Content-Type": "application/json ",
                        token: this.state.token
                    }
                })
                .then(res => {
                    console.log("Succeed");
                })
                .catch(err => {
                    console.log(err.response);
                });
                this.chargeSnapList();
            }, duration * 1000);
        }).catch(err => {
            console.log(err.response);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {this.state.snapList.map((data, index) => {
                        return (
                            <View key={index}>
                                <TouchableOpacity style={styles.buttonContainerSpec} onPress={() => this.displaySnap(data.duration, data.snap_id)}>
                                    <Text style={styles.buttonTxt}>{data.from}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                    {this.state.image !== '' && <Image style={{width: 200, height: 200}} source={{uri: this.state.image}} />}
                </View>
            </View>
        )
    }
}

export default ReceiveSnap;
