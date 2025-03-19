import { writable } from 'svelte/store';

import { taskStore } from './taskStore';
import { chatStore } from './chatStore';

function createAuthStore() {
	const isBrowser = typeof window !== 'undefined';

	let initialValue = {
		isLoggedIn: false,
		userId: null,
		username: null
	};

	if (isBrowser) {
		const storedValue = localStorage.getItem('authStore');
		if (storedValue) {
			try {
				initialValue = JSON.parse(storedValue);
			} catch (e) {
				initialValue = { isLoggedIn: false, userId: null, username: null };
			}
		}
	}

	const { subscribe, set } = writable(initialValue);

	if (isBrowser) {
		subscribe((value) => {
			localStorage.setItem('authStore', JSON.stringify(value));
		});
	}

	return {
		subscribe,
		login: (userId, username) => {
			set({ isLoggedIn: true, userId, username });
		},
		logout: () => {
			set({ isLoggedIn: false, userId: null, username: null });

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

			chatStore.set({});

			localStorage.removeItem('taskStore');
			localStorage.removeItem('chatStore');
		}
	};
}

export const authStore = createAuthStore();