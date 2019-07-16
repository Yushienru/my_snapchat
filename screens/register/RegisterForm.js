import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../../constants/FormStyle';
import axios from 'axios';

const DisplayAlert = ({message, success}) => {
	const container = (success == true) ? styles.buttonSuccessContainer : styles.buttonAlertContainer;
	return (
		<View style={container}>
			<Text style={styles.buttonTxt}>{message}</Text>
		</View>
	);
}
// var app=express() 


// app.use(bodyParser.json()); 
// app.use(express.static('public')); 
// app.use(bodyParser.urlencoded({ 
// extended: true
// })); 

class RegisterForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mail: "",
			password: "",
			errors: '',
			success: ''
		}
		this.submitForm = this.submitForm.bind(this);
	}


	submitForm() {
		if (this.state.email == '')
			this.setState({errors: 'Please enter an email', success: ''})
		else if (this.state.password == '')
			this.setState({errors: 'Please enter a password', success: ''})
		else {
			this.setState({errors: ''})
	 		axios.post('http://10.18.207.186:8080/inscription', {
				email: this.state.mail,
				password: this.state.password
				
			})
			.then(res => {
				console.log("ca marche");
				this.setState({success: "Votre inscription a fonctionné"});
			})
			.catch(error => {
				this.setState({errors: error.response.data});
			})
		}
	}

	render() {
		return (
			<View style={styles.containerForm}>
				<Text>Inscription</Text>
				<TextInput
					placeholder="Email"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					autoCapitalize="none"
					autoCorrect={false}
					style={styles.input}
					onChangeText={(maiil) => this.setState({mail: maiil})}
				/>
				<TextInput
					placeholder="Password"
					placeholderTextColor="rgba(0,0,0,0.7)"
					returnKeyType="next"
					secureTextEntry
					style={styles.input}
					onChangeText={(pass) => this.setState({password: pass})}
				/>
				{this.state.errors != '' && <DisplayAlert success={false} message={this.state.errors} />}
				{this.state.success != '' && <DisplayAlert success={true} message={this.state.success} />}
				<TouchableOpacity style={styles.buttonContainer}
									onPress={this.submitForm}>
						<Text style={styles.buttonTxt}>INSCRIVEZ VOUS</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export default RegisterForm;
