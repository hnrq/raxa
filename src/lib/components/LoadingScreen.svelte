<script lang="ts">
  let { message = 'Loading...', subtitle }: { message?: string; subtitle?: string } = $props();
</script>

<div class="loading-screen">
  <span>{message}</span>
  {#if subtitle}
    <small>{subtitle}</small>
  {/if}
</div>

<style>
  .loading-screen {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .loading-screen small {
    color: var(--text-medium);
  }
</style>
