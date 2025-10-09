import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Shift } from '../api/getShifts.ts';
import {formatDate, getDayOfWeek} from '../utils/dateUtils.ts';

type DateScrollProps = {
    shifts: Shift[];
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export const DateScroll = ({shifts, selectedDate, onDateSelect}: DateScrollProps) => {
    const uniqueDates = Array.from(new Set(shifts.map(shift => shift.dateStartByCity)))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (uniqueDates.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {uniqueDates.map((date) => (
                    <TouchableOpacity
                        key={date}
                        style={[
                            styles.dateButton,
                            selectedDate === date && styles.dateButtonSelected
                        ]}
                        onPress={() => onDateSelect(date)}
                    >
                        <Text style={[
                            styles.dateText,
                            selectedDate === date && styles.dateTextSelected
                        ]}>
                            {formatDate(date)}
                        </Text>
                        <Text style={[
                            styles.dayText,
                            selectedDate === date && styles.dayTextSelected
                        ]}>
                            {getDayOfWeek(date)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    dateButton: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f8f8f8',
        minWidth: 70,
    },
    dateButtonSelected: {
        backgroundColor: 'blue',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateTextSelected: {
        color: 'white',
    },
    dayText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    dayTextSelected: {
        color: 'white',
    },
});
