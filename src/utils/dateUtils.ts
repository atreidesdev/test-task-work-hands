export const formatDate = (dateString: string): string => {
    const [day, month] = dateString.split('.');
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${day} ${months[parseInt(month) - 1]}`;
};
