import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import styles from '../../constants/FormStyle';
import axios from 'axios';
// import console = require('console');

const DisplayAlert = ({message, success}) => {
	const container = (success == true) ? styles.buttonSuccessContainer : styles.buttonAlertContainer;
	return (
		<View style={container}>
			<Text style={styles.buttonTxt}>{message}</Text>
		</View>
	);
}

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			errors: '',
			ip: ''
		}
		this.submitForm = this.submitForm.bind(this);
	}

	async componentDidMount() {
		await AsyncStorage.getItem("token")
		.then((item) => {
			if (item) {
				this.props.navigation.navigate('Home');
			}
		})
	}

	async submitForm() {
		if (this.state.email == '') {
			this.setState({errors: 'Please enter an email'})
		} else if (this.state.password == '') {
			this.setState({errors: 'Please enter a password'})
		} else {
			this.setState({errors: ''})
			await axios.post('http://10.18.207.186:8080/connexion', {
				email: this.state.email,
				password: this.state.password
			})
			.then(res => {
				AsyncStorage.setItem("token", res.data.token);
				this.props.navigation.navigate('Home', {token: res.data.token});
			})
			.catch(err => {
				this.setState({errors: err.response.data});
				console.log(errors);
			})
		}
	}

	render() {
		return (
			<View style={styles.containerForm}>
				<TextInput
					placeholder="Email"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					onChangeText={(email) => this.setState({email: email})}
				/>
				<TextInput
					placeholder="Password"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="go"
					secureTextEntry
					style={styles.input}
					onChangeText={(password) => this.setState({password: password})}
				/>
				{this.state.errors != '' && <DisplayAlert success={false} message={this.state.errors} />}
				<TouchableOpacity style={styles.buttonContainer}
								  onPress={this.submitForm}>
					<Text style={styles.buttonTxt}>CONNEXION</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default LoginForm;
