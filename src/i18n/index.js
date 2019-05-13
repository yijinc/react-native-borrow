import i18next from 'i18next';
import { AsyncStorage } from 'react-native';
import { reactI18nextModule } from 'react-i18next';

import en from './locales/en';
import zh from './locales/zh';
// import id from './locales/id';

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
// const languageDetector = {
//     type: 'languageDetector',
//     async: true, // flags below detection to be async
//     detect: (callback) => { return /*'en'; */ Expo.DangerZone.Localization.getCurrentLocaleAsync().then(lng => { callback(lng.replace('_', '-')); }) },
//     init: () => {},
//     cacheUserLanguage: () => {}
// }

export const changeLanguage = (lan) => (new Promise(
    (resolve, reject) => {
        if (lan === i18next.language) {
            resolve(true);
            return;
        }
        i18next.changeLanguage(lan, (err, t) => {
            if(err) {
                reject('i18next change language failed');
            } else {
                resolve(true)
            }
        });
        AsyncStorage.setItem('language', lan);
    })
)

i18next
    .use(reactI18nextModule) // if not using I18nextProvider
    .init({
        lng: 'en',
        debug: __DEV__,
        resources: {
            en: {
                translation: en
            },
            // id: {
            //     translation: id
            // },
            zh: {
                translation: zh
            },
        },

        // have a common namespace used around the full app
        // ns: ['common'],
        // defaultNS: 'common',

        // cache: {
        //     enabled: true
        // },

        interpolation: {
            escapeValue: false, // not needed for react as it does escape per default to prevent xss!
        }


    }, function(err, t) {
        err && console.log(err)
        // t('homeStep1')
    })

export default i18next;