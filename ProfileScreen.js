import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab, Form , Item , Input } from 'native-base';

export default class ProfileScreen extends React.Component 
{
  static navigationOptions = {
    header: null
  }
  constructor(props)
  {
    super(props);
  }
  render()
  {
    const {navigate} = this.props.navigation;
    return(
      
      <Container>
        <Header />
        <Content>
          <Thumbnail large source={{uri: "http://profilepicturesdp.com/wp-content/uploads/2018/06/default-user-profile-picture-7.png"}} />
          <Form>
            <Item>
              <Input placeholder="Username" />
            </Item>
            <Item last>
              <Input placeholder="Allowed MAC address" />
            </Item>
          </Form>
        
        </Content>
        <Footer>
          <FooterTab>
            
            <Button onPress = {() => navigate('Home')}>
              <Icon name="apps" />
              <Text>Cooker menu</Text>
            </Button>
            <Button active>
              <Icon name="person" />
              <Text>User details</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>


    );
  }
}

