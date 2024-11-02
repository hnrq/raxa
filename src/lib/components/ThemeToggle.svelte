<script lang="ts">
  import localStore from '$lib/stores/localStore.svelte';

  let { class: className = '' } = $props();
  let theme = localStore<'light' | 'dark'>('theme', 'light');

  const toggleTheme = () => theme?.set(theme.value === 'light' ? 'dark' : 'light');

  $effect(() => {
    if (typeof theme?.value === 'string') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme.value);
    }
  });
</script>

<button type="submit" onclick={toggleTheme} class={`button--text ${className}`}>
  {theme?.value === 'dark' ? 'DARK' : 'LIGHT'}
</button>
