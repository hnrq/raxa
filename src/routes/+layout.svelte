<script lang="ts">
  import { browser } from '$app/environment';
  import '$lib/theme/index.css';
  import { onMount, type Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  onMount(() => {
    if (browser)
      document.body.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!(e.key === 'Enter' && (e.metaKey || e.ctrlKey)) || !e.target) return;

        if ('form' in e.target) {
          const formElement = e.target.form as HTMLFormElement;
          formElement?.requestSubmit();
        }
      });
  });
</script>

{@render children()}
