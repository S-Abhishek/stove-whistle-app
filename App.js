import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title} from 'native-base';

var cooker = require('./assets/whistle4.png')

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
      return (

        <Container>
          <Title>
            Hello
          </Title>
        </Container>

      );

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
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>Number of whistles</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <View style={styles.image}>
                  <Image source = {cooker} />
                </View>

              </CardItem>
            </Card>
            
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
  image: {
    justifyContent:'center',
    alignItems:'center'
  }
});