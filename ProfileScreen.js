import React from 'react';
import { StyleSheet, View , Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right , Title , Footer, FooterTab} from 'native-base';

export default class ProfileScreen extends React.Component 
{
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
          <Form>
            <Item>
              <Input placeholder="Username" />
            </Item>
            <Item last>
              <Input placeholder="Kitchen id" />
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

