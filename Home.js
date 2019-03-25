import React from 'react';
import { StyleSheet, View , Image, StatusBar, TextInput } from 'react-native';
import { Container, Header, Content, Accordion , Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab, Fab, Item, Input} from 'native-base';
import Dialog, { DialogContent, DialogTitle, SlideAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { Font, AppLoading } from 'expo';
import { Dimensions } from 'react-native'
const dataArray = [
  { title: "Whistle 1", content: "Disconnected" },

];

const SendActions = ['whistleStart', 'whistleStop' ];
const RecvActions = ['whistleInc', 'tempHigh', 'gasLeak'];

var cooker = require('./assets/whistle4.png');

//To prevent overlap with notification bar
import { getStatusBarHeight } from 'react-native-status-bar-height';

//state = { DialogState: false};

export default class Home extends React.Component {

  // For white titlebar
  static navigationOptions = {
    title: 'Whistle Counter',
    height: 60,
    headerStyle: {
      shadowOpacity: 0,
      shadowOffset: {
        height: 0
      },
      shadowRadius: 0,
      borderBottomWidth: 0,
      elevation: 0
    }
    
  }

  // static navigationOptions = {
  //   header : null
  // }

  constructor(props) {
    super(props);
    this.state = { splash_sc : false , 
                   active: false, 
                   DialogState: false, 
                   loading : true, 
                   connected : false,
                   ws_url : "echo.websocket.org",
                   currWhistleCount : 0,
                   totalWhistleCount : 0,
                   count : 0,
                   inputValue : ''
                 };

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.loadFonts();
    this.initSocket();
  }

  initSocket(){
    console.log(this.state.ws_url);
    this.client = new WebSocket('ws://' + this.state.ws_url);

    this.client.onopen = connection => {
      console.log( new Date().toISOString() + ' Connected');
      this.setState({connected : true});
    };

    this.client.onclose = () => this.setState({connected : false});
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
          case 'tempHigh':
            break;
  
        }
      }
      catch(e)
      {
        console.log('Invalid action recieved :' + action);
      }

    };
  }

  reinitSocket(){
    console.log("reinit");
    this.client.close();
    var newIP = this.state.inputValue;
    this.setState({ws_url: newIP}, () => {this.initSocket();});
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
    this.setState({ DialogState: false, totalWhistleCount: this.state.count});
    this.sendMessage('whistleStart', this.state.count);
  }

  stopWhistleCount(){
    this.setState({currWhistleCount: 0, totalWhistleCount: 0});
    this.sendMessage('whistleStop', 0);
  }

  clearWhistleCount(){
    this.setState({count : 0});
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

    if(this.state.loading)
    {
      return <AppLoading/>;
    }
    else
    {
      return (
        <Container>
          {/* For white titlebar */}
          <StatusBar barStyle="dark-content" backgroundColor = "#FFFFFF" />
          {/* <Header>
            <Body style={styles.image}>
              <Title>Whistle Counter</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="more" />
              </Button>
            </Right>
          </Header> */}
          <View style={{flex:1}}>
          <Content padder>
          <Card style={styles.card}>
            <CardItem style={{flex: 1, flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
              <Text>
                IP :
              </Text>
              <TextInput style = {styles.input}
              ref = "ip"
              autoCapitalize = "none"
              borderColor = "#000000"
              placeholder = {this.state.ws_url}
              placeholderTextColor = "#a9a9a9"
              onChangeText = {(txt) => this.setState({inputValue: txt})}
              />
              <Button light rounded style={{backgroundColor:"#66BB6A", marginTop: 13  }} onPress = {() => this.reinitSocket()} >
                  <Icon style={{color : 'white'}} name = "ios-arrow-round-forward" />
              </Button>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{paddingBottom : 5}}>
                   Status : <Text>{this.state.connected ? 'Connected to ' + this.state.ws_url : 'Disconnected'}</Text>
                </Text>
              </Body>
            </CardItem>
          </Card>
          
          <Card style={styles.card}>
            <CardItem header>
              <Text style={{ fontSize: 25 }}>Whistle 1</Text>
            </CardItem>
            
            <CardItem>
              <Body>
                
                
                <Text style={{paddingBottom : 5}}>
                   No of whistles : <Text>{this.state.currWhistleCount}</Text><Text>/{this.state.totalWhistleCount}</Text>
                </Text>
                <Text style={{paddingBottom : 5}}>
                  Timer :
                </Text>
                 
              </Body>
              
            </CardItem>
            <CardItem style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}  footer>
                <Button  style={{ backgroundColor: 'transparent', elevation : 0 }} onPress = {() => this.stopWhistleCount()}> 
                  <Text style={{color : "#4885ed"}} >Reset</Text>
                </Button>
                <Button style={{ backgroundColor: '#4885ed'}} rounded block onPress={() => {this.setState({ DialogState: true });}}>
                  <Text>Count Whistles</Text>
                </Button>
            </CardItem>
          </Card>
          
          <Card style={styles.card1}>
            <CardItem header style={{ backgroundColor:'#F25230' }}>
              <Text style= {{ fontSize: 25 }}>Gas leakage </Text>
            </CardItem>
            <CardItem style={{flexDirection: 'row',backgroundColor:'#F25230'}}>
              <Text style={{}}>
                Status:
              </Text>
            </CardItem>
          </Card>
          <Card style={styles.card1}>
            <CardItem header style={{ backgroundColor:'#F25230' }}>
              <Text style= {{ fontSize: 25 }}>Temperature</Text>
            </CardItem>
            <CardItem style={{flexDirection: 'row',backgroundColor:'#F25230'}}>
              <Text style={{}}>
                Status:
              </Text>
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
              title="Count Whistles"
              style={{backgroundColor: '#F7F7F8'}}
              hasTitleBar={false}
              align="left"
            />
          }
          footer={
            <DialogFooter >
              <DialogButton></DialogButton>
              <DialogButton textStyle={{color: '#4885ed'}} style={{borderColor: 'white'}}
                text="Cancel"
                onPress={() => {this.setState({ DialogState: false });}}
              />
            </DialogFooter>
          }
        >
          <DialogContent style={{height : 250}}>
            <Card transparent style={{flex: 1, flexDirection: 'column',justifyContent: 'center'}} >
            {/* <CardItem>
            
            </CardItem> */}
            <CardItem><Text>Choose the number of whistles</Text></CardItem>
            <CardItem style={{flex: 1, flexDirection: 'row',justifyContent: 'center' }} >
                <Button light rounded onPress = {() => this.setState({ count: this.state.count > 0 ? this.state.count - 1 : this.state.count })}>
                  <Icon name = "ios-arrow-round-down" />
                </Button>
                <Button style={{marginLeft : 60, marginRight : 60, height : 50, width : 50 }}full light rounded>
                  <Text style = {{fontSize: 30, fontWeight: 'bold'}}>
                    {this.state.count}
                  </Text>
                </Button>
                <Button light rounded onPress = {() => this.setState({ count: this.state.count + 1 })}>
                  <Icon name = "ios-arrow-round-up" />
                </Button>
            </CardItem>

            <CardItem footer>
              <Button style={{ backgroundColor: '#ef5350', paddingHorizontal : 10 }} rounded onPress = {() => this.clearWhistleCount()}>
                <Text>Clear</Text>
              </Button>
            <Right/>
            <Right/>
              <Button style={{ backgroundColor: '#66BB6A', paddingHorizontal : 10 }} rounded onPress = {() => this.startWhistleCount()}>
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
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 10,
      paddingBottom: 20,
      borderRadius: 10,
  },
  card1:{
      backgroundColor:'#F25230',
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 10,
      paddingBottom: 20,
      borderRadius: 10,
      width:((Dimensions.get('window').width)/2),
  },
  input:{
      margin: 15,
      height: 40,
      borderColor: '#a9a9a9',
      borderWidth: 1,
      paddingLeft: 15,
      paddingTop: 5,
      paddingBottom: 5,
      flex: 1,
      fontSize: 20,
      borderRadius: 20
  }
  
});
