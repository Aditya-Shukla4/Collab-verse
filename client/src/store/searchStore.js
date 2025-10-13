// client/src/store/searchStore.js
import { create } from "zustand";
import api from "@/api/axios";

const useSearchStore = create((set) => ({
  query: "",
  suggestions: [],
  isLoading: false,

  setQuery: (newQuery) => set({ query: newQuery }),

  fetchSuggestions: async (query) => {
    if (query.length < 1) {
      set({ suggestions: [], isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/search/all?query=${query}`);
      set({ suggestions: data });
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      set({ suggestions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSuggestions: () => set({ suggestions: [] }),
  clearAll: () => set({ query: "", suggestions: [], isLoading: false }),
}));

export default useSearchStore;
