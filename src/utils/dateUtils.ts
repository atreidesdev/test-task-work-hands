export const formatDateWithDayOfWeek = (dateString: string): string => {
    try {
        const [day, month, year] = dateString.split('.');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        const daysOfWeek = [
            'воскресенье', 'понедельник', 'вторник', 'среда',
            'четверг', 'пятница', 'суббота'
        ];

        const dayOfMonth = parseInt(day);
        const monthName = months[parseInt(month) - 1];
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${dayOfMonth} ${monthName}, ${dayOfWeek}`;
    } catch (error) {
        console.error('Ошибка при форматировании даты:', error);
        return dateString;
    }
};

export const formatDate = (dateString: string): string => {
    const [day, month] = dateString.split('.');
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${day} ${months[parseInt(month) - 1]}`;
};

export const getDayOfWeek = (dateString: string): string => {
    try {
        const date = new Date(dateString.split('.').reverse().join('-'));
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return days[date.getDay()];
    } catch (error) {
        return '??';
    }
};

export const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    const start = new Date(startDate.split('.').reverse().join('-'));
    const end = new Date(endDate.split('.').reverse().join('-'));

    const current = new Date(start);
    while (current <= end) {
        const day = String(current.getDate()).padStart(2, '0');
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const year = current.getFullYear();
        dates.push(`${day}.${month}.${year}`);
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

export const getCompleteDateRange = (dates: string[]): string[] => {
    if (dates.length === 0) return [];

    const sortedDates = [...dates].sort((a, b) =>
        new Date(a.split('.').reverse().join('-')).getTime() -
        new Date(b.split('.').reverse().join('-')).getTime()
    );

    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    return getDatesBetween(startDate, endDate);
};

export const hasShiftsForDate = (availableDates: string[], date: string): boolean => {
    return availableDates.includes(date);
};

export const getUniqueDatesFromShifts = (shifts: any[]): string[] => {
    return Array.from(new Set(shifts.map(shift => shift.dateStartByCity)))
        .sort((a, b) => new Date(a.split('.').reverse().join('-')).getTime() - new Date(b.split('.').reverse().join('-')).getTime());
};
