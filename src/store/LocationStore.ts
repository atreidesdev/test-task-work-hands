import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

const LOCATION_STORAGE_KEY = 'user_location';

export type Coordinates = {
    latitude: number;
    longitude: number;
}

type GeolocationPosition = {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
}

type GeolocationError = {
    code: number;
    message: string;
    PERMISSION_DENIED: number;
    POSITION_UNAVAILABLE: number;
    TIMEOUT: number;
}

export class LocationStore {
    coordinates: Coordinates | null = null;
    isLoading = false;
    error: string | null = null;
    isPermissionGranted = false;

    constructor() {
        makeAutoObservable(this);
        this.loadStoredLocation();
    }

    loadStoredLocation = async (): Promise<void> => {
        try {
            const storedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
            if (storedLocation) {
                const location: Coordinates = JSON.parse(storedLocation);
                runInAction(() => {
                    this.coordinates = location;
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки геолокации', error);
        }
    };

    saveLocation = async (coordinates: Coordinates): Promise<void> => {
        try {
            await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(coordinates));
            runInAction(() => {
                this.coordinates = coordinates;
                this.error = null;
            });
        } catch (error) {
            console.error('Error', error);
            runInAction(() => {
                this.error = 'Ошибка сохранения геолокации';
            });
        }
    };

    requestLocation = async (): Promise<void> => {
        runInAction(() => {
            this.isLoading = true;
            this.error = null;
        });

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                async (position: GeolocationPosition) => {
                    const coordinates: Coordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    await this.saveLocation(coordinates);

                    runInAction(() => {
                        this.isLoading = false;
                        this.isPermissionGranted = true;
                    });
                    resolve();
                },
                (error: GeolocationError) => {
                    runInAction(() => {
                        this.isLoading = false;
                        this.error = this.getGeolocationError(error);
                    });
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                }
            );
        });
    };

    private getGeolocationError = (error: GeolocationError): string => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return 'Доступ к геолокации запрещен. Разрешите доступ в настройках устройства.';
            case error.POSITION_UNAVAILABLE:
                return 'Информация о местоположении недоступна.';
            case error.TIMEOUT:
                return 'Время ожидания геолокации истекло.';
            default:
                return 'Не удалось определить местоположение.';
        }
    };


    getCoordinates = (): Coordinates => {
        if (this.coordinates) {
            return this.coordinates;
        }

        return {
            latitude: 45.039268,
            longitude: 38.987221,
        };
    };
}

export const locationStore = new LocationStore();
