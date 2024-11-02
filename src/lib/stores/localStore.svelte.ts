import { browser } from '$app/environment';

const localStore = <T>(key: string, defaultValue?: string) => {
  if (!browser) return;

  let value = $state<T | undefined>(localStorage[key] ?? defaultValue);

  $effect(() => {
    if (value) localStorage.setItem(key, value as string);
    else localStorage.removeItem(key);
  });

  return {
    get value() {
      return value;
    },
    set: (newValue: T) => (value = newValue)
  };
};

export default localStore;
