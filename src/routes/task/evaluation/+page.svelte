<script>
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { authStore } from '$lib/stores/authStore.js';
	import { taskStore } from '$lib/stores/taskStore';
	import { chatStore } from '$lib/stores/chatStore';

	import Monaco from '$lib/components/Monaco.svelte';
	import InfoIcon from '$lib/components/InfoIcon.svelte';

	let auth;
	let isClient = false;
	let taskData = $taskStore;
	let messages = [];
	$: hasChat = taskData.useAI && messages.length > 0;

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

<div class="w-screen h-[calc(100vh-56px)] overflow-y-auto bg-gray-900 text-white flex flex-col">
	<div class="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
		<div class="flex items-center gap-2 mb-2">
			<h1 class="text-3xl font-bold">Bewertung</h1>
			<InfoIcon tooltip="Diese Bewertung wurde vollständig durch ChatGPT erstellt. Sie basiert auf der übermittelten Lösung und Aufgabenbeschreibung, kann aber Fehler oder ungenaue Einschätzungen enthalten." />
		</div>
		<div class={`grid ${hasChat ? 'grid-cols-3' : 'grid-cols-2'} gap-4 bg-gray-800 rounded shadow-lg w-full p-4 max-h-[calc(100vh-150px)] overflow-y-auto`}>

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
			class="max-h-full overflow-auto"
		/>

		<div class="flex flex-col gap-2 h-full max-h-full overflow-auto">
			<div class="bg-gray-700 text-white font-bold text-2xl p-4 rounded text-center">
				{taskData.mark}
			</div>

			<div class="overflow-auto bg-gray-700 text-white p-4 rounded flex-1 max-h-full">
				<p class="mt-4">{taskData.rating}</p>
			</div>

			<div class="bg-gray-700 text-white p-4 rounded flex-1 overflow-auto max-h-full">
				<Monaco
					bind:code={taskData.solution}
					bind:language={taskData.language}
					theme="vs-dark"
					readOnly={true}
					options={{
						minimap: { enabled: false },
						wordWrap: "on",
						lineNumbers: "on",
						scrollBeyondLastLine: false
					}}
					class="max-h-full overflow-auto"
				/>
			</div>

			<span class="text-gray-500 text-xs text-center mt-2">
				ChatGPT kann Fehler machen. Überprüfe wichtige Informationen kritisch.
			</span>
		</div>

		{#if hasChat}
			<div class="flex-1 overflow-y-auto bg-gray-700 p-4 flex flex-col gap-2 h-full rounded max-h-full">
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
</div>
