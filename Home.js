import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Accordion , Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab, Fab, Item, Input} from 'native-base';
import Dialog, { DialogContent, DialogTitle, SlideAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { Font, AppLoading } from 'expo';
const dataArray = [
  { title: "Whistle 1", content: "Disconnected" },

];

const SendActions = ['whistleCount', ];
const RecvActions = ['whistleInc',];

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
    this.state = { splash_sc : false , 
                   active: false, 
                   DialogState: false, 
                   loading : true, 
                   connected : false,
                   currWhistleCount : 0,
                   totalWhistleCount : 0,
                   count : 0,
                 };

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.loadFonts();
    this.initSocket();
  }

  initSocket(){
    this.client = new WebSocket('ws://echo.websocket.org');

    this.client.onopen = connection => {
      console.log( new Date().toISOString() + ' Connected');
      this.setState({connected : true})
    };

    // Recieve and handle messages
    this.client.onmessage = msg => {
      console.log(msg.data + " recieved");
      msg = msg.data.split(',');
      const action = +msg[0];
      const data = +msg[1];
      try
      {
        switch(RecvActions[action])
        {
          case 'whistleInc':
            this.setState(prevState => ({ currWhistleCount : prevState.currWhistleCount + 1}));
            break;
  
        }
      }
      catch(e)
      {
        console.log('Invalid action recieved :' + action);
      }

    };
  }

  sendMessage(action, data){
    if(this.client.OPEN)
    {
      let encoded = SendActions.indexOf(action) + ',' + data.toString();
      console.log('Sending ' + action + ' : ' + data + ' as ' + encoded);
      this.client.send(encoded);
    }
  }

  startWhistleCount(){
    this.setState({ DialogState: false });
    this.sendMessage('whistleCount',this.state.count);
    this.setState({totalWhistleCount : this.state.count});
  }

  async loadFonts(){
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  done()
  {
    this.setState({ splash_sc : true });
  }



  render() {
    
    const {navigate} = this.props.navigation;

    if(this.state.loading)
    {
      return <AppLoading/>;
    }
    else
    {
      return (
        <Container>
          <Header>
            <Body style={styles.image}>
              <Title>Whistle Counter</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="more" />
              </Button>
            </Right>
          </Header>
          <View style={{flex:1}}>
          <Content padder>
          <Card style={styles.card}>
            <CardItem header>
              <Text style={{ fontSize: 25 }}>Whistle 1</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                   Status: <Text>{this.state.connected ? 'Connected' : 'Disconnected'}</Text>
                </Text>
                <Text>
                   No of whistles: <Text>{this.state.currWhistleCount}</Text><Text>/{this.state.totalWhistleCount}</Text>
                </Text>
                <Text>
                  Timer:
                </Text>
                 
              </Body>
              
            </CardItem>
            <CardItem footer>
                <Button style={{ position:'absolute', right:10, bottom:0 }} rounded block onPress={() => {this.setState({ DialogState: true });}}>
                  <Text>Count Whistles</Text>
                </Button>
            </CardItem>
          </Card>
                     

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
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            <Card transparent>
            <CardItem>
            <Button full light>
                <Text style = {{fontSize: 20, fontWeight: 'bold'}}>
                  {this.state.count}
                </Text>
                </Button>
            </CardItem>
            <CardItem>
                <Button light rounded onPress = {() => this.setState({ count: this.state.count + 1 })}>
                  <Icon name = "ios-arrow-round-up" />
                </Button>
                <Right/>
                <Button light rounded onPress = {() => this.setState({ count: this.state.count - 1 })}>
                  <Icon name = "ios-arrow-round-down" />
                </Button>
            </CardItem>
            <CardItem footer>
              <Button style={{ backgroundColor: '#BB2B2B' }} rounded>
                <Text>Reset</Text>
              </Button>
            <Right/>
            <Right/>
              <Button style={{ backgroundColor: '#4E9657' }} rounded onPress = {() => this.startWhistleCount()}>
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
  },
  card: {
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 10,
      paddingBottom: 10
  },
  
});
