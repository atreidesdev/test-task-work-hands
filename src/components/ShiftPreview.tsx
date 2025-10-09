import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import {Shift} from "../api/getShifts.ts";
import {
    getShiftTimeAndDuration,
} from "../utils/shiftTimeUtils.ts";

interface ShiftPreviewProps {
    shift: Shift;
}

export const ShiftPreview = ({ shift }: ShiftPreviewProps) => {
    const { timeText, durationText, shiftEmoji } = getShiftTimeAndDuration(shift.timeStartByCity, shift.timeEndByCity);

    const workType = shift.workTypes && shift.workTypes.length > 0
        ? shift.workTypes[0]
        : { nameOne: 'Не указано' };

    return (
        <View style={styles.shift}>
            <View style={styles.shiftHeader}>
                <Image
                    source={{uri: shift.logo}}
                    resizeMode="cover"
                    width={40}
                    height={40}
                    style={styles.shiftLogo}
                />
                <View style={styles.shiftHeaderInfo}>
                    <Text style={styles.shiftHeaderInfoName}>{workType.nameOne}</Text>
                    <Text
                        style={styles.shiftHeaderInfoCompanyAddress}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {shift.companyName} • {shift.address}
                    </Text>
                </View>
            </View>
            <View style={styles.shiftFooter}>
                <Text style={styles.shiftFooterPrice}>{shift.priceWorker.toLocaleString('ru-RU')} ₽/задание</Text>
                <View style={styles.shiftFooterTime}>
                    <Text style={styles.shiftFooterTimeText}>
                        {timeText}
                    </Text>
                    <Text style={styles.shiftFooterTimeDuration}>~{durationText} {shiftEmoji} </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shift: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#E6E4E0',
        paddingTop: 10,
        paddingBottom: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        width: '95%',
        gap: 10
    },
    shiftHeader: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    shiftHeaderInfo: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    shiftHeaderInfoName: {
        fontWeight: "bold",
        fontSize: 18
    },
    shiftHeaderInfoCompanyAddress: {
        color: 'grey',
        fontSize: 12,
        flex: 1,
        flexWrap: 'wrap',

    },
    shiftFooter: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    shiftFooterPrice: {
        color: 'green',
        fontSize: 18,
    },
    shiftFooterTime: {
        display: "flex",
        flexDirection: "column"
    },
    shiftFooterTimeText: {
        fontWeight: "semibold",
        fontSize: 14,
    },
    shiftFooterTimeDuration: {
        color: "grey",
        fontSize: 12,
    },
    shiftLogo: {
        borderRadius: 8
    }
});
