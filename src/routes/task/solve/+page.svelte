<script>
	import { onDestroy, onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';

	import { taskStore } from '$lib/stores/taskStore';
	import { authStore } from '$lib/stores/authStore.js';
	import { chatStore } from '$lib/stores/chatStore';
	import { API_BASE } from "$lib/config";

	import InfoIcon from '$lib/components/InfoIcon.svelte';

	import * as monaco from 'monaco-editor';

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

	let chatContainer;

	let time = 0;
	let timeEstimationSeconds = 0;
	let timer = null;
	let isRunning = false;
	let showOverdueWarning = false;

	$: taskData = $taskStore;

	let timeRemaining = 0;
	$: {
		timeEstimationSeconds = taskData.timeEstimation * 60;
		if (time < timeEstimationSeconds) {
			timeRemaining = timeEstimationSeconds - time;
		}
	}

	$: {
		if (isRunning && timeEstimationSeconds > 0 && time >= timeEstimationSeconds && !showOverdueWarning) {
			showOverdueWarning = true;
			setTimeout(() => {
				showOverdueWarning = false;
			}, 4000);
		}
	}

	$: useAI = taskData.useAI ?? true;

	export let messages = [];
	let userInput = "";

	const formatTime = (sec) => {
		const hours = Math.floor(sec / 3600);
		const minutes = Math.floor((sec % 3600) / 60);
		const seconds = sec % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	onMount(() => {
		$taskStore && (taskData = $taskStore);
		let visited = false;
		const unsub = taskStore.subscribe(state => {
			visited = state.visitedGenerate;
		});
		unsub();

		if (!visited) {
			goto('/task/generate');
		}
	});

	$: normalizedLanguage = taskData.language.toLowerCase();
	$: timeEstimation = formatTime(taskData.timeEstimation * 60);

	let showTimerPopup = false;

	function startTimer() {
		if (!isRunning) {
			isRunning = true;
			showTimerPopup = true;
			timer = setInterval(() => {
				time++;
			}, 1000);

			setTimeout(() => {
				showTimerPopup = false;
			}, 3000);
		}
	}

	function stopTimer() {
		isRunning = false;
		clearInterval(timer);
	}

	function resetTimer() {
		time = 0;
	}

	$: {
		if (chatContainer && messages.length) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	async function sendMessage() {
		if (!userInput.trim()) return;
		if (!isRunning) {
			startTimer();
		}
		messages = [...messages, { role: 'user', content: userInput }];
		const userMsg = userInput;

		const newMessage = { text: userInput, role: 'user' };
		chatStore.addMessage(taskData.taskId, newMessage);

		userInput = "";

		await tick();
		scrollToBottom();

		try {
			const res = await fetch(`${API_BASE}/api/chat/task-question`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					user_id: auth.userId,
					task_id: taskData.taskId,
					message: userMsg,
					level: taskData.level,
					language: taskData.language,
					task: taskData.task,
					time_remaining: timeRemaining,
					time_spent: time,
				})
			});
			if (!res.ok) {
				throw new Error('ChatGPT API Error');
			}
			const data = await res.json();

			messages = [...messages, { role: 'assistant', content: data.message }];
			const response = { text: data.message, role: "assistant" };
			chatStore.addMessage(taskData.taskId, response);

			await tick();
			scrollToBottom();

		} catch (error) {
			console.error(error);
		}
	}

	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	$: formattedTime = formatTime(time);

	function handleEditorFocus() {
		if (!isRunning) {
			startTimer();
		}
	}

	onDestroy(() => {
		taskStore.update(state => ({
			...state,
			visitedGenerate: false
		}));
	});

	let editor;
	let code = `print("Hello, world!")`;
	let editorContainer;

	onMount(() => {
		editor = monaco.editor.create(editorContainer, {
			value: code,
			language: normalizedLanguage,
			theme: 'vs-dark',
			automaticLayout: true
		});

		editor.onDidChangeModelContent(() => {
			code = editor.getValue();
		});
	});

	let evaluationCheck = false;

	async function evaluate() {
		stopTimer();
		evaluationCheck = true;
		const latestCode = editor.getValue();

		try {
			const res = await fetch(`${API_BASE}/api/task/evaluate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: auth.userId,
					task_id: taskData.taskId,
					code: latestCode.trim(),
					level: taskData.level,
					language: taskData.language,
					task: taskData.task,
					use_ai: taskData.useAI,
					time_estimation: (taskData.timeEstimation * 60),
					time_spent: time,
				})
			});

			if (!res.ok) {
				throw new Error('ChatGPT API Error');
			}

			const data = await res.json();

			taskStore.update(state => ({
				...state,
				code: code.trim(),
				rating: data.rating,
				mark: data.mark,
				timeComparison: data.timeComparison,
				solution: data.solution,
			}));

			goto('/task/evaluation');

		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="w-screen h-[calc(100vh-56px)] overflow-hidden bg-gray-900 text-white flex flex-col">
	<div class="flex-1 flex flex-col p-6 gap-6 overflow-hidden">

		{#if (showTimerPopup)}
			<div class="fixed left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-2 rounded shadow-lg animate-pulse">
				Timer gestartet! Viel Erfolg.
			</div>
		{/if}

		{#if showOverdueWarning}
			<div class="fixed left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-2 rounded shadow-lg animate-pulse z-50">
				⚠️ Zeit überschritten!
			</div>
		{/if}

		<div class="flex-none flex items-center justify-between">
			<div>
				<p class="font-semibold">Stoppuhr:</p>
				<p>{formattedTime}</p>
				<div class="flex flex-wrap items-center gap-2 mt-2">
					<button class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded" on:click={startTimer}>Start</button>
					<button class="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded" on:click={stopTimer}>Stop</button>
					<button class="bg-gray-700 hover:bg-gray-800 text-white py-1 px-3 rounded" on:click={resetTimer}>Reset</button>
					<button class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center gap-2" on:click={evaluate}>
						{#if evaluationCheck}
							<svg class="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						{:else}
							<span class="relative flex size-3">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
								<span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
							</span>
						{/if}
						<span>Abgeben</span>
					</button>
				</div>
			</div>

			{#if taskData.timeEstimation}
				<div class="text-right">
					<p class="text-sm text-gray-400">Geschätzte Zeit:</p>
					<p class="font-bold">{timeEstimation}</p>
				</div>
			{/if}
		</div>

		<div class="flex-none p-4 bg-gray-800 rounded overflow-auto">
			<h2 class="text-xl font-semibold mb-2">Aufgabe:</h2>
			<p>{taskData.task}</p>
		</div>

		<div class="flex flex-1 gap-4 overflow-hidden">
			<div class="w-2/3 h-full overflow-hidden p-4 bg-gray-800 rounded">
				<div bind:this={editorContainer} on:click={handleEditorFocus} class="w-full h-full bg-gray-800"></div>
			</div>

			{#if useAI}
				<div class="w-1/3 h-full overflow-hidden p-4 bg-gray-800 rounded flex flex-col">
					<div class="flex items-center gap-2 mb-2">
						<h3 class="text-lg font-semibold">Chat</h3>
						<InfoIcon tooltip="Die KI berücksichtigt nur die letzten 10 Nachrichten im Chat. Der Code im Editor wird nicht automatisch übermittelt." />
					</div>
					<div class="flex-1 overflow-y-auto border border-gray-700 p-2 mb-2 flex flex-col gap-2" bind:this={chatContainer}>
						{#each messages as msg}
							<div class="flex" class:justify-end={msg.role === 'user'}>
								<div class={
									msg.role === 'assistant'
										? 'bg-blue-600 text-white p-2 rounded-lg max-w-[100%]'
										: 'bg-green-600 text-white p-2 rounded-lg max-w-[100%]'
									}
								>
									{msg.content}
								</div>
							</div>
						{/each}
					</div>
					<div class="flex">
						<input
							type="text"
							bind:value={userInput}
							on:click={handleEditorFocus}
							class="flex-1 bg-gray-700 text-white p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Deine Frage an ChatGPT..."
						/>
						<button
							class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-r"
							on:click={sendMessage}>
							Senden
						</button>
					</div>
					<span class="text-gray-600 text-xs mt-2">
						ChatGPT kann Fehler machen. Überprüfe wichtige Informationen.
					</span>
				</div>
			{/if}
		</div>
	</div>
</div>