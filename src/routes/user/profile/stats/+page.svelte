<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	import { authStore } from '$lib/stores/authStore.js';

	import DonutChart from '$lib/components/DonutChart.svelte';
	import BarChart from '$lib/components/BarChart.svelte';

	let stats = writable(null);
	let selectedLanguage = "";
	let languageOptions = writable([]);
	let auth = $authStore;

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto('/');
		} else {
			try {
				const res = await fetch(`http://localhost:8888/api/user/stats/full?user_id=${auth.userId}`);
				if (!res.ok) throw new Error('API request failed');
				const data = await res.json();
				console.log('Fetched Stats:', data);
				stats.set(data);

				languageOptions.set(Object.keys(data.language_distribution ?? {}));
			} catch (err) {
				console.error('Error fetching stats:', err);
			}
		}
	});

	$: chartData = $stats
		? {
			labels: Object.keys($stats.language_distribution ?? {}),
			datasets: [
				{
					data: Object.values($stats.language_distribution ?? {}),
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
		responsive: false,
		plugins: {
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					color: '#FFFFFF',
					font: {
						size: 16,
					},
				}
			}
		}
	};

	$: taskStatusChartData = $stats
		? {
			labels: Object.keys($stats.task_status_chart).filter(lang => lang !== "datasets" && lang !== "labels"),
			datasets: [
				{
					label: "Abgeschlossen",
					data: Object.keys($stats.task_status_chart)
						.filter(lang => lang !== "datasets" && lang !== "labels")
						.map(lang => $stats.task_status_chart[lang]?.completed ?? 0),
					backgroundColor: "green",
					stack: "Stack 0"
				},
				{
					label: "Nicht abgeschlossen",
					data: Object.keys($stats.task_status_chart)
						.filter(lang => lang !== "datasets" && lang !== "labels")
						.map(lang => $stats.task_status_chart[lang]?.not_completed ?? 0),
					backgroundColor: "red",
					stack: "Stack 0"
				}
			]
		}
		: null;

	$: aiUsageChartData = $stats
		? {
			labels: Object.keys($stats.ai_usage_chart).filter(lang => lang !== "datasets" && lang !== "labels"),
			datasets: [
				{
					label: "Mit KI",
					data: Object.keys($stats.ai_usage_chart)
						.filter(lang => lang !== "datasets" && lang !== "labels")
						.map(lang => $stats.ai_usage_chart[lang]?.with_ai ?? 0),
					backgroundColor: "red",
					stack: "Stack 1"
				},
				{
					label: "Ohne KI",
					data: Object.keys($stats.ai_usage_chart)
						.filter(lang => lang !== "datasets" && lang !== "labels")
						.map(lang => $stats.ai_usage_chart[lang]?.without_ai ?? 0),
					backgroundColor: "green",
					stack: "Stack 1"
				}
			]
		}
		: null;

	const barChartOptions = {
		responsive: false,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: 'top',
				labels: {
					color: 'white',
					font: {
						size: 14
					}
				}
			},
			tooltip: {
				bodyColor: 'white',
				titleColor: 'white'
			}
		},
		scales: {
			x: {
				stacked: true,
				ticks: {
					color: 'white'
				}
			},
			y: {
				stacked: true,
				ticks: {
					color: 'white'
				}
			}
		}
	};
</script>

<div class="bg-gray-900 text-white p-6 flex flex-col items-center min-h-screen w-full max-w-[95vw] xl:max-w-[1400px] mx-auto">
	<h1 class="text-3xl font-bold mb-6">Statistiken</h1>

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

	<div class="grid grid-cols-[1fr_2fr_1fr] gap-8 w-full max-w-7xl">
		<div class="col-span-1 self-start">
			<div class="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center">
				<p class="text-lg font-bold">Sprachen</p>
				{#if chartData}
					<DonutChart {chartData} {chartOptions} />
				{:else}
					<p>Lade Diagramm...</p>
				{/if}

				<div class="flex flex-col gap-2 mt-8">
					<p class="text-lg font-bold">Statistik pro Sprache</p>
					<div class="flex flex-row">
						<div class="relative w-full">
							<select bind:value={selectedLanguage} class="p-2 bg-gray-700 text-white rounded-l-lg w-full">
								<option value="">Sprache wählen</option>
								{#each $languageOptions as lang}
									<option value={lang}>{lang}</option>
								{/each}
							</select>
						</div>
						<button
							class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
							on:click={() => {
								if (selectedLanguage !== "") {
									goto(`/user/profile/stats/stat/${selectedLanguage}`);
								}
							}}
						>
							Check
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="col-span-1 flex flex-col gap-4">
			<div class="bg-gray-800 p-4 rounded-lg shadow-lg h-[35vh] overflow-hidden box-border">
				<p class="text-lg font-bold text-center">Aufgabenstatus</p>
				{#if taskStatusChartData}
					<div class="h-full">
						<BarChart chartData={taskStatusChartData} chartOptions={barChartOptions} />
					</div>
				{:else}
					<p>Lade Diagramm...</p>
				{/if}
			</div>

			<div class="bg-gray-800 p-4 rounded-lg shadow-lg h-[35vh] overflow-hidden box-border">
				<p class="text-lg font-bold text-center">KI-Nutzung</p>
				{#if aiUsageChartData}
					<div class="h-full">
						<BarChart chartData={aiUsageChartData} chartOptions={barChartOptions} />
					</div>
				{:else}
					<p>Lade Diagramm...</p>
				{/if}
			</div>
		</div>

		<div class="col-span-1 flex flex-col gap-4">
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">Aufgaben</p>
				<p class="text-2xl font-bold">{$stats?.completed_tasks ?? 0} / {$stats?.total_tasks ?? 0}</p>
			</div>
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">Note</p>
				<p class="text-2xl font-bold">{$stats?.avg_mark?.toFixed(1) ?? 'N/A'}</p>
			</div>
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">KI-Einsatz</p>
				<p class="text-2xl font-bold">{$stats?.ai_usage_rate?.toFixed(1) ?? 'N/A'}%</p>
			</div>
			<div class="bg-gray-800 p-4 rounded-lg text-center">
				<p class="text-lg">Sprachen</p>
				<p class="text-2xl font-bold">{Object.keys($stats?.language_distribution ?? {}).length}</p>
			</div>
		</div>
	</div>
</div>