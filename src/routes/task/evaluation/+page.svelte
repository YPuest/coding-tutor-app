<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { authStore } from '$lib/stores/authStore.js';
	import { taskStore } from '$lib/stores/taskStore';
	import { chatStore } from '$lib/stores/chatStore';

	import Monaco from '$lib/components/Monaco.svelte';

	let auth;
	let isClient = false;
	let taskData = $taskStore;
	let messages = [];

	onMount(() => {
		isClient = true;
	});

	$: if (isClient) {
		auth = $authStore;
		if (!auth.isLoggedIn) {
			goto('/');
		}
	}

	$: if (taskData.taskId) {
		chatStore.subscribe(state => {
			messages = state[taskData.taskId] || [];
		});
	}

	$: gridColsClass = taskData.useAI && messages.length > 0 ? 'grid-cols-3' : 'grid-cols-2';

	onDestroy(() => {
		const currentTaskId = taskData.taskId;

		taskStore.set({
			task: '',
			timeEstimation: 0,
			language: '',
			level: '',
			taskId: null,
			useAI: false,
			visitedGenerate: false,
			code: '',
			rating: '',
			mark: 6,
			timeComparison: '',
		});

		if (currentTaskId) {
			chatStore.clearMessages(currentTaskId);
		}
	});
</script>

<div class="bg-gray-900 text-white flex flex-col items-center justify-center p-6 w-[95%] mx-auto h-[calc(100vh-56px)]">
	<h1 class="text-3xl font-bold mb-4">Bewertung</h1>

	<div class="grid gap-4 bg-gray-800 p-4 rounded shadow-lg min-h-[95%] w-full {gridColsClass}">
			<Monaco
				bind:code={taskData.code}
				bind:language={taskData.language}
				theme="vs-dark"
				readOnly={true}
				options={{
					minimap: { enabled: false },
					wordWrap: "on",
					lineNumbers: "on",
					scrollBeyondLastLine: false
				}}
			/>

		<div class="rounded h-full flex flex-col items-center">
			<div class="bg-gray-700 text-white font-bold text-2xl p-4 rounded w-full text-center">
				{taskData.mark}
			</div>

			<div class="overflow-auto bg-gray-700 text-white p-4 rounded w-full h-full mt-1">
				<p class="mt-4">
					{taskData.rating}
				</p>
			</div>
		</div>

		{#if taskData.useAI && messages.length > 0}
			<div class="flex-1 overflow-y-auto bg-gray-700 p-4 flex flex-col gap-2 h-full rounded">
				{#each messages as msg}
					<div class="flex" class:justify-end={msg.role === 'user'}>
						<div class={
								msg.role === 'assistant'
									? 'bg-blue-600 text-white p-2 rounded-lg max-w-[66%]'
									: 'bg-green-600 text-white p-2 rounded-lg max-w-[66%]'
							}
						>
							{msg.text}
						</div>
					</div>
				{/each}
			</div>
		{/if}

	</div>
</div>