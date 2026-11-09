<script lang="ts">
	import CartItem from '$lib/components/CartItem/CartItem.svelte';

	let { data } = $props();

	const cartItems = $derived(data.cartItems);
</script>

{#each cartItems as item (item.name)}
	<div>
		<div class="mx-10">
			<CartItem
				id={item.id}
				name={item.name}
				price={item.price}
				imageUrl={item.image}
				count={item.count}
			/>
		</div>
	</div>
{/each}
