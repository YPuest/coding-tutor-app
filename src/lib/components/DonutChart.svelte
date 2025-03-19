<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let chartData;
	export let chartOptions = {};

	let canvas;

	onMount(() => {
		new Chart(canvas, {
			type: 'doughnut',
			data: chartData,
			options: {
				responsive: true,
				...chartOptions,
			}
		});
	});
</script>

<canvas bind:this={canvas}></canvas>