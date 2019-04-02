import React from 'react';
import { StyleSheet, View , Image, StatusBar, TextInput } from 'react-native';
import { Container, Header, Content, Accordion , Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab, Fab, Item, Input, Row} from 'native-base';
import Dialog, { DialogContent, DialogTitle, SlideAnimation, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { Font, AppLoading } from 'expo';
import { Dimensions } from 'react-native'
const dataArray = [
  { title: "Whistle 1", content: "Disconnected" },

];

const SendActions = ['whistleStart', 'whistleStop', 'stoveSim', 'stoveOff' ];
const RecvActions = ['whistleInc', 'tempHigh', 'gasLeak', 'tempNormal', 'gasNormal'];

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
                   inputValue : '',
                   isGasLeak: false,
                   isTempHigh: false,
                 };

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.loadFonts();
  }

  initSocket(){
    console.log(this.state.ws_url);
    this.client = new WebSocket('ws://' + this.state.ws_url);

    this.client.onclose = () => {
      console.log("Socket closed . . . reiniting socket");
      this.setState({connected : false});
      this.initSocket();
    };

    // Recieve and handle messages
    this.client.onmessage = msg => {
      console.log(msg.data + " recieved");
      msg = msg.data;
      if( msg == 'Connected'){
        console.log(msg);
        this.setState({connected : true});
        return;
      }
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
            this.setState({isTempHigh : true});
            break;
          case 'gasLeak':
            this.setState({isGasLeak: true});
            break;
          case 'tempNormal':
            this.setState({isTempHigh : false});
            break;
          case 'gasNormal':
            this.setState({isGasLeak: false});
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
    var newIP = this.state.inputValue;
    this.setState({ws_url: newIP}, () => {
      if(this.client)
        this.client.close();
      else
        this.initSocket();
    });
  }

  sendMessage(action, data){
    if(this.client && this.client.OPEN)
    {
      let encoded = SendActions.indexOf(action) + data.toString();
      console.log('Sending ' + action + ' : ' + data + ' as ' + encoded);
      this.client.send(encoded);
    }
  }

  startWhistleCount(){
    if(this.state.connected){
      this.setState({ DialogState: false, totalWhistleCount: this.state.count});
      this.sendMessage('whistleStart', this.state.count);
    }
    
  }

  stopWhistleCount(){
    if(this.state.connected){
      this.setState({currWhistleCount: 0, totalWhistleCount: 0});
      this.sendMessage('whistleStop', 0);
    }
    
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
          <View style={{flex: 1, flexDirection: 'row'}}>
          <Card style={[styles.card1, {backgroundColor: this.state.isGasLeak ? '#e57373' : 'white'}]}>
            <CardItem style={{backgroundColor: this.state.isGasLeak ? '#e57373' : 'white'}} header>
              <Text style= {[{color: this.state.isGasLeak ? 'white' : 'black'}, { fontSize: 20, }]}>Gas leakage </Text>
            </CardItem>
            <CardItem style={[{backgroundColor: this.state.isGasLeak ? '#e57373' : 'white'}, {flexDirection: 'row'}]}>
              <Text style={{color: this.state.isGasLeak ? 'white' : 'black'}} >{this.state.isGasLeak ? 'Yes' : 'No'}</Text>
            </CardItem>
          </Card>
          <Card style={[styles.card1, {backgroundColor: this.state.isTempHigh ? '#e57373' : 'white'}]}>
            <CardItem style={{backgroundColor: this.state.isTempHigh ? '#e57373' : 'white'}} header>
              <Text style= {[{color: this.state.isTempHigh ? 'white' : 'black'}, { fontSize: 20}]}>Temperature</Text>
            </CardItem>
            <CardItem style={[{backgroundColor: this.state.isTempHigh ? '#e57373' : 'white'}, {flexDirection: 'row'}]}>
                <Text style={{color: this.state.isTempHigh ? 'white' : 'black'}}>{this.state.isTempHigh ? 'High' : 'Normal'}</Text>
            </CardItem>
          </Card>
          </View>
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
          </View>
        </Container>
      );
    }
    
  }
}



const styles = StyleSheet.flatten({
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
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 10,
      paddingBottom: 20,
      borderRadius: 10,
      flex: 1,
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
  },  
});
