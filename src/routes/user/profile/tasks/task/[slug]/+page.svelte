<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore.js';
	import { page } from '$app/state';
	import Monaco from '$lib/components/Monaco.svelte';
	import { goto } from '$app/navigation';

	let task = null;
	let error = null;
	let auth = $authStore;

	onMount(async () => {
		if (!auth.isLoggedIn) {
			goto('/');
		}

		const taskId = page.params.slug;
		console.log("Fetching task ID:", taskId);

		try {
			const res = await fetch(`http://localhost:8888/api/user/task/${taskId}`);
			if (!res.ok) throw new Error('Failed to fetch task data');

			const data = await res.json();
			console.log("Fetched Task:", data);
			task = data;
		} catch (e) {
			error = e.message;
		}
	});

	const formatTime = (sec) => {
		const hours = Math.floor(sec / 3600);
		const minutes = Math.floor((sec % 3600) / 60);
		const seconds = sec % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};
</script>

<div class="bg-gray-900 text-white p-6 rounded h-[90vh] flex flex-col gap-6">
	{#if error}
		<p class="text-red-500">Error: {error}</p>
	{:else if task === null}
		<p>Lädt...</p>
	{:else}

		<div class="overflow-auto max-h-[40vh] rounded-lg shadow-lg">
			<table class="w-full text-left border-collapse border border-gray-700">
				<tbody>
				<tr class="border-b border-gray-700">
					<th class="p-3 bg-gray-800 text-gray-300 w-1/5">Aufgabe</th>
					<td class="p-3 h-[4rem] max-h-[4rem] overflow-y-auto">{task.description}</td>
				</tr>
				<tr class="border-b border-gray-700">
					<th class="p-3 bg-gray-800 text-gray-300">Sprache</th>
					<td class="p-3 h-[4rem]">{task.language}</td>
				</tr>
				<tr class="border-b border-gray-700">
					<th class="p-3 bg-gray-800 text-gray-300">Bewertung</th>
					<td class="p-3 h-[4rem] max-h-[4rem] overflow-y-auto">{task.rating}</td>
				</tr>
				<tr class="border-b border-gray-700">
					<th class="p-3 bg-gray-800 text-gray-300">Note</th>
					<td class="p-3 h-[4rem]">{task.mark ?? 'N/A'}</td>
				</tr>
				<tr class="border-b border-gray-700">
					<th class="p-3 bg-gray-800 text-gray-300">Gebrauchte Zeit</th>
					<td class="p-3 h-[4rem]">{formatTime(task.time_spent)}</td>
				</tr>
				<tr class="border-b border-gray-700">
					<th class="p-3 bg-gray-800 text-gray-300">Geschätzte Zeit</th>
					<td class="p-3 h-[4rem]">{formatTime(task.time_estimated)}</td>
				</tr>
				<tr>
					<th class="p-3 bg-gray-800 text-gray-300">KI verwendet</th>
					<td class="p-3 h-[4rem]">{task.ai_usage ? 'Ja' : 'Nein'}</td>
				</tr>
				</tbody>
			</table>
		</div>

		<div class="flex gap-4 h-[50vh]">
			<div class="w-1/2 flex flex-col">
				<h3 class="text-lg font-semibold mb-2">Eingereichter Code</h3>
				<div class="flex-1 bg-gray-800 p-2 rounded">
					<Monaco
						code={task.code.replace(/\\n/g, '\n')}
						language={task.language}
						readOnly={true}
						options={{
							minimap: { enabled: false },
							wordWrap: "on",
							lineNumbers: "on",
							scrollBeyondLastLine: false
						}}
					/>
				</div>
			</div>

			{#if (task.ai_usage && task.interactions !== null)}
				<div class="w-1/2 flex flex-col">
					<h3 class="text-lg font-semibold mb-2">KI-Chatverlauf</h3>
					<div class="flex-1 bg-gray-800 p-4 rounded overflow-y-auto flex flex-col gap-2">
						{#each task.interactions as msg}
							<div class="flex" class:justify-end={msg.role === 'user'}>
								<div class={
										msg.role === 'assistant'
											? 'bg-blue-600 text-white p-2 rounded-lg max-w-[80%]'
											: 'bg-green-600 text-white p-2 rounded-lg max-w-[80%]'
									}
								>
									{msg.content}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<div class="mb-8 flex gap-4">
		<button
			class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
			on:click={() => goto('/user/profile/tasks')}
		>
			Zurück zur Übersicht
		</button>
	</div>
</div>