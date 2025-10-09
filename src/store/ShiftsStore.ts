import { makeAutoObservable, runInAction } from 'mobx';
import { Shift } from '../api/getShifts.ts';

export class ShiftsStore {
    shifts: Shift[] = [];
    selectedShift: Shift | null = null;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setShifts = (shifts: Shift[]) => {
        runInAction(() => {
            this.shifts = shifts;
            this.error = null;
        });
    };

    setSelectedShiftById = (shiftId: string) => {
        const shift = this.shifts.find(s => s.id === shiftId);
        runInAction(() => {
            this.selectedShift = shift || null;
        });
    };

}

export const shiftsStore = new ShiftsStore();
