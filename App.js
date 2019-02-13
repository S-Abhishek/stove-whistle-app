import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';



export default class App extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Left>

          </Left>
          <Body>
            <Title>Whistle</Title>
          </Body>
        </Header>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
