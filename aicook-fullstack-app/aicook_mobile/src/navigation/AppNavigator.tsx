import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import UserEditScreen from "../screens/UserEditScreen";
import ChangePasswordScreen from "../screens/UserChangePasswordScreen"
import PhotoDownloadScreen from "../screens/PhotoDownload";
import FridgeAnalysisScreen from "../screens/FridgeAnalysisScreen";
import HistoryRecipesScreen from "../screens/HistoryRecipesScreen";
import FavoriteRecipesScreen from "../screens/FavoriteRecipesScreen";
import ReportsScreen from "../screens/ReportsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!token ? (
      <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </>
    ) : (
      <>
        <Stack.Screen name="Main" component={HomeScreen} />
        <Stack.Screen name="UserEdit" component={UserEditScreen} />
        <Stack.Screen name="UserChangePassword" component={ChangePasswordScreen}/>
        <Stack.Screen name="PhotoDownload" component={PhotoDownloadScreen}/>
        <Stack.Screen name="FridgeAnalysis" component={FridgeAnalysisScreen}/>
        <Stack.Screen name="HistoryRecipes" component={HistoryRecipesScreen}/>
        <Stack.Screen name="FavoriteRecipes" component={FavoriteRecipesScreen}/>
        <Stack.Screen name="ReportsScreen" component={ReportsScreen}/>
      </>
    )}
  </Stack.Navigator>
</NavigationContainer>
  );
}
