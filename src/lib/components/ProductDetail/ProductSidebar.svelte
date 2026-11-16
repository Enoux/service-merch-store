<script lang="ts">
	import { enhance, applyAction } from '$app/forms';

	let {
		id,
		name,
		price,
		quantity,
		stock,
		onIncrement,
		onDecrement
	}: {
		id: number;
		name: string;
		price: number;
		quantity: number;
		stock: number;
		onIncrement: () => void;
		onDecrement: () => void;
	} = $props();
</script>

<aside class="sidebar">
	<h1>{name}</h1>
	<p class="price">₱{price.toFixed(2)}</p>

	<div class="quantity-row">
		<span>Quantity</span>
		<div class="controls">
			<button type="button" onclick={onDecrement} aria-label="Decrease quantity">−</button>
			<span>{quantity}</span>
			<button type="button" onclick={onIncrement} aria-label="Increase quantity">+</button>
		</div>
	</div>

	<form method="POST" action="/cart?/addCartEntry" class="w-full" use:enhance={() => {
		return async ({ result }) => {
			await applyAction(result);
		}
	}}>
		<input type="hidden" bind:value={id} name="variant_id" />
		<input type="hidden" bind:value={quantity} name="count" />
		<button
			type="submit"
			class="w-full mt-8 border-1 border-solid border-slate-700 px-8 py-3 bg-white cursor-pointer text-gray-700 rounded-full"
			disabled={stock <= 0}
			onclick={() => console.log('test add to cart')}
		>
			Add to cart
		</button>
	</form>
</aside>

<style>
	.sidebar {
		min-width: 16rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1 {
		margin: 0;
		font-size: 1.7rem;
		font-weight: 600;
	}

	.price {
		margin: 0;
		font-size: 1.4rem;
	}

	.quantity-row {
		margin-top: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		color: #4b5563;
	}

	.controls {
		display: inline-flex;
		align-items: center;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.controls button {
		border: 0;
		background: #f9fafb;
		padding: 0.2rem 0.6rem;
		cursor: pointer;
		font-size: 1rem;
	}

	.controls span {
		padding: 0.2rem 0.75rem;
		min-width: 2rem;
		text-align: center;
	}

	.add-to-cart {
		margin-top: 2rem;
		border: 1px solid #9ca3af;
		border-radius: 999px;
		padding: 0.65rem 1rem;
		background: white;
		cursor: pointer;
		color: #6b7280;
		font-size: 1rem;
	}
</style>
