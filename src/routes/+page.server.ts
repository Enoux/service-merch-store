import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';
import type { Category, Product } from '$lib/types';

function getUrl(path:string|null) {
	if (!path) {
		return null
	}
	const {data} = supabase.storage.from("Product Pictures").getPublicUrl(path)
	//console.log(data.publicUrl)
	return data.publicUrl
}

export const load: PageLoad = async () => {

	const [variantResult, categoryResult] = await Promise.all([
		supabase
			.from('Variant')
			.select(`
				id,
				ImagePath,
				SellingPrice,
				VariantName,
				StockAmount,
				Products!inner(
					id,
					Category!inner(
						id,
						Category
					)
				)
			`)
			.eq('Active', true),
		supabase.from('Category').select('id, Category')
	]);

	if (variantResult.error) {
		console.error('Supabase Variant error:', variantResult.error);
		return { products: [], categories: [] };
	}

	if (categoryResult.error) {
		console.error('Supabase Category error:', categoryResult.error);
		return { products: [], categories: [] };
	}

	const products: Product[] = (variantResult.data ?? []).map((variant) => {
		const product = Array.isArray(variant.Products)
			? variant.Products[0]
			: variant.Products;
		const category = Array.isArray(product?.Category)
			? product.Category[0]
			: product?.Category;

		return {
			id: variant.id,
			image: getUrl(variant.ImagePath) ?? null,
			gallery: [],
			price: Number(variant.SellingPrice) || 0,
			name: variant.VariantName ?? 'Unnamed Variant',
			category: category?.Category ?? 'No Category',
			stock_amount: variant.StockAmount ?? 0
		};
	});

	const categories: Category[] = (categoryResult.data ?? []).map((category) => ({
		id: category.id,
		category: category.Category
	}));

	console.log(products);

	return { products, categories };
};
