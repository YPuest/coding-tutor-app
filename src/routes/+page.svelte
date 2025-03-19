<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	$: auth = $authStore;

	function handleStart() {
		if (auth.isLoggedIn) {
			goto('/task/generate');
		} else {
			goto('/user/login?redirect=task');
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
	<h1 class="text-3xl font-bold mb-4">Willkommen bei deinem Coding Tutor</h1>

	<p class="text-lg text-gray-300 max-w-xl text-center mb-8">
		Diese Plattform unterstützt dich bei der Erstellung von Programmieraufgaben und
		ermöglicht es dir, mithilfe einer KI gezielt Feedback und Hilfestellungen zu erhalten.
		Starte jetzt, um deine Fähigkeiten effizient und interaktiv zu verbessern!
	</p>

	<button
		class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
		on:click={handleStart}
	>
		Jetzt starten
	</button>
</div>