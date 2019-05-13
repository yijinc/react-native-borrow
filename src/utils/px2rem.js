import { Dimensions } from 'react-native';

const deviceWidthDp = Dimensions.get('window').width / 7.5;

export default function px2rem(uiElementPx) {
    return uiElementPx / 100 * deviceWidthDp;
}