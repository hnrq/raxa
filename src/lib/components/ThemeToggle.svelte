<script lang="ts">
  import localStore from '$lib/stores/localStore.svelte';

  let { class: className = '' } = $props();
  let theme = localStore<'light' | 'dark'>('theme');

  const toggleTheme = () => theme?.set(theme.value === 'light' ? 'dark' : 'light');

  $effect(() => {
    document.documentElement.classList.remove('light', 'dark');
    if (typeof theme?.value === 'string') document.documentElement.classList.add(theme.value);
  });
</script>

<button type="submit" onclick={toggleTheme} class={`button--text ${className}`}>
  {theme?.value === 'light' ? 'LIGHT' : 'DARK'}
</button>
