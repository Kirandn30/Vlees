import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Button, Text, View, DeviceEventEmitter, Platform, TouchableWithoutFeedback } from 'react-native';
import FirebaseOTP from './src/pages/Auth';
import { Firebase } from './config';
import { NativeBaseProvider, StatusBar, extendTheme } from 'native-base';
import UserDetails from './src/pages/userDetails';
import { Provider } from 'react-redux';
import { RootState, store } from './src/redux';
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from './src/redux/UserSlice';
import Pages from './src';
import { Keyboard } from 'react-native'

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <StatusBar
          animated={true}
          backgroundColor="#000000"
        />
        <Pages />
      </NativeBaseProvider>
    </Provider>
  );
}

const theme = extendTheme({
  colors: {
    primary: {
      50: "#202326FF",
      100: "#202326FF",
    },
    amber: {
      400: "#F7F7F8FF",
    },
  },
  config: {
    initialColorMode: "light",
  },
});