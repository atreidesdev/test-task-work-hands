import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    ShiftsList: undefined;
    ShiftDetails: { shiftId: string };
};

export type ShiftsMainScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ShiftsList'
>;

export type ShiftDetailsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ShiftDetails'
>;

export type ShiftDetailsScreenRouteProp = RouteProp<
    RootStackParamList,
    'ShiftDetails'
>;
