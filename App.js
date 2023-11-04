import React, {useEffect} from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Navigation from './Navigation';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
export default function App() {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000); //스플래시 활성화 시간
  });

    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );

}