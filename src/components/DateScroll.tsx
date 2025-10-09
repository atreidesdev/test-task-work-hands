import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Shift} from '../api/getShifts.ts';
import {
    formatDate,
    getDayOfWeek,
    getCompleteDateRange,
    getUniqueDatesFromShifts,
    hasShiftsForDate
} from '../utils/dateUtils.ts';

type DateScrollProps = {
    shifts: Shift[];
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export const DateScroll = ({shifts, selectedDate, onDateSelect}: DateScrollProps) => {
    const uniqueDates = getUniqueDatesFromShifts(shifts);
    const completeDateRange = getCompleteDateRange(uniqueDates);

    if (completeDateRange.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {completeDateRange.map((date) => (
                    <TouchableOpacity
                        key={date}
                        style={[
                            styles.dateButton,
                            selectedDate === date && styles.dateButtonSelected,
                            !hasShiftsForDate(uniqueDates, date) && styles.dateButtonEmpty
                        ]}
                        onPress={() => onDateSelect(date)}
                        disabled={!hasShiftsForDate(uniqueDates, date)}
                    >
                        <Text style={[
                            styles.dateText,
                            selectedDate === date && styles.dateTextSelected,
                            !hasShiftsForDate(uniqueDates, date) && styles.dateTextEmpty
                        ]}>
                            {formatDate(date)}
                        </Text>
                        <Text style={[
                            styles.dayText,
                            selectedDate === date && styles.dayTextSelected,
                            !hasShiftsForDate(uniqueDates, date) && styles.dayTextEmpty
                        ]}>
                            {getDayOfWeek(date)}
                        </Text>
                        {hasShiftsForDate(uniqueDates, date) && (
                            <View style={[
                                styles.shiftIndicator,
                                selectedDate === date && styles.shiftIndicatorSelected
                            ]} />
                        )}
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
        position: 'relative',
    },
    dateButtonSelected: {
        backgroundColor: 'blue',
    },
    dateButtonEmpty: {
        backgroundColor: '#f0f0f0',
        opacity: 0.6,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateTextSelected: {
        color: 'white',
    },
    dateTextEmpty: {
        color: '#999',
        fontWeight: 'normal',
    },
    dayText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    dayTextSelected: {
        color: 'white',
    },
    dayTextEmpty: {
        color: '#999',
    },
    shiftIndicator: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'green',
    },
    shiftIndicatorSelected: {
        backgroundColor: 'white',
    },
});
