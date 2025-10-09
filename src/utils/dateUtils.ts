export const formatDate = (dateString: string): string => {
    const [day, month] = dateString.split('.');
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${day} ${months[parseInt(month) - 1]}`;
};

export const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString.split('.').reverse().join('-'));
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[date.getDay()];
};
