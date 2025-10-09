export type Duration = {
    hours: number;
    minutes: number;
    totalMinutes: number;
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

    const hoursText = hours > 0 ? `${hours} часов` : '';
    const minutesText = minutes > 0 ? `${minutes} минут` : '';

    return [hoursText, minutesText].filter(Boolean).join(' ');
};

export const formatShiftTime = (timeStart: string, timeEnd: string): string => {
    return `${timeStart}-${timeEnd}`;
};

export const getShiftTimeAndDuration = (timeStart: string, timeEnd: string) => {
    const duration = calculateShiftDuration(timeStart, timeEnd);
    const timeText = formatShiftTime(timeStart, timeEnd);
    const durationText = formatDuration(duration);

    return {
        timeText,
        durationText,
        duration
    };
};

