<script lang="ts">
	let { color, text }: { color: string; text: string } = $props();
</script>

<span class="flex items-center gap-2 rounded-sm bg-gray-200/60 px-3 py-1 text-sm font-medium">
	<span class={['inline-block aspect-square w-3 rounded-full', color]}></span>{text}
</span>
