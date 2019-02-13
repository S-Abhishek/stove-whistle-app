import React from 'react';
import AppNavigator from './AppNavigator';

export default class App extends React.Component
{

  static navigationOptions = {
    headerMode: 'none',
    header:null
  }
    render()
    {
        return (
            <AppNavigator/>
        )
    }
}