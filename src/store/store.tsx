import React, { createContext, useContext, ReactNode } from 'react';
import { locationStore, LocationStore } from './LocationStore';
import { shiftsStore, ShiftsStore } from './ShiftsStore';

class RootStore {
    locationStore: LocationStore;
    shiftsStore: ShiftsStore;

    constructor() {
        this.locationStore = locationStore;
        this.shiftsStore = shiftsStore;
    }
}

export const rootStore = new RootStore();

const StoreContext = createContext(rootStore);

interface StoreProviderProps {
    children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore должен быть с StoreProvider');
    }
    return context;
};
