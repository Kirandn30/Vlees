import 'react-native-gesture-handler';
import React from 'react';
import { NativeBaseProvider, StatusBar, extendTheme } from 'native-base';
import { Provider } from 'react-redux';
import { store } from './src/redux';
import Pages from './src';
import { SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <AutocompleteDropdownContextProvider>
        <StatusBar
          animated={true}
          backgroundColor="#000000"
        />
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-white ">
            <Pages />
          </SafeAreaView>
        </SafeAreaProvider>
        </AutocompleteDropdownContextProvider>
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