<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore.js';
	import { API_BASE } from "$lib/config";

	let auth = $authStore;
	let username = "";
	let oldPassword = "";
	let newPassword = "";
	let errorMessage = "";

	onMount(() => {
		if (!auth.isLoggedIn) {
			goto('/');
		}
	});

	async function changeUsername() {
		const res = await fetch(`${API_BASE}/api/user/settings/change-username`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_id: auth.userId, username })
		});

		const data = await res.json();
		if (!res.ok) {
			errorMessage = data.error;
		} else {
			alert("Nutzername erfolgreich geändert!");
		}
	}

	async function changePassword() {
		const res = await fetch(`${API_BASE}/api/user/settings/change-password`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_id: auth.userId, old_password: oldPassword, new_password: newPassword })
		});

		const data = await res.json();
		if (!res.ok) {
			errorMessage = data.error;
		} else {
			alert("Passwort erfolgreich geändert!");
		}
	}

	async function deleteAccount() {
		if (!confirm("Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!")) {
			return;
		}

		const res = await fetch(`${API_BASE}/api/user/settings/delete-account`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_id: auth.userId })
		});

		if (!res.ok) {
			alert("Fehler beim Löschen des Kontos.");
		} else {
			alert("Konto gelöscht.");
			goto('/');
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
	<h1 class="text-3xl font-bold mb-6">Einstellungen</h1>

	<div class="mb-8 flex gap-4">
		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
			on:click={() => goto('/user/profile')}
		>
			Profil
		</button>
		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
			on:click={() => goto('/user/profile/stats')}
		>
			Statistiken
		</button>
		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
			on:click={() => goto('/user/profile/tasks')}
		>
			Aufgaben
		</button>
	</div>

	<div class="grid gap-4 bg-gray-800 p-4 rounded shadow-lg w-[50%]">
		{#if errorMessage}
			<p class="text-red-400">{errorMessage}</p>
		{/if}

		<div class="flex flex-col gap-4">
			<input class="p-2 rounded bg-gray-700 text-white" bind:value={username} placeholder="Neuer Nutzername">
			<button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" on:click={changeUsername}>
				Nutzernamen ändern
			</button>
		</div>

		<div class="flex flex-col gap-4">
			<input type="password" class="p-2 rounded bg-gray-700 text-white" bind:value={oldPassword} placeholder="Altes Passwort">
			<input type="password" class="p-2 rounded bg-gray-700 text-white" bind:value={newPassword} placeholder="Neues Passwort">
			<button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" on:click={changePassword}>
				Passwort ändern
			</button>
		</div>

		<div class="mt-16 w-full">
			<button class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full" on:click={deleteAccount}>
				Konto löschen
			</button>
		</div>
	</div>
</div>
