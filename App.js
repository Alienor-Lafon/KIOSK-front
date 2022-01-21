import React from "react";

//import de la bibliothèque Animated pour trnaistion entre écrans
import { Animated } from "react-native";

// import du pack d'icônes pour la navigation Tab
import { AntDesign } from "@expo/vector-icons";

// imports des reducers
import user from "./reducers/user.reducer";
import categoryChosenData from "./reducers/CategoryChoice";
import subCategoryChosenData from "./reducers/subCategoryChoice";
import categorieslist from "./reducers/categorieslist";
import recherche from "./reducers/Recherche";

// initialisation du store redux
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
// états stockés dans le store :
const store = createStore(
  combineReducers({ user, categoryChosenData, subCategoryChosenData, categorieslist, recherche })
);

// import des pages à inclure dans les navigations
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import CompanyScreen from "./screens/CompanyScreen";
import SearchScreen from "./screens/SearchScreen";
import OfferScreen from "./screens/OfferScreen";
import PacksResultsScreen from "./screens/PacksResultsScreen";
import RatingScreen from "./screens/RatingScreen";
import LeaveRatingsScreen from "./screens/LeaveRatings";
import QuoteRequestScreen from "./screens/QuoteRequestScreen";
import SendQuoteScreen from "./screens/Usermenu/SendQuoteScreen";
import MessagesScreen from "./screens/MessagesScreen";
import ChatScreen from "./screens/ChatScreen";
//import des pages du usermenu à inclure dans les navigations
import CompanyProfileScreen from "./screens/Usermenu/CompanyProfileScreen";
import FavoritesScreen from "./screens/Usermenu/FavoritesScreen";
import UserProfileScreen from "./screens/Usermenu/UserProfileScreen";
import QuotationScreen from "./screens/Usermenu/QuotationScreen";

// import des modules de navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// création des composants de navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// transition écrans
const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted
          ),
        },
      ],
    },
  };
};

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyleInterpolator: forSlide }} >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ResultsPacks" component={PacksResultsScreen} />
      {/* Common pages */}
      <Stack.Screen name="CompanyPage" component={CompanyScreen} />
      <Stack.Screen name="OfferPage" component={OfferScreen} />
      <Stack.Screen name="Quotation" component={QuotationScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="LeaveFeedback" component={LeaveRatingsScreen} />
      <Stack.Screen name="QuoteRequest" component={QuoteRequestScreen} />
      <Stack.Screen name="SendQuote" component={SendQuoteScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      {/* End of common pages */}
    </Stack.Navigator>
  );
};


const StackNavigationSearch = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyleInterpolator: forSlide }} >
      <Stack.Screen name="Search" component={SearchScreen} />
      {/* Common pages */}
      <Stack.Screen name="CompanyPage" component={CompanyScreen} />
      <Stack.Screen name="OfferPage" component={OfferScreen} />
      <Stack.Screen name="Quotation" component={QuotationScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="LeaveFeedback" component={LeaveRatingsScreen} />
      <Stack.Screen name="QuoteRequest" component={QuoteRequestScreen} />
      <Stack.Screen name="SendQuote" component={SendQuoteScreen} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      {/* End of common pages */}
    </Stack.Navigator>
  );
};

// création de la navigation Tab
const TabNavigation = () => {
  return (
    <Tab.Navigator
    // front de la bottom tab
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          // icones pour chaque bouton de la TabNav
          if (route.name === "Accueil") {
            iconName = "home";
          } else if (route.name === "Rechercher") {
            iconName = "search1";
          } else if (route.name === "Messages") {
            iconName = "message1";
          }
          return <AntDesign name={iconName} size={25} color={color} />;
        },
        // options d'affichage et couleur de la navigation
        headerShown: false,
        tabBarActiveTintColor: "#F3493E",
        tabBarInactiveTintColor: "#1A0842",
        tabBarStyle: {
          backgroundColor: "#FFFBF7",
          color: "#1A0842",
        },
      })}
    >
      <Tab.Screen name="Accueil" component={StackNavigation} /> 
      {/* appel la StackNavigation */}
      <Tab.Screen name="Rechercher" component={StackNavigationSearch} />
      {/* appel de la StackNavigationSearch */}
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
};

// Export la navigation Stack (principale) :
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyleInterpolator: forSlide }} >
          <Stack.Screen name="Bienvenue" component={WelcomeScreen} />
          <Stack.Screen name="Connexion" component={LoginScreen} />
          <Stack.Screen name="Inscription" component={RegisterScreen} />
          <Stack.Screen name="TabNavigation" component={TabNavigation} /> {/* appel de la TabNavigation (nested) */}
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
