import { supabase } from '$lib/supabaseClient';
import type { CartItem } from '$lib/types'

export async function load({ locals }): Promise<{
    cartItems: CartItem[],
}> {

    const { data: { user }, error: userError } = await locals.supabase.auth.getUser()

    if (userError || !user) {
        console.log("Not logged in");
    }
    
    const [ shoppingCartResult ] = await Promise.all([
        locals.supabase
        .from('ShoppingCartItems')
        .select(`
            Count,
            Variant!inner (
                VariantName,
                SellingPrice,
                ImagePath
            )
        `)
    ])
    
    const { data: cartData, error: cartError } = shoppingCartResult

    if (cartError) {
        console.error('Supabase Cart error:', cartError);
        return { cartItems: [] };
    }

    const cartItems: CartItem[] = (cartData ?? []).map((cartItem) => {
        const variant = Array.isArray(cartItem.Variant)
            ? cartItem.Variant[0]
            : cartItem.Variant;

        return {
            count: cartItem.Count ?? 0,
            image: getUrl(variant.ImagePath) ?? null,
            price: Number(variant.SellingPrice) || 0,
            name: variant.VariantName ?? 'Unnamed Variant',
        };
    });

    return { cartItems };
}

function getUrl(path:string|null) {
    if (!path) {
        return null
    }
    const {data} = supabase.storage.from("Product Pictures").getPublicUrl(path);
    return data.publicUrl;
}