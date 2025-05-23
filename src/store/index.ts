import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '@/types';

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  
  // UI state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  
  // Reset the entire store
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'system' as const,
  isLoading: false,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setUser: (user) => set({
          user,
          isAuthenticated: !!user,
        }),
        
        setTheme: (theme) => set({ theme }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        reset: () => set(initialState),
      }),
      {
        name: 'app-storage', // name of the item in the storage (must be unique)
        partialize: (state) => ({
          // Only persist these fields
          theme: state.theme,
          // Don't persist user data in localStorage for security
        }),
      }
    ),
    { name: 'AppStore' }
  )
);

// Selectors
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useIsLoading = () => useAppStore((state) => state.isLoading);

// Actions
export const { setUser, setTheme, setLoading, reset } = useAppStore.getState();
