<script lang="ts">
  import type { Proposal } from "@dfinity/nns";
  import Markdown from "$lib/components/ui/Markdown.svelte";

  export let proposal: Proposal | undefined;

  let summary: string | undefined;
  $: summary = proposal?.summary;

  let showTitle: boolean;
  $: showTitle = $$slots.title !== undefined;
</script>

<div class="markdown">
  {#if showTitle}
    <div class="title"><slot name="title" /></div>
  {/if}

  <Markdown text={summary} />
</div>

<style lang="scss">
  @use "@dfinity/gix-components/styles/mixins/media";

  .title {
    margin-bottom: var(--padding-4x);
  }

  .markdown {
    overflow-wrap: break-word;

    :global(a) {
      font-size: inherit;
    }

    :global(pre) {
      // make the <code> scrollable
      overflow-x: auto;
    }

    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      line-height: var(--line-height-standard);
      font-weight: normal;
      color: inherit;
    }

    :global(h1) {
      font-size: var(--font-size-h4);
    }

    :global(h2) {
      font-size: var(--font-size-h5);
    }

    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      zoom: 0.8;
    }

    :global(table) {
      display: block;
      overflow: auto;
      padding: var(--padding) 0 var(--padding);
      margin: var(--padding) 0 var(--padding-2x);
    }
  }
</style>
