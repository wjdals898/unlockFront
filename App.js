import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Navigation from './Navigation';
import 'react-native-gesture-handler';

export default function App() {


    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );

}