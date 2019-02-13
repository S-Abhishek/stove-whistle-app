import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab} from 'native-base';


var cooker = require('./assets/whistle4.png')

//To prevent overlap with notification bar
import { getStatusBarHeight } from 'react-native-status-bar-height';


export default class Home extends React.Component {

  static navigationOptions = {
    header:{
      visible:false,
    }
  }

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

    const {navigate} = this.props.navigation;

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
            <Body style={styles.image}>
              
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
                  <Image source = {cooker}/>
                  
                </View>

              </CardItem>
              <CardItem>

              </CardItem>
            </Card>
            
          </Content>
          <Footer>
          <FooterTab>
            
            <Button active>
              <Icon name="apps" />
              <Text>Cooker menu</Text>
            </Button>
            <Button onPress = {() => navigate('ProfileScreen')}>
              <Icon name="person" />
              <Text>User details</Text>
            </Button>
          </FooterTab>
        </Footer>
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
    alignItems:'center',
  }
});
