<script>
	let container;

	function scrollToTop() {
		console.log("scrollToTop");
		container.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="w-screen h-[calc(100vh-56px)] bg-gray-900 text-white flex items-center justify-center p-6 overflow-hidden">
	<div bind:this={container} class="w-full max-w-6xl h-full bg-gray-800 rounded-lg shadow-lg overflow-y-auto p-4 space-y-6" id="help-container">
		<h1 class="text-3xl font-bold text-center">Hilfe & Anleitung</h1>

		<section>
			<h2 class="text-2xl font-semibold mb-2">📌 Allgemeines</h2>
			<p>Diese Anwendung unterstützt dich dabei, Programmierfähigkeiten zu erlernen oder sie zu verbessern –
				auf Wunsch mit Hilfe einer KI. Ziel ist es, durch praxisnahe Übungen und direktes Feedback den Lernprozess
				zu fördern.</p>
		</section>

		<section>
			<h2 class="text-2xl font-semibold mb-2">🧠 So funktioniert’s</h2>

			<h3 class="text-xl font-semibold mb-1 pl-2">📚 Übung</h3>
			<ul class="list-disc list-inside space-y-1 pl-6 mb-4">
				<li>Wähle eine Sprache und einen Schwierigkeitsgrad</li>
				<li>Starte die Aufgabe über "Jetzt starten"</li>
				<li>Programmiere deine Lösung im Editor</li>
				<li>Nutze den KI-Chat für Hilfe (optional)</li>
				<li>Gib deine Lösung ab und sieh dir die Bewertung an</li>
			</ul>

			<h3 class="text-xl font-semibold mb-1 pl-2">👤 Profil</h3>
			<ul class="list-disc list-inside space-y-1 pl-6 mb-4">
				<li>Behalte deine Fortschritte im Blick:
					<ul class="list-disc list-inside space-y-1 pl-3">
						<li>Detaillierte Übersicht über deine Durchschnittsnote und den KI-Einsatz</li>
						<li>Statistiken nach Programmiersprache aufgeschlüsselt</li>
					</ul>
				</li>
				<li>Verwalte deine abgeschlossenen Aufgaben:
					<ul class="list-disc list-inside space-y-1 pl-3">
						<li>Alle erledigten Aufgaben übersichtlich im Verlauf</li>
						<li>Mit einem Klick mehr Details zu Bewertung, Lösung und Zeitaufwand</li>
					</ul>
				</li>
			</ul>
		</section>

		<section class="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-100 p-4 rounded mb-10">
			<h2 class="text-2xl font-semibold mb-2">⚠️ Hinweise</h2>
			<p class="mb-2">
				Bitte beachte, dass ChatGPT nicht unfehlbar ist – es können Fehler oder unvollständige Antworten vorkommen.<br>
				Folgende Aufgabenbereiche werden vollständig durch KI übernommen:
			</p>
			<ul class="list-disc list-inside space-y-1 pl-6">
				<li>Aufgabengenerierung</li>
				<li>Hilfestellungen im Chat</li>
				<li>Aufgabenbewertung</li>
			</ul>
			<div class="mt-6 bg-yellow-800/40 p-3 rounded border border-yellow-600 italic">
				Bitte beachte, dass der KI-gestützte Tutor lediglich als ergänzendes Hilfsmittel dient.
				Er ersetzt keine vollständige Programmierausbildung und kann insbesondere bei komplexeren
				Fragen oder individuellen Lernfortschritten an seine Grenzen stoßen. Die bereitgestellten
				Inhalte sollten daher stets kritisch überprüft und bei Unsicherheiten durch weitere Recherche
				oder Rücksprache mit Fachpersonen ergänzt werden.
			</div>
		</section>

		<hr class="my-12 h-0.5 border-t-0 bg-white/10">

		<section>
			<h2 class="text-2xl font-semibold mb-6 text-center">📷 Beispielansichten</h2>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Aufgabengenerierung</h3>
				<img src="/images/help/task_generation_start.png" alt="Aufgabengenerierung" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Generierte Aufgabe</h3>
				<img src="/images/help/task_generation_done.png" alt="Generierte Aufgabe" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Lösungsansicht – Start</h3>
				<img src="/images/help/task_solve_start.png" alt="Lösungs-Ansicht I" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Lösungsansicht – Mit Chat</h3>
				<img src="/images/help/task_solve_done.png" alt="Lösungs-Ansicht II" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Bewertungsansicht</h3>
				<img src="/images/help/task_evaluation.png" alt="Bewertungsansicht" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Profil</h3>
				<img src="/images/help/profile.png" alt="Profil" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Statistik – Übersicht</h3>
				<img src="/images/help/stats_overview.png" alt="Statistik - Übersicht" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Statistik – Details zur Sprache</h3>
				<img src="/images/help/stats_detail.png" alt="Statistik - Detail" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Aufgaben – Übersicht</h3>
				<img src="/images/help/task_list.png" alt="Aufgaben - Übersicht" loading="lazy" class="rounded w-full" />
			</div>

			<div class="bg-gray-700 rounded-lg shadow p-4 mb-6">
				<h3 class="text-xl font-semibold mb-2">Aufgaben – Detailansicht</h3>
				<img src="/images/help/task_detail.png" alt="Aufgaben - Detail" loading="lazy" class="rounded w-full" />
			</div>
		</section>

		<button on:click={scrollToTop} class="block mx-auto mt-4 text-sm text-blue-400 hover:underline cursor-pointer">
			⬆️ Nach oben
		</button>
	</div>
</div>