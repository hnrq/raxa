import { browser } from '$app/environment';

const localStore = <T>(key: string) => {
  if (!browser) return;

  let value = $state<T | undefined>(localStorage[key]);

  $effect(() => localStorage.setItem(key, value as string));

  return {
    get value() {
      return value;
    },
    set: (newValue: T) => (value = newValue)
  };
};

export default localStore;
