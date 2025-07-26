<script lang="ts">
	let {
		label,
		name,
		placeholder,
		value = $bindable(),
		required = false
	}: {
		label?: string;
		name?: string;
		placeholder?: string;
		value?: string;
		required?: boolean;
	} = $props();
</script>

<label class="flex flex-col gap-2">
	<span> {label} </span>
	<input
		class="rounded-lg border border-gray-300 p-2"
		type="text"
		{name}
		{placeholder}
		bind:value
		{required} />
</label>
