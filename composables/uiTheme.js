import { ref } from 'vue';
import { useState } from '#app';

// State yönetimi
export const useRtl = () => useState('rtl', () => ref(false));
export const useThemeMode = () => useState('mode', () => ref('light'));

// State ve localStorage senkronizasyonu
const states = {
  themeMode: useThemeMode,
  rtl: useRtl,
};

// Dark mode toggle fonksiyonu
export function toggleDark() {
  const themeMode = useThemeMode();
  const storedTheme = localStorage.getItem('luxiDarkMode') || 'light';

  themeMode.value = storedTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('luxiDarkMode', themeMode.value);
}

// RTL ayarlama fonksiyonu
export function setRtl(val) {
  const rtl = useRtl();
  rtl.value = val;
  localStorage.setItem('luxiRtl', val ? 'true' : 'false');
}

// Başlangıçta localStorage'den değerleri yükleyin
export function initializeStates() {
  const themeMode = useThemeMode();
  const rtl = useRtl();

  const storedTheme = localStorage.getItem('luxiDarkMode') || 'light';
  const storedRtl = localStorage.getItem('luxiRtl') === 'true';

  themeMode.value = storedTheme;
  rtl.value = storedRtl;
}

export default states;
