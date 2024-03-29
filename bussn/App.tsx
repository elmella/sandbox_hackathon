import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Account from "./screens/Account";
import Redeem from "./screens/Redeem";
import Qrcode from "./screens/Qrcode";
import Verify from "./screens/Verify";
import LocationScreen from "./screens/LocationScreen";
import { RootStackParamList } from "./types";
import SplashScreen from "./screens/SplashScreen";
import SuccessScreen from "./screens/SuccessScreen";
import FailureScreen from "./screens/FailureScreen";

const stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHideSplashScreen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <NavigationContainer>
      {hideSplashScreen ? (
      <stack.Navigator>
        <stack.Screen name="Home" component={Home} 
        />
        <stack.Screen name="Account" component={Account} />
        <stack.Screen name="Redeem" component={Redeem} />
        <stack.Screen name="Qrcode" component={Qrcode} />
        <stack.Screen name="Verify" component={Verify} />
        <stack.Screen name="LocationScreen" component={LocationScreen} />
        <stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <stack.Screen name="FailureScreen" component={FailureScreen} />
      </stack.Navigator>
      ) : (
        <SplashScreen />
      )}
    </NavigationContainer>
  );
}
