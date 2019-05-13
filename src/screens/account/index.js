import { createStackNavigator } from 'react-navigation';
import defaultNavigationOptions from '../../component/defaultNavigationOptions'

import AccountStartScrren from './AccountStart';

import RegisterScreen from './Register';
import NewPasswordScreen from './NewPassword';

import LoginScreen from './Login';
import ForgetPasswordScreen from './ForgetPassword';
import SetPasswordScreen from './SetPassword';
import IdcardEndVerifyScreen from './IdcardEndVerify'



const RegisterStack = createStackNavigator({
    Register: RegisterScreen,
    NewPassword: NewPasswordScreen
}, {
    navigationOptions: defaultNavigationOptions
})

const LoginStack = createStackNavigator({
    Login: LoginScreen,
    ForgetPassword: ForgetPasswordScreen,
    SetPassword: SetPasswordScreen,
    IdcardEndVerify: IdcardEndVerifyScreen,
}, {
    navigationOptions: defaultNavigationOptions
})


const Stack = createStackNavigator({
    AccountStart: AccountStartScrren,
    Login: LoginStack,
    Register: RegisterStack
}, {
    initialRouteName: 'AccountStart',
    headerMode: 'none'
});

export default Stack;