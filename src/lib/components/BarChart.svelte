<script>
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	export let chartData;
	export let chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				stacked: true
			},
			y: {
				stacked: true
			}
		},
		plugins: {
			legend: {
				labels: {
					color: "#FFFFFF"
				}
			},
			tooltip: {
				enabled: true
			}
		}
	};

	let chartCanvas;
	let chartInstance;

	onMount(() => {
		if (chartCanvas) {
			chartInstance = new Chart(chartCanvas, {
				type: "bar",
				data: chartData,
				options: chartOptions
			});
		}
	});

	$: if (chartInstance && chartData) {
		chartInstance.data = chartData;
		chartInstance.update();
	}

	$: () => {
		return () => {
			if (chartInstance) chartInstance.destroy();
		};
	};
</script>

<canvas bind:this={chartCanvas}></canvas>

<style>
    canvas {
        width: 100%;
        height: 300px;
    }
</style>