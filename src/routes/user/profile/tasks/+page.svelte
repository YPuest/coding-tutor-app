<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { API_BASE } from "$lib/config";
	import { authStore } from '$lib/stores/authStore.js';

	let auth = $authStore;
	let tasks = writable([]);
	let selectedTaskId = writable(null);

	let sortBy = 'language';

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto('/');
		} else {
			const res = await fetch(`${API_BASE}/api/user/tasks?user_id=${auth.userId}`);
			const data = await res.json();
			tasks.set(data);
		}
	});

	const formatTime = (sec) => {
		const hours = Math.floor(sec / 3600);
		const minutes = Math.floor((sec % 3600) / 60);
		const seconds = sec % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	$: sortedTasks = $tasks ? [...$tasks].sort((a, b) => a[sortBy]?.localeCompare(b[sortBy] ?? '')) : [];
</script>

<div class="flex flex-col bg-gray-900 text-white p-6 h-[calc(100vh-2rem)]">
	<div class="flex flex-col items-center">
		<h1 class="text-3xl font-bold mb-4">Aufgaben</h1>

		<div class="mb-8 flex gap-4">
			<button
				class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
				on:click={() => goto('/user/profile')}
			>
				Profil
			</button>
			<button
				class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
				on:click={() => goto('/user/profile/settings')}
			>
				Einstellungen
			</button>
			<button
				class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
				on:click={() => goto('/user/profile/stats')}
			>
				Statistiken
			</button>
		</div>
	</div>

	<div class="table-container rounded-lg shadow flex-1 overflow-hidden relative">
		<div class="table-wrapper overflow-y-scroll max-h-[70vh]">
			<table class="w-full text-left divide-y divide-gray-700">
				<thead class="bg-gray-800 sticky top-0 z-10">
				<tr>
					<th class="px-4 py-3">Aufgabe</th>
					<th class="px-4 py-3">Sprache</th>
					<th class="px-4 py-3">Level</th>
					<th class="px-4 py-3">Note</th>
					<th class="px-4 py-3">Bewertung</th>
					<th class="px-4 py-3">KI-Einsatz</th>
					<th class="px-4 py-3">Bearbeitungszeit</th>
					<th class="px-4 py-3">Zeitschätzung</th>
				</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
				{#each sortedTasks as task}
					<tr class="hover:bg-gray-800/50 transition cursor-pointer"
							class:text-red-400={task.mark === null}
							on:click={() => goto(`/user/profile/tasks/task/${task.id}`)}>
						<td class="px-4 py-3 tooltip">
							{task.description.slice(0, 20)}...
							<div class="tooltiptext">{task.description}</div>
						</td>
						<td class="px-4 py-3">{task.language}</td>
						<td class="px-4 py-3">{task.level}</td>
						<td class="px-4 py-3">{task.mark ?? '-'}</td>
						<td class="px-4 py-3 tooltip">
							{task.rating ? task.rating.slice(0, 20) + '...' : 'Keine Bewertung'}
							<span class="tooltiptext">{task.rating ?? 'Keine Bewertung'}</span>
						</td>
						<td class="px-4 py-3">{task.ai_usage ? 'Ja' : 'Nein'}</td>
						<td class="px-4 py-3">{formatTime(task.time_spent)}</td>
						<td class="px-4 py-3">{formatTime(task.time_estimated)}</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<style>
    .table-container {
        position: relative;
    }

    .table-wrapper {
        scrollbar-width: thin;
        scrollbar-color: #4a5568 #2d3748;
    }

    .table-wrapper::-webkit-scrollbar {
        width: 8px;
    }

    .table-wrapper::-webkit-scrollbar-thumb {
        background-color: #4a5568;
        border-radius: 4px;
    }

    .table-wrapper::-webkit-scrollbar-track {
        background: #2d3748;
    }

    thead {
        position: sticky;
        top: 0;
        background: #1f2937;
        z-index: 10;
    }

    .table-container {
        position: relative;
        overflow: visible;
    }

    .tooltip {
        position: relative;
        cursor: pointer;
    }

    .tooltiptext {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: #fff;
        padding: 6px 8px;
        border-radius: 6px;
        z-index: 50;
        visibility: hidden;
        max-width: 250px;
        max-height: 30vh;
        overflow-y: auto;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
    }
</style>