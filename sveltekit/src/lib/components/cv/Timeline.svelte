<script lang="ts">
	import { experiences } from '$lib/data/experience';
	import TimelineItem from './TimelineItem.svelte';
	import JobDetails from './JobDetails.svelte';
</script>

<div class="timeline-wrapper">
	<div class="timeline-container">
		<div class="timeline-list">
			{#each experiences as experience (experience.id)}
				<TimelineItem {experience} />
			{/each}
		</div>

		<div class="details-container">
			<JobDetails />
		</div>
	</div>
</div>

<style>
	.timeline-wrapper {
		padding: var(--space-lg) 0;
	}

	.timeline-container {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: var(--space-lg);
		align-items: start;
	}

	.timeline-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.details-container {
		min-height: 200px;
	}

	@media (max-width: 1024px) {
		.timeline-container {
			grid-template-columns: 1fr;
		}

		.details-container {
			position: relative;
			min-height: 0;
		}
	}
</style>
