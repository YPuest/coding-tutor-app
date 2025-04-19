<script>
	import { taskStore } from '$lib/stores/taskStore';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { API_BASE } from "$lib/config";
	import InfoIcon from '$lib/components/InfoIcon.svelte';

	let auth;
	let isClient = false;

	onMount(() => {
		isClient = true;
	});

	$: if (isClient) {
		auth = $authStore;
		if (!auth.isLoggedIn) {
			goto('/');
		}
	}

	let language = "";
	let level = "medium";
	let comment = "";
	let generatedTask = "";
	let timeEstimation = 0;
	let estimatedTime = "";

	let useAI = true;
	let generateTaskCheck = false;

	const formatTime = (sec) => {
		const hours = Math.floor(sec / 3600);
		const minutes = Math.floor((sec % 3600) / 60);
		const seconds = sec % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	async function generateTask() {
		generateTaskCheck = true;
		try {
			let normalizedLanguage = ""
			if (language === "") {
				normalizedLanguage = "python"
			} else {
				normalizedLanguage = language.toLowerCase();
			}

			const response = await fetch(`${API_BASE}/api/task/generate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: normalizedLanguage,
					level: level,
					comment: comment
				})
			});
			if (!response.ok) {
				throw new Error('Fehler beim Abrufen der Aufgabe');
			}

			const data = await response.json();

			generatedTask = data.task;
			timeEstimation = data.time_estimation_minutes;

			estimatedTime = formatTime(timeEstimation * 60);

			taskStore.set({
				task: data.task,
				timeEstimation: data.time_estimation_minutes,
				language: normalizedLanguage,
				level: level,
				useAI: useAI,
				visitedGenerate: true
			});

		} catch (error) {
			console.error(error);
		}
		generateTaskCheck = false;
	}

	async function goToSolvePage() {
		try {
			const response = await fetch(`${API_BASE}/api/task/save`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: $authStore.userId,
					description: generatedTask,
					language: language.toLowerCase(),
					level: level,
					time_estimated: (timeEstimation * 60)
				})
			});
			const data = await response.json();

			taskStore.update(state => ({
				...state,
				taskId: data.task_id
			}));
		} catch (error) {
			console.error(error);
		}

		window.location.href = '/task/solve';
	}
</script>

<div class="min-h-screen bg-gray-900 text-white p-6">
	<h1 class="text-2xl font-bold mb-6 text-center">Aufgabenerstellung</h1>

	<div class="flex flex-row gap-8 justify-center">
		<div class="w-full max-w-md space-y-4 border border-gray-700 bg-gray-800 p-4 rounded">
			<h2 class="text-xl font-semibold mb-2">Einstellungen</h2>

			<div>
				<label class="block font-semibold mb-1" for="language">Sprache:</label>
				<input
					id="language"
					type="text"
					bind:value={language}
					placeholder="z. B. Python, Go,..."
					class="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<fieldset>
				<legend class="block font-semibold mb-1">Level:</legend>
				<div class="pl-4 space-y-2">
					{#each ["super easy", "easy", "medium", "hard", "super hard"] as lvl}
						<label class="block">
							<input
								type="radio"
								class="form-radio text-blue-500 mr-2"
								bind:group={level}
								value={lvl}
							/>
							{lvl}
						</label>
					{/each}
				</div>
			</fieldset>

			<div>
				<label class="block font-semibold mb-1" for="comment">Anmerkungen:</label>
				<textarea
					id="comment"
					bind:value={comment}
					placeholder="z. B. GUI, DB,..."
					class="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				></textarea>
			</div>

			<div class="mt-4">
				<label class="flex items-center space-x-2">
					<input
						type="checkbox"
						class="form-checkbox text-blue-500"
						bind:checked={useAI}
					/>
					<span>KI-Unterstützung aktivieren</span>
					<InfoIcon tooltip="KI-Unterstützung aktivieren ermöglicht dir, Hilfe über den Chat zu erhalten."/>
				</label>
			</div>

			<button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							on:click={generateTask}
			>
				{#if generateTaskCheck}
					<svg class="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				{/if}
				<span>Aufgabe generieren</span>
			</button>
		</div>

		<div class="w-full max-w-md border border-gray-700 bg-gray-800 p-4 rounded">
			<div class="flex items-center gap-2 mb-2">
				<h2 class="text-xl font-semibold mb-2">Aufgaben-Vorschau</h2>
				<div class="self-center">
					<InfoIcon tooltip="Die Aufgabe wird mit Hilfe von KI generiert. Inhalte können ungenau oder fehlerhaft sein. Die Zeitangabe dient lediglich als grobe Orientierung." />
				</div>
			</div>
			{#if generatedTask}
				<p class="mb-2">{generatedTask}</p>
				<p class="text-sm text-gray-400">
					Geschätzte Bearbeitungszeit: {estimatedTime}
				</p>

				<button
					class="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
					on:click={goToSolvePage}
				>
					Weiter zur Lösung
				</button>
			{:else}
				<p class="text-gray-400">Noch keine Aufgabe generiert.</p>
			{/if}
		</div>
	</div>
</div>