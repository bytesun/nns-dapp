<script lang="ts">
  import { authStore } from "$lib/stores/auth.store";
  import { isSignedIn } from "$lib/utils/auth.utils";
  import SignInAccounts from "$lib/pages/SignInAccounts.svelte";
  import { onMount } from "svelte";
  import { layoutTitleStore } from "$lib/stores/layout.store";
  import { i18n } from "$lib/stores/i18n";
  import RouteModule from "$lib/components/common/RouteModule.svelte";
  import { AppPath } from "$lib/constants/routes.constants";

  let signedIn = false;
  $: signedIn = isSignedIn($authStore.identity);

  onMount(() => layoutTitleStore.set($i18n.navigation.tokens));
</script>

{#if signedIn}
  <RouteModule path={AppPath.Accounts} />
{:else}
  <SignInAccounts />
{/if}
