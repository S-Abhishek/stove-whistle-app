import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Accordion , Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab, Fab, Item, Input} from 'native-base';
import Dialog, { DialogContent, DialogTitle, SlideAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';

const dataArray = [
  { title: "Module #1", content: "Testing" },

];

var cooker = require('./assets/whistle4.png')

//To prevent overlap with notification bar
import { getStatusBarHeight } from 'react-native-status-bar-height';

//state = { DialogState: false};

export default class Home extends React.Component {

  
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = { splash_sc : false , active: false, DialogState: false };
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
          <Button block onPress={() => {this.setState({ DialogState: true });}}>
                <Text>Configure</Text>
          </Button>            

          <Dialog
          onDismiss={() => {this.setState({ DialogState: false });}}
          width={0.9}
          visible={this.state.DialogState}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              title="Cooker settings"
              style={{backgroundColor: '#F7F7F8'}}
              hasTitleBar={false}
              align="left"
            />
          }
          footer={
            <DialogFooter>
              <DialogButton
                text="Cancel"
                bordered
                onPress={() => {this.setState({ DialogState: false });}}
                key="button-1"
              />
              <DialogButton
                text="Ok"
                bordered
                onPress={() => {this.setState({ DialogState: false });}}
                key="button-2"
              />
            </DialogFooter>
          }
        >
          <DialogContent
            style={{backgroundColor: '#F7F7F8'}}
          >
            <Card transparent>
            <CardItem>
              <Item regular>
                <Input placeholder='Enter no of whistles' />
              </Item>
            </CardItem>
            <CardItem footer>
              <Button rounded>
                <Text>Reset</Text>
              </Button>
            <Right/>
              <Button rounded>
                <Text>Start</Text>
              </Button>
            </CardItem>
          </Card>
          </DialogContent>
        </Dialog>

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
