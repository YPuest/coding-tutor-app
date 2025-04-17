<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import '../app.css';

	$: auth = $authStore;

	function handleLogout() {
		authStore.logout();

		goto('/');
	}
</script>

<div class="h-screen overflow-hidden bg-gray-900 text-white flex flex-col">
	<nav class="bg-gray-800 text-white p-4 flex items-center">
		<div class="flex items-center gap-4 flex-grow">
			<a href="/" class="hover:underline">
				Start
			</a>
			{#if auth.isLoggedIn}
				<a href="/user/profile" class="hover:underline">Profil</a>
				<a href="/task/generate" class="hover:underline">Übung</a>
			{/if}
		</div>

		<div class="flex items-center gap-4">
			{#if auth.isLoggedIn}
				<button on:click={() => handleLogout()} class="hover:underline">Logout</button>
			{:else}
				<a href="/user/login" class="hover:underline">Login</a>
			{/if}
		</div>
	</nav>

	<main class="flex-1 overflow-hidden">
		<slot />
	</main>
</div>