<script>
	import { onMount } from 'svelte';
	import loader from '@monaco-editor/loader';

	export let onEditorFocused = () => {};
	export let code = '';
	export let language = 'javascript';
	export let theme = 'vs-dark';
	export let readOnly = false;
	export let options = {};

	let editorContainer;
	let editor;

	onMount(() => {
		loader.init().then((monaco) => {
			editor = monaco.editor.create(editorContainer, {
				value: code,
				language,
				theme,
				readOnly,
				automaticLayout: true,
				...options
			});

			editor.onDidFocusEditorWidget(() => {
				onEditorFocused();
			});

			editor.onDidChangeModelContent(() => {
				const newCode = editor.getValue();

				editorContainer.dispatchEvent(new CustomEvent("update", {
					detail: { code: newCode },
					bubbles: true
				}));
			});
		});
	});
</script>

<div bind:this={editorContainer} class="w-full h-full"></div>