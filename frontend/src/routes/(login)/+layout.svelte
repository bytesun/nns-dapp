<script lang="ts">
  import Banner from "$lib/components/header/Banner.svelte";
  import { onMount } from "svelte";
  import { initAppAuth } from "$lib/services/$public/app.services";

  onMount(async () => await initAppAuth());
</script>

<div class="container" data-tid="auth-layout">
  <Banner />

  <main data-tid="auth-page">
    <slot />
  </main>
</div>

<style lang="scss">
  @use "@dfinity/gix-components/styles/mixins/display";

  .container {
    position: fixed;
    @include display.inset;

    display: block;

    background: var(--body-background);
    color: var(--label-color);
  }

  main {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: transparent;
    overflow-y: auto;

    padding: var(--padding-6x) var(--padding-4x);

    @media (min-width: 768px) and (min-height: 620px) {
      justify-content: center;
      align-items: center;
      max-width: 540px;
      text-align: center;
    }
  }
</style>
