import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Accordion , Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab, Fab} from 'native-base';

const dataArray = [
  { title: "Module #1", content: "Testing" },

];

var cooker = require('./assets/whistle4.png')

//To prevent overlap with notification bar
import { getStatusBarHeight } from 'react-native-status-bar-height';


export default class Home extends React.Component {

  
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { splash_sc : false , active: false };
  }

  componentDidMount()
  {
    var self = this;
    setTimeout(() => {
      self.done();
    },1000);

    //self.interval = setInterval(self.Home,5000);
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
          <View style={{flex:1}}>
          <Content padder>
          <Accordion dataArray={dataArray} expanded={0}/>
          <Button block>
                <Text>Configure</Text>
          </Button>            
          </Content>
          <Fab
              active={this.state.active}
              direction="up"
              containerStyle={{ }}
              style={{ backgroundColor: '#5067FF' }}
              position="bottomRight"
              onPress={() => this.setState({ active: !this.state.active })}>
              <Icon name="add" />
              <Button style={{ backgroundColor: '#34A34F' }}>
                <Icon name="logo-whatsapp" />
              </Button>
              <Button style={{ backgroundColor: '#3B5998' }}>
                <Icon name="logo-facebook" />
              </Button>
              <Button disabled style={{ backgroundColor: '#DD5144' }}>
                <Icon name="mail" />
              </Button>
            </Fab>
          </View>
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
