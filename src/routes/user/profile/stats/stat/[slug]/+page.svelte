<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { authStore } from '$lib/stores/authStore.js';
	import { page } from '$app/state';
	import { API_BASE } from "$lib/config";

	import DonutChart from '$lib/components/DonutChart.svelte';
	import BarChart from '$lib/components/BarChart.svelte';

	let stats = writable(null);
	let auth = $authStore;
	let language = page.params.slug;

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto('/');
			return;
		}

		if (!language) {
			console.error("Language param is missing!");
			return;
		}

		try {
			const res = await fetch(`${API_BASE}/api/user/stats/language?user_id=${auth.userId}&language=${language}`);
			if (!res.ok) throw new Error('API request failed');

			const data = await res.json();
			console.log('Fetched Stats:', data);
			stats.set(data);
		} catch (err) {
			console.error("Error fetching stats:", err);
		}
	});

	$: taskLevelChartData = $stats && $stats.task_levels
		? {
			labels: ["super easy", "easy", "medium", "hard", "super hard"],
			datasets: [
				{
					label: "Aufgaben pro Level",
					data: [
						$stats.task_levels["super easy"] ?? 0,
						$stats.task_levels["easy"] ?? 0,
						$stats.task_levels["medium"] ?? 0,
						$stats.task_levels["hard"] ?? 0,
						$stats.task_levels["super hard"] ?? 0
					],
					backgroundColor: "#155DFC"
				}
			]
		}
		: null;

	const barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				labels: { color: 'white' }
			}
		},
		scales: {
			y: {
				ticks: {
					color: 'white',
					precision: 0
				}
			},
			x: {
				ticks: { color: 'white' }
			}
		}
	};

	const donutChartOptions = {
		plugins: {
			legend: {
				labels: { color: 'white' }
			}
		}
	};
</script>

<div class="bg-gray-900 text-white p-6 flex flex-col items-center min-h-screen w-full">
	<h1 class="text-3xl font-bold mb-6">Sprache - {language}</h1>

	<div class="mb-6 flex gap-4">
		<button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" on:click={() => goto('/user/profile')}>
			Profil
		</button>
		<button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" on:click={() => goto('/user/profile/settings')}>
			Einstellungen
		</button>
		<button class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" on:click={() => goto('/user/profile/tasks')}>
			Aufgaben
		</button>
	</div>

	{#if $stats}
		<div class="grid grid-cols-3 gap-8 w-full max-w-7xl">
			<div class="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-center h-[350px]">
				<DonutChart chartData={{
					labels: ["Mit KI", "Ohne KI"],
					datasets: [{
						data: [$stats.ai_with_usage, $stats.ai_without_usage],
						backgroundColor: ["red", "green"]
					}]
				}} chartOptions={donutChartOptions} />
			</div>

			<div class="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-center h-[350px]">
				<DonutChart chartData={{
					labels: ["Abgeschlossen", "Nicht abgeschlossen"],
					datasets: [{
						data: [$stats.completed_tasks, $stats.total_tasks - $stats.completed_tasks],
						backgroundColor: ["green", "red"]
					}]
				}} chartOptions={donutChartOptions} />
			</div>

			<div class="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center justify-center h-[350px]">
				<BarChart chartData={taskLevelChartData} chartOptions={barChartOptions} />
			</div>
		</div>

		<div class="grid grid-cols-4 gap-4 mt-8 w-full max-w-7xl">
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">Aufgaben</p>
				<p class="text-2xl font-bold">{$stats.completed_tasks} / {$stats.total_tasks}</p>
			</div>
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">Abschlussrate</p>
				<p class="text-2xl font-bold">{(($stats.completed_tasks / $stats.total_tasks) * 100).toFixed(0)}%</p>
			</div>
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">Note</p>
				<p class="text-2xl font-bold">{$stats.avg_mark.toFixed(2)}</p>
			</div>
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">KI-Einsatz</p>
				<p class="text-2xl font-bold">{(($stats.ai_with_usage / $stats.completed_tasks) * 100).toFixed(0)}%</p>
			</div>
		</div>
	{:else}
		<p>Lade Statistiken...</p>
	{/if}
	<div class="mt-8 flex w-full max-w-7xl">
		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
			on:click={() => goto('/user/profile/stats')}
		>
			Zurück zur Übersicht
		</button>
	</div>
</div>