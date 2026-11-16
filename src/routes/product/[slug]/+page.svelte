<script lang="ts">
	import AlertModal from '$lib/components/Modal/AlertModal.svelte';
	import Checkmark from '$lib/assets/checkmark.svg';
	import Cross from '$lib/assets/cross.svg';
	import VerticalGallery from '$lib/components/ProductDetail/VerticalGallery.svelte';
	import MainDisplay from '$lib/components/ProductDetail/MainDisplay.svelte';
	import ProductSidebar from '$lib/components/ProductDetail/ProductSidebar.svelte';
	import { page } from '$app/state';
	import type { Product } from "$lib/types.js";

	let { data } : { data: { product: Product } } = $props();
	const { product } = $derived(data);
	const images = $derived(product.gallery);
	let selectedImage = $derived(product.image);
	let quantity = $state(1);

	function incrementQuantity() {
		if (quantity < product.stock_amount) {
			quantity += 1;
		}
	}

	function decrementQuantity() {
		quantity = Math.max(1, quantity - 1);
	}

	let displayAlertModal = $state(true);
</script>

<div class="product-layout">
	<VerticalGallery {images} {selectedImage} onSelect={(image) => (selectedImage = image)} />

	<MainDisplay
		image={selectedImage}
		description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Product details and variant notes can go here."
	/>

	<ProductSidebar
		id={product.id}
		name={product.name}
		price={product.price}
		{quantity}
		stock={product.stock_amount}
		onIncrement={incrementQuantity}
		onDecrement={decrementQuantity}
		bind:displayModal={displayAlertModal}
	/>
</div>
{#if displayAlertModal}
	{#if page.form?.success}
		<AlertModal message={`${product.name} successfully added to your cart!`} icon={Checkmark}
					bind:isDisplayed={displayAlertModal} />
	{:else if page.form?.error}
		<AlertModal message={`Error! ${page.form.error}`} icon={Cross}
					bind:isDisplayed={displayAlertModal} />
	{/if}
{/if}

<style>
	.product-layout {
		max-width: 1100px;
		margin: 2rem auto;
		padding: 0 1rem;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) 18rem;
		gap: 1.75rem;
		align-items: start;
	}

	@media (max-width: 1100px) {
		.product-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
