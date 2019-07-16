import React from 'react';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from "react-native-vector-icons/AntDesign";
import Colors from '../constants/Colors';

import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/register/RegisterScreen';
import HomeScreen from '../screens/Home';
import ReceiveScreen from '../screens/ReceiveSnap';
import CameraPage from '../screens/photo/Camera';


const CameraStack = createStackNavigator(
    {
        CameraPage: CameraPage
    },
    {
        headerMode: 'none'
    }
)
const ReceiveScreenStack = createStackNavigator(
    {
        ReceiveScreen: ReceiveScreen
    },
    {
        headerMode: 'none'
    }
)

const LoginScreenStack = createStackNavigator(
    {
        LoginScreen: LoginScreen,
    },
    {
        headerMode: 'none'
    }
)

const RegisterScreenStack = createStackNavigator(
    {
        RegisterScreen: RegisterScreen
    },
    {
        headerMode: 'none'
    }
)

const HomeScreenStack = createStackNavigator(
    {
        HomeScreen: HomeScreen
    },
    {
        headerMode: 'none'
    }
)

const SnapTab = createBottomTabNavigator({
    Home: {
        screen: HomeScreenStack,
        navigationOptions: {
            tabBarLabel: 'Send snap',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="cloudupload" color={tintColor} size={24}/>
            )
        }
    },
    Send: {
        screen: ReceiveScreenStack,
        navigationOptions: {
            tabBarLabel: 'Receive snap',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="clouddownload" color={tintColor} size={24}/>
            )
        }
    },
    Camera: {
        screen: CameraStack,
        navigationOptions: {
            tabBarLabel: 'camera',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="camera" color={tintColor} size={24}/>
            )
        }
    },
}, {
    tabBarOptions: {
        activeTintColor: Colors.tintColor,
        inactiveTintColor: '#b3b4b8',
        labelStyle: {
            fontSize: 10,
        },
        style: {
            backgroundColor: '#222327',
            borderTopWidth: 0,
            borderTopColor: 'black',
            borderTopWidth: 1,
            shadowOffset: { width: 10, height: 10 },
            shadowColor: 'black',
            shadowOpacity: 1,
            elevation: 5
        }
    }
})

const LoginTab = createBottomTabNavigator({
    Login: {
        screen: LoginScreenStack,
        navigationOptions: {
            tabBarLabel: 'Connexion',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="login" color={tintColor} size={24} />
            )
        }
    },
    Register: {
        screen: RegisterScreenStack,
        navigationOptions: {
            tabBarLabel: 'Inscription',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="form" color={tintColor} size={24} />
            )
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: Colors.tintColor,
        inactiveTintColor: '#b3b4b8',
        labelStyle: {
            fontSize: 10,
        },
        style: {
            backgroundColor: '#222327',
            borderTopWidth: 0,
            borderTopColor: 'black',
            borderTopWidth: 1,
            shadowOffset: { width: 10, height: 10 },
            shadowColor: 'black',
            shadowOpacity: 1,
            elevation: 5
        }
    }
})

const SwitchNav = createSwitchNavigator(
    {
        TabLogin: {
            screen: LoginTab,
            navigationOptions: {
                tabBarLabel: 'Login Page'
            }
        },
        TabSnap: {
            screen: SnapTab,
            navigationOptions: {
                tabBarLabel: 'Home Page'
            }
        }
    }
)

export default createAppContainer(SwitchNav);
