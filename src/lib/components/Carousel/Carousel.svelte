<script lang="ts">
    import type { Product } from "$lib/types.js";
    import Card from "$lib/components/Card/Card.svelte";
    import LeftArrow from '$lib/assets/left-arrow.svg';
    import RightArrow from '$lib/assets/right-arrow.svg';

    let { products, pageNum = $bindable() }: { products: Product[], pageNum: number } = $props();

    let cardsPerPage = 5;
	let maxPages = $derived(Math.max(0, products.length - cardsPerPage));

	function prevpage() {
		pageNum = Math.max(0, pageNum - 1);
	}

	function nextpage() {
		pageNum = Math.min(maxPages, pageNum + 1);
	}
</script>

<div class="w-full max-w-6xl mx-auto px-4 py-3 bg-white">
	<div class="relative flex items-center">
		<!-- Left Arrow -->
		<button
			type="button"
			onclick={prevpage}
			disabled={pageNum === 0}
			class="absolute -left-5 z-10 p-2 rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-400 shadow-sm"
		>
			<img src={LeftArrow} class="w-6 h-6 align-middle" alt="Button" />
		</button>

		<!-- Carousel Window -->
		<div class="w-full overflow-hidden min-h-100">
			<div
				class="flex transition-transform duration-300 ease-out -mx-2"
				style="transform: translateX(-{(pageNum * 100) / cardsPerPage}%);"
			>
				{#each products as product (product.id)}
                <div class="w-1/5 shrink-0 px-2">
                    <Card id={product.id} image={product.image} price={product.price} name={product.name} />
                </div>
				{/each}
			</div>
		</div>

		<!-- Right Arrow -->
		<button
			type="button"
			onclick={nextpage}
			disabled={pageNum >= maxPages}
			class="absolute -right-5 z-10 p-2 rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-400 shadow-sm"
		>
            <img src={RightArrow} class="w-6 h-6 align-middle" alt="Button" />
		</button>
	</div>
</div>