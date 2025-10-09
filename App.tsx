import {StatusBar, useColorScheme, View} from 'react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {RootStackParamList} from "./src/navigation/types.ts";
import {ShiftsMainScreen} from "./src/screens/shifts/ShiftsMainScreens.tsx";
import {ShiftDetailsScreen} from "./src/screens/shifts/stack/ShiftDetailScreen.tsx";
import { useEffect } from 'react';
import { locationStore } from './src/store/LocationStore.ts';
import {StoreProvider} from "./src/store/store.tsx";

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <StoreProvider>
            <SafeAreaProvider>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <AppContent />
            </SafeAreaProvider>
        </StoreProvider>
    );
}

function AppContent() {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const initLocation = async () => {
            if (!locationStore.coordinates) {
                try {
                    await locationStore.requestLocation();
                } catch (error) {
                    console.log('Ошибка запроса геолокации');
                }
            }
        };

        initLocation();
    }, []);

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="ShiftsList">
                    <Stack.Screen
                        name="ShiftsList"
                        component={ShiftsMainScreen}
                        options={{ title: 'Доступные смены' }}
                    />
                    <Stack.Screen
                        name="ShiftDetails"
                        component={ShiftDetailsScreen}
                        options={{ title: 'Детали смены' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export default App;
