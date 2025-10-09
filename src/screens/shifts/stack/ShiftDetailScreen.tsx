import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { ShiftDetailsScreenRouteProp } from "../../../navigation/types.ts";
import { useStore } from "../../../store/store.tsx";
import { getShiftTimeAndDuration, getShiftTypeInfo } from "../../../utils/shiftTimeUtils.ts";

export const ShiftDetailsScreen = observer(() => {
    const route = useRoute<ShiftDetailsScreenRouteProp>();
    const { shiftsStore } = useStore();
    const { shiftId } = route.params;

    useEffect(() => {
        shiftsStore.setSelectedShiftById(shiftId);
    }, [shiftId, shiftsStore]);

    if (!shiftsStore.selectedShift) {
        return (
            <View style={styles.shiftNotFoundContainer}>
                <Text>Смена не найдена</Text>
            </View>
        );
    }

    const shift = shiftsStore.selectedShift;
    const { durationText } = getShiftTimeAndDuration(shift.timeStartByCity, shift.timeEndByCity);
    const workType = shift.workTypes && shift.workTypes.length > 0 ? shift.workTypes[0] : null;

    const shiftTypeInfo = getShiftTypeInfo(shift.timeStartByCity, shift.timeEndByCity);
    const formattedDate = formatDateWithDayOfWeek(shift.dateStartByCity);

    return (
        <ScrollView contentContainerStyle={styles.mainScrollContainer}>
            <View style={styles.logoImageContainer}>
                <Image
                    source={{uri: shift.logo}}
                    resizeMode="cover"
                    width={150}
                    height={150}
                    style={styles.logoImage}
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoContainerHeader}>Основное</Text>
                <Text>Тип работы: {workType?.nameOne || 'Не указано'}</Text>
                <Text>Компания: {shift.companyName}</Text>
                <Text>Адрес: {shift.address}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoContainerHeader}>Дата и время</Text>
                <Text>
                    {shiftTypeInfo.emoji} {shiftTypeInfo.name}
                </Text>
                <Text>{formattedDate}</Text>
                <Text>Начало: {shift.timeStartByCity}</Text>
                <Text>Окончание: {shift.timeEndByCity}</Text>
                <Text>Продолжительность: ~{durationText}</Text>

            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoContainerHeader}>Работники:</Text>
                <Text>Текущие: {shift.currentWorkers}</Text>
                <Text>Планируемые: {shift.planWorkers}</Text>
                <Text>Статус: {shift.currentWorkers}/{shift.planWorkers}</Text>
                <Text>
                    Заполнено: {Math.round((shift.currentWorkers / shift.planWorkers) * 100)}%
                </Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoContainerHeader}>Оплата</Text>
                <Text>Основная: {shift.priceWorker.toLocaleString('ru-RU')} ₽</Text>
                <Text>Бонусная: {shift.bonusPriceWorker.toLocaleString('ru-RU')} ₽</Text>
                <Text>Общая: {(shift.priceWorker + shift.bonusPriceWorker).toLocaleString('ru-RU')} ₽</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoContainerHeader}>Отзывы и рейтинг</Text>
                <Text>Рейтинг: ⭐ {shift.customerRating || 'Нет рейтинга'}</Text>
                <Text>Количество отзывов: {shift.customerFeedbacksCount || 'Нет отзывов'}</Text>
            </View>
        </ScrollView>
    );
});

import { StyleSheet } from 'react-native';
import {formatDateWithDayOfWeek} from "../../../utils/dateUtils.ts";

const styles = StyleSheet.create({
    mainScrollContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        gap: 20
    },
    shiftNotFoundContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImageContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoImage: {
        borderRadius: 16
    },
    infoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    infoContainerHeader: {
        fontSize: 20,
    }
});
