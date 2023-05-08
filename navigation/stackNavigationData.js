import Login from "../components/login";
import Signup from "../components/signup";


const StackNavigationData = [

   {
    name: 'Login',
    component: Login,
    headerShown: false,
    headerLeft: null,
    headerBackground: null,
    headerTitleStyle: null,

  },
  {
    name: 'Signup',
    component: Signup,
    headerShown: false,
    headerLeft: null,
    headerBackground: null,
    headerTitleStyle: null,
  },
  {
    name: 'ForgotPassword',
    component: ForgotPassword,
    headerShown: false,
    headerLeft: null,
    headerBackground: null,
    headerTitleStyle: null,
  },

  {
    name: 'Home',
    component: TabNavigator,
    headerShown: false,
    headerLeft: null,
    headerBackground: null,
    headerTitleStyle: null,
  },


]

export default StackNavigationData;