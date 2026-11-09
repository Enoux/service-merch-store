<script lang="ts">
	let {
		id,
		name,
		price,
		imageUrl,
		count
	}: {
		id: number;
		name: string | null;
		price: number | null;
		imageUrl: string | null;
		count: number | null;
	} = $props();

	// Extract variant from product name (if applicable)
	let { variant, variantStart } = $derived.by(() => {
		let v = null,
			vStart = name?.length;
		if (name && name.includes('(') && name.includes(')')) {
			v = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
		}
		return { variant: v, variantStart: vStart };
	});

	// Compute total price for item
	let total = $derived(price && count ? price * count : 0);

	let isSelected = $state(false);
</script>

<div
	class="flex w-full flex-row flex-wrap items-center justify-center gap-x-10 py-2 {isSelected
		? 'bg-gray-300'
		: 'bg-white'}"
>
	<input
		type="checkbox"
		class="flex h-5 w-5 border-2 border-solid border-gray-500 bg-transparent"
		bind:checked={isSelected}
	/>

	<img src={imageUrl} alt="placeholder" class="flex h-20 w-20 object-cover object-center" />

	<div class="flex w-3/10 flex-wrap">
		<span class="flex w-full items-center text-lg font-medium"
			>{name?.substring(0, variantStart)}</span
		>
		{#if variant != ''}
			<span class="flex w-full items-center text-sm font-light">{variant}</span>
		{/if}
	</div>

	<div class="flex">
		<form method="POST" action="?/editCartEntry" class="flex flex-row items-center gap-4">
			<input type="hidden" bind:value={id} name="id" />
			<input type="hidden" bind:value={count} name="count" />

			<button
				class="flex h-8 w-8 items-center justify-center rounded-full border-1 border-solid border-black bg-gray-200 font-bold"
				onclick={() => (count! -= 1)}>-</button
			>
			<span class="flex text-lg">{count}</span>
			<button
				class="flex h-8 w-8 items-center justify-center rounded-full border-1 border-solid border-black bg-gray-200 font-bold"
				onclick={() => (count! += 1)}>+</button
			>
		</form>
	</div>

	<div class="flex w-1/5 flex-col">
		<span class="flex items-center justify-end text-lg font-medium">Php {total.toFixed(2)}</span>
        <span class="flex items-center justify-end text-sm font-light">Php {(price ? price : 0).toFixed(2)}</span>
	</div>
</div>
