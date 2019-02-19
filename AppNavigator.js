import { createStackNavigator , createAppContainer } from 'react-navigation';
import Home from './Home';
import ProfileScreen from './ProfileScreen';


const AppNavigator1 = createStackNavigator({
    Home: {screen:Home},
    ProfileScreen : {screen: ProfileScreen},
},{'headerMode':'screen'});

const AppNavigator = createAppContainer(AppNavigator1)


export default AppNavigator;
