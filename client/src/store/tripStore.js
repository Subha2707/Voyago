import { create } from 'zustand';

const useTripStore = create((set) => ({
  currentTrip: null,
  tripResults: null,
  surpriseResults: null,
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setTripResults: (results) => set({ tripResults: results }),
  setSurpriseResults: (results) => set({ surpriseResults: results }),
  clearTrip: () => set({ currentTrip: null, tripResults: null }),
}));

export { useTripStore };
