import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title} from 'native-base';


//To prevent overlap with notification bar
import { getStatusBarHeight } from 'react-native-status-bar-height';



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { splash_sc : false };
  }

  componentDidMount()
  {
    setTimeout(() => {
      this.done();
    },1000);
  }

  done()
  {
    this.setState({ splash_sc : true });
  }



  render() {

    if(!this.state.splash_sc)
    {
      return <SplashScreen />;

    }
    else 
    {
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Whistle</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="more" />
              </Button>
            </Right>
          </Header>
          <Content>
            
            
          </Content>
        </Container>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Header: {
    paddingTop: getStatusBarHeight(),
    height: 54 + getStatusBarHeight(),
  },
});