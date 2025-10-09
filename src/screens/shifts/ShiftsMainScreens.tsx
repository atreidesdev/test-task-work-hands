import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { getShifts } from "../../api/getShifts.ts";
import { ShiftPreview } from "../../components/ShiftPreview.tsx";
import { ShiftsMainScreenNavigationProp } from "../../navigation/types.ts";
import { useStore } from "../../store/store.tsx";
import { DateScroll } from "../../components/DateScroll.tsx";

export const ShiftsMainScreen = observer(() => {
    const navigation = useNavigation<ShiftsMainScreenNavigationProp>();
    const { locationStore, shiftsStore } = useStore();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (locationStore.coordinates) {
            loadShifts();
        } else {
            setLoading(false);
        }
    }, [locationStore.coordinates]);

    const loadShifts = async () => {
        try {
            setLoading(true);
            setError(null);

            const coordinates = locationStore.getCoordinates();
            console.log(coordinates);

            const shiftsData = await getShifts(coordinates);
            console.log(shiftsData.length);

            shiftsStore.setShifts(shiftsData);

            if (shiftsData.length > 0) {
                const firstDate = shiftsData[0].dateStartByCity;
                setSelectedDate(firstDate);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(errorMessage);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshLocation = async () => {
        try {
            setLoading(true);
            await locationStore.requestLocation();
        } catch (err) {
            Alert.alert('Ошибка', 'Не удалось обновить местоположение');
            setLoading(false);
        }
    };

    const handleShiftPress = (shiftId: string) => {
        shiftsStore.setSelectedShiftById(shiftId);
        navigation.navigate('ShiftDetails', { shiftId });
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    const filteredShifts = shiftsStore.shifts.filter(shift =>
        shift.dateStartByCity === selectedDate
    );

    const renderShiftItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => handleShiftPress(item.id)}
            style={styles.shiftItemContainer}
        >
            <ShiftPreview shift={item} />
        </TouchableOpacity>
    );

    if (!locationStore.coordinates) {
        return (
            <View style={styles.screenCenterContainer}>
                <TouchableOpacity onPress={handleRefreshLocation} style={styles.locationRequestButton}>
                    <Text style={styles.locationRequestButtonEmoji}>📍</Text>
                </TouchableOpacity>
                <Text style={styles.locationNotFoundTitle}>Геолокация не определена</Text>
                <Text style={styles.locationNotFoundDescription}>
                    Для показа смен необходимо разрешить доступ к геолокации
                </Text>
            </View>
        );
    }

    if (loading && shiftsStore.shifts.length === 0) {
        return (
            <View style={styles.screenCenterContainer}>
                <ActivityIndicator size="large" color="blue" />
                <Text style={styles.loadingShiftsText}>Загрузка смен...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.screenCenterContainer}>
                <Text style={styles.shiftsLoadErrorTitle}>Ошибка загрузки смен</Text>
                <Text style={styles.shiftsLoadErrorDescription}>{error}</Text>
                <TouchableOpacity onPress={loadShifts} style={styles.primaryActionButton}>
                    <Text style={styles.primaryActionButtonText}>Повторить</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.screenContainer}>
            <DateScroll
                shifts={shiftsStore.shifts}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />

            <FlatList
                data={filteredShifts}
                renderItem={renderShiftItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.shiftsListContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadShifts}
                ListEmptyComponent={
                    <View style={styles.emptyShiftsContainer}>
                        <Text style={styles.emptyShiftsText}>
                            {selectedDate ?
                                `Нет доступных смен на ${selectedDate}` :
                                'Нет доступных смен'
                            }
                        </Text>
                    </View>
                }
            />
        </View>
    );
});

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    shiftsListContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 12,
    },
    shiftItemContainer: {
        alignItems: 'center',
    },
    screenCenterContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    locationRequestButton: {
        padding: 20,
        borderRadius: 50,
        backgroundColor: '#cbcaca',
        marginBottom: 20,
    },
    locationRequestButtonEmoji: {
        fontSize: 40,
    },
    locationNotFoundTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    locationNotFoundDescription: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingShiftsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    shiftsLoadErrorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
    shiftsLoadErrorDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    primaryActionButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    primaryActionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyShiftsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyShiftsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
