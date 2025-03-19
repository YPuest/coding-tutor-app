import { writable } from 'svelte/store';

function createTaskStore() {
	const isBrowser = typeof window !== 'undefined';

	const storedValue = isBrowser
		? localStorage.getItem('taskStore')
		: null;

	let initialValue;
	if (storedValue) {
		try {
			initialValue = JSON.parse(storedValue);
		} catch {
			initialValue = {
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
			};
		}
	} else {
		initialValue = {
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
		};
	}

	const store = writable(initialValue);

	if (isBrowser) {
		store.subscribe((value) => {
			localStorage.setItem('taskStore', JSON.stringify(value));
		});
	}

	return store;
}

export const taskStore = createTaskStore();