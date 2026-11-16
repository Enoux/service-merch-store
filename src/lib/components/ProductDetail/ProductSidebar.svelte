<script lang="ts">
	import { enhance, applyAction } from '$app/forms';

	let {
		id,
		name,
		price,
		quantity,
		stock,
		onIncrement,
		onDecrement,
		displayModal = $bindable(),
	}: {
		id: number;
		name: string;
		price: number;
		quantity: number;
		stock: number;
		onIncrement: () => void;
		onDecrement: () => void;
		displayModal: boolean;
	} = $props();
</script>

<aside class="sidebar flex flex-wrap flex-column gap-4 min-w-64">
	<h1 class="m-0 text-3xl font-semibold">{name}</h1>

	<p class="w-full text-base">
		<span class="font-bold">Stock: </span>
		{stock}
	</p>
	<p class="m-0 text-2xl">₱{price.toFixed(2)}</p>

	<div class="w-full mt-7 flex items-center justify-between gap-4 text-slate-700">
		<span>Quantity</span>
		<div class="inline-flex items-center border-1 border-solid border-slate-500 rounded-md overflow-hidden">
			<button class="border-0 bg-slate-200 px-3 py-1 cursor-pointer"
					type="button" onclick={onDecrement} aria-label="Decrease quantity">−</button>
			{#if stock > 0}
				<span class="text-center px-2 py-1 min-w-10">{quantity}</span>
			{:else}
				<span class="text-center px-2 py-1 min-w-10">0</span>
			{/if}
			<button class="border-0 bg-slate-200 px-3 py-1 cursor-pointer"
					type="button" onclick={onIncrement} aria-label="Increase quantity">+</button>
		</div>
	</div>

	<form method="POST" action="/cart?/addCartEntry" class="w-full" use:enhance={() => {
		return async ({ result }) => {
			displayModal = true
			await applyAction(result);
		}
	}}>
		<input type="hidden" bind:value={id} name="variant_id" />
		<input type="hidden" bind:value={quantity} name="count" />
		<button
			type="submit"
			class="w-full mt-8 border-1 border-solid border-slate-700 px-8 py-3 bg-white cursor-pointer text-gray-700 rounded-full"
			disabled={stock <= 0}
		>
			Add to cart
		</button>
	</form>
</aside>
