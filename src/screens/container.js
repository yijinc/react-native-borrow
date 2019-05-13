import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import defaultNavigationOptions from '../component/defaultNavigationOptions'

// 初始主页
import BootstrapScrren from './bootstrap/Bootstrap';
import AccountStack from './account';
import HomeScreen from './home';

// 身份认证及借贷
import IdentificationScreen from './identification/Identification';
import LoanConfirmScreen from './loan/LoanConfirm';
import LoanScreen from './loan/Loan';

// 个人中心
import MineScreen from './mine/Mine';
import LoanHistoryScreen from './loan/LoanHistory';
import MyBankCardScreen from './bank/MyBankCard';
import SettingScreen from './mine/setting/Setting';
import ChangePasswordScreen from './mine/ChangePassword';
import AboutScreen from './mine/about/About';

import SetPasswordScreen from './account/SetPassword';
import IdcardEndVerifyScreen from './account/IdcardEndVerify'
import SetLanguageScreen from './mine/setting/SetLanguage'





const HomeStack = createStackNavigator({
    Home: HomeScreen,
    Mine: MineScreen,
    MyBankCard: MyBankCardScreen,
    Setting: SettingScreen,
    About: AboutScreen,
    ChangePassword: ChangePasswordScreen,
    Identification: IdentificationScreen,
    SetPassword: SetPasswordScreen,
    IdcardEndVerify: IdcardEndVerifyScreen,
    LoanConfirm: LoanConfirmScreen,
    LoanHistory: LoanHistoryScreen,
    Loan: LoanScreen,
    SetLanguage: SetLanguageScreen
}, {
    initialRouteName: 'Home',
    // headerMode: 'none',
    navigationOptions: defaultNavigationOptions
});


// const bankStack = createStackNavigator({
//     bank: bankScreen
// })

const AppNavigator = createSwitchNavigator({
    Bootstrap: BootstrapScrren,
    Account: AccountStack,
    Home: HomeStack,
}, {
    initialRouteName: 'Bootstrap'
});

export default AppNavigator;