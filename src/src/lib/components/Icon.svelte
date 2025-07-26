<script lang="ts">
	import '@fontsource-variable/material-symbols-rounded';

	const { name, size = '1.5em', color = 'currentColor', fill = false } = $props();
</script>

<span
	class="material-symbols-rounded"
	style="font-size: {size}; color: {color};font-variation-settings: 'FILL' {fill ? 1 : 0};"
	>{name}</span>

<style>
	.material-symbols-rounded {
		font-family: 'Material Symbols Rounded Variable';
		font-weight: normal;
		font-style: normal;
		font-size: 24px; /* Preferred icon size */
		display: inline-block;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;
	}
</style>
