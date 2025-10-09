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
