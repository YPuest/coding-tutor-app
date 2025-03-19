import { writable } from 'svelte/store';

function createChatStore() {
	const isBrowser = typeof window !== 'undefined';

	const storedValue = isBrowser ? localStorage.getItem('chatStore') : null;

	let initialValue = {};
	if (storedValue) {
		try {
			initialValue = JSON.parse(storedValue);
		} catch {
			initialValue = {};
		}
	}

	const store = writable(initialValue);

	if (isBrowser) {
		store.subscribe((value) => {
			localStorage.setItem('chatStore', JSON.stringify(value));
		});
	}

	return {
		subscribe: store.subscribe,
		addMessage: (taskId, message) => {
			store.update(state => {
				const updatedMessages = state[taskId] ? [...state[taskId], message] : [message];
				return { ...state, [taskId]: updatedMessages };
			});
		},
		clearMessages: (taskId) => {
			store.update(state => {
				const newState = { ...state };
				delete newState[taskId];
				return newState;
			});
		},
		getMessages: (taskId) => {
			return store.update(state => state[taskId] || []);
		}
	};
}

export const chatStore = createChatStore();