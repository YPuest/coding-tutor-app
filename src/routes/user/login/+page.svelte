<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	export let data;
	let redirectTo = data.redirectTo;

	let username = '';
	let password = '';
	let errorMessage = '';

	async function handleLogin() {
		errorMessage = '';
		try {
			const res = await fetch('http://localhost:8888/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Login fehlgeschlagen');
			}

			const data = await res.json();
			authStore.login(data.user_id, username);

			if (redirectTo === 'task') {
				goto('/task/generate');
			} else {
				goto('/user/profile');
			}

		} catch (err) {
			errorMessage = err.message;
		}
	}

	function handleRegister() {
		goto('/user/register');
	}
</script>

<div class="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
	<div class="max-w-md w-full bg-gray-800 p-4 rounded">
		<h1 class="text-2xl font-bold mb-4">Login</h1>

		{#if errorMessage}
			<p class="text-red-400 mb-2">{errorMessage}</p>
		{/if}

		<div class="mb-4">
			<label class="block mb-1 font-semibold">Benutzername</label>
			<input
				class="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
				bind:value={username}
				placeholder="Benutzername"
			/>
		</div>
		<div class="mb-4">
			<label class="block mb-1 font-semibold">Passwort</label>
			<input
				type="password"
				class="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
				bind:value={password}
				placeholder="Passwort"
			/>
		</div>

		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
			on:click={handleLogin}
		>
			Login
		</button>

		<div class="mt-6 w-full">
			<div class="mb-4 text-center">
				<p class="text-gray-500">- Neu hier? -</p>
			</div>
			<button
				class="bg-blue-600 hover:bg-blue-7	00 text-white py-2 px-4 rounded w-full"
				on:click={handleRegister}
			>
				Registrieren
			</button>
		</div>
	</div>
</div>