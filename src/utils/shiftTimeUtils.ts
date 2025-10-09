export type Duration = {
    hours: number;
    minutes: number;
    totalMinutes: number;
}

export type ShiftTypeInfo = {
    emoji: string;
    name: string;
}

export const calculateShiftDuration = (timeStart: string, timeEnd: string): Duration => {
    try {
        const [startHours, startMinutes] = timeStart.split(':').map(Number);
        const [endHours, endMinutes] = timeEnd.split(':').map(Number);

        let totalStartMinutes = startHours * 60 + startMinutes;
        let totalEndMinutes = endHours * 60 + endMinutes;

        if (totalEndMinutes < totalStartMinutes) {
            totalEndMinutes += 24 * 60;
        }

        const totalMinutes = totalEndMinutes - totalStartMinutes;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return {
            hours,
            minutes,
            totalMinutes
        };
    } catch (error) {
        console.error('Ошибка при вычислении продолжительности смены:', error);
        return {
            hours: 0,
            minutes: 0,
            totalMinutes: 0
        };
    }
};

export const formatDuration = (duration: Duration): string => {
    const { hours, minutes } = duration;

    if (hours === 0 && minutes === 0) {
        return '0 ч';
    }

    const hoursText = hours > 0 ? `${hours} ч` : '';
    const minutesText = minutes > 0 ? `${minutes} мин` : '';

    return [hoursText, minutesText].filter(Boolean).join(' ');
};

export const formatShiftTime = (timeStart: string, timeEnd: string): string => {
    return `${timeStart}-${timeEnd}`;
};

export const getShiftTypeInfo = (timeStart: string, timeEnd: string): ShiftTypeInfo => {
    try {
        const [startHours] = timeStart.split(':').map(Number);
        const [endHours] = timeEnd.split(':').map(Number);

        const endsNextDay = endHours < startHours;

        if ((startHours >= 22 || startHours < 6) || endsNextDay) {
            return {
                emoji: '🌙',
                name: 'Ночная смена',
            };
        }
        else if (startHours >= 6 && startHours < 12 && endHours <= 14) {
            return {
                emoji: '☀️',
                name: 'Утренняя смена',
            };
        }
        else if (startHours >= 6 && startHours < 18 && endHours <= 22) {
            return {
                emoji: '🌞',
                name: 'Дневная смена',
            };
        }
        else if (startHours >= 18 && startHours < 22 && endHours <= 24) {
            return {
                emoji: '🌆',
                name: 'Вечерняя смена',
            };
        }
        else {
            return {
                emoji: '⏱️',
                name: 'Стандартная смена',
            };
        }
    } catch (error) {
        console.error('Ошибка при определении типа смены:', error);
        return {
            emoji: '⏱️',
            name: 'Смена',
        };
    }
};

export const getShiftTypeEmoji = (timeStart: string, timeEnd: string): string => {
    return getShiftTypeInfo(timeStart, timeEnd).emoji;
};

export const getShiftTimeAndDuration = (timeStart: string, timeEnd: string) => {
    const duration = calculateShiftDuration(timeStart, timeEnd);
    const timeText = formatShiftTime(timeStart, timeEnd);
    const durationText = formatDuration(duration);
    const shiftEmoji = getShiftTypeEmoji(timeStart, timeEnd);
    const shiftTypeInfo = getShiftTypeInfo(timeStart, timeEnd);

    return {
        timeText,
        durationText,
        duration,
        shiftEmoji,
        shiftTypeInfo
    };
};
