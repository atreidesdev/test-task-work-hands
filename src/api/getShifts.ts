import axios from 'axios';

export type Shift = {
    id: string;
    coordinates: {
        longitude: number;
        latitude: number;
    }
    logo: string;
    address: string;
    companyName: string;
    dateStartByCity: string;
    timeStartByCity: string;
    timeEndByCity: string;
    currentWorkers: number;
    planWorkers: number;
    workTypes: {
        id: number;
        name: string;
        nameGt5: string;
        nameLt5: string;
        nameOne: string;
    }[];
    priceWorker: number;
    bonusPriceWorker: number;
    customerFeedbacksCount: string;
    customerRating: number;
    isPromotionEnabled: boolean;
}

export type Coordinates = {
    latitude: number;
    longitude: number;
}

type ApiResponse = {
    data: Shift[];
    status: number;
}

const API_BASE_URL = 'https://mobile.handswork.pro/api/shifts';

export async function getShifts(coordinates: Coordinates): Promise<Shift[]> {
    try {
        const { latitude, longitude } = coordinates;

        const response = await axios.get<ApiResponse>(
            `${API_BASE_URL}/map-list-unauthorized`,
            {
                params: {
                    latitude,
                    longitude
                }
            }
        );

        return response.data.data || [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Ошибка при получении смен:', error.message);
            throw new Error(`Не удалось получить данные о сменах: ${error.message}`);
        } else {
            console.error('Неизвестная ошибка:', error);
            throw new Error('Произошла неизвестная ошибка при получении смен');
        }
    }
}

export default getShifts;
