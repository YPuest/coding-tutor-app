<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	import { authStore } from '$lib/stores/authStore.js';
	import { API_BASE } from "$lib/config";

	import DonutChart from '$lib/components/DonutChart.svelte';

	let auth = $authStore;
	let stats = writable({
		avg_mark: null,
		ai_usage_rate: null,
		total_tasks: null,
		completed_tasks: null,
	});
	let languageData = writable(null);

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto('/');
		} else {
			try {
				const res = await fetch(`${API_BASE}/api/user/stats/general?user_id=${auth.userId}`);
				if (!res.ok) throw new Error('API request failed');
				const data = await res.json();
				console.log('Fetched Stats:', data);

				stats.set({
					avg_mark: typeof data.avg_mark === 'number' ? data.avg_mark : null,
					ai_usage_rate: typeof data.ai_usage_rate === 'number' ? data.ai_usage_rate : null,
					total_tasks: typeof data.total_tasks === 'number' ? data.total_tasks : null,
					completed_tasks: typeof data.completed_tasks === 'number' ? data.completed_tasks : null,
				});

				if (data.language_usage) {
					try {
						languageData.set(JSON.parse(data.language_usage));
					} catch (err) {
						console.error('Error parsing language usage:', err);
					}
				}
			} catch (err) {
				console.error('Error fetching stats:', err);
			}
		}
	});

	$: chartData = $languageData
		? {
			labels: Object.keys($languageData),
			datasets: [
				{
					data: Object.values($languageData),
					backgroundColor: [
						"#5E35B1",
						"#C62828",
						"#FFA726",
						"#42A5F5",
						"#FFD54F",
						"#7E57C2",
						"#FF7043",
						"#81C784",
						"#B39DDB",
						"#E53935",
						"#9575CD",
						"#4CAF50",
						"#64B5F6",
						"#FFF176",
					]
				}
			]
		}
		: null;

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: 'right',
				labels: {
					color: '#FFFFFF',
					font: {
						size: 16,
					},
				}
			}
		}
	};
</script>

<div class="bg-gray-900 text-white p-6 flex flex-col items-center">
	<h1 class="text-3xl font-bold mb-6">Hallo <span class="text-blue-400">{auth.username}</span></h1>

	<div class="mb-8 flex gap-4">
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
		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex justify-center items-center min-w-[120px]"
			on:click={() => goto('/user/profile/tasks')}
		>
			Aufgaben
		</button>
	</div>

	<div class="grid gap-4 bg-gray-800 p-4 rounded shadow-lg min-h-[95%] w-[60%]">
		{#if stats}
			<div class="flex gap-6 items-center w-full">
				<div class="bg-gray-700 rounded shadow-lg h-full w-full p-4">
					<p class="text-2xl text-center font-bold">Sprachen</p>
					{#if chartData}
						<DonutChart {chartData} {chartOptions}/>
					{:else}
						<p>Lade Diagramm...</p>
					{/if}
				</div>

				<div class="p-4 bg-gray-700 rounded shadow-lg text-center h-full w-full flex flex-col items-center justify-center">
					<p class="text-lg">Durchschnittsnote</p>
					<p class="text-2xl font-bold">
						{$stats.avg_mark !== null ? $stats.avg_mark.toFixed(2) : 'N/A'}
					</p>

					<p class="text-lg mt-4">KI-Einsatz</p>
					<p class="text-2xl font-bold">
						{$stats.ai_usage_rate !== null ? $stats.ai_usage_rate.toFixed(0) + '%' : 'N/A%'}
					</p>

					<p class="text-lg mt-4">Abgeschlossene Aufgaben</p>
					<p class="text-2xl font-bold">
						{#if $stats.total_tasks !== null && $stats.completed_tasks !== null}
							{$stats.completed_tasks} / {$stats.total_tasks}
						{:else}
							N/A
						{/if}
					</p>
				</div>
			</div>
		{:else}
			<p>Lade Statistiken...</p>
		{/if}
	</div>
</div>