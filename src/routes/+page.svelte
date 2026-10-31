<script lang="ts">
	import type { PageData } from './$types';
	import HomepageBg from '$lib/assets/homepage-bg.png';
	import Carousel from '$lib/components/Carousel/Carousel.svelte';
	import RightArrow from '$lib/assets/right-arrow-thin.svg';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state({ id: 0, category: 'All' });
	let selectedProducts = $derived(
		selectedCategory.id === 0
			? data.products
			: data.products.filter((product) => product.category === selectedCategory.category)
	);

	let pageNum = $state(0);
</script>

<div class="relative z-0 h-60 w-full overflow-hidden md:h-80">
	<img src={HomepageBg} alt="Homepage Banner" class="h-full w-full object-cover object-[50%_40%]" />
</div>

<div class="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
	<div class="flex items-center justify-between border-b-2 border-gray-300">
		<nav class="flex space-x-8">
			<button
				onclick={() => {selectedCategory = { id: 0, category: 'All' }; pageNum = 0}}
				class="relative px-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors
                {selectedCategory.id === 0
					? 'border-b-3 border-csi-blue font-semibold text-csi-blue'
					: 'text-gray-500 hover:text-gray-700'}"
			>
				All
			</button>
			{#each data.categories as category (category.id)}
				<button
					onclick={() => {selectedCategory = category; pageNum = 0}}
					class="relative px-2 pb-3 text-sm font-medium whitespace-nowrap transition-colors
                    {selectedCategory.id === category.id
						? 'border-b-3 border-csi-blue font-semibold text-csi-blue'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					{category.category}
				</button>
			{/each}
		</nav>
		<a
			href={resolve("/catalog")}
			class="group inline-flex items-center gap-1.5 pb-3 text-sm font-normal text-gray-500 transition-colors hover:text-gray-700"
		>
			<span>Go to All Products</span>
			<img src={RightArrow} class="h-4 w-4 align-middle opacity-60" alt="Button" />
		</a>
	</div>
</div>

<Carousel products={selectedProducts} bind:pageNum={pageNum}></Carousel>
