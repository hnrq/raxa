// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface PageState {
      modalShown?: 'debts' | 'expense';
      expenseId?: string;
    }
    // interface Platform {}
  }
}

export {};
