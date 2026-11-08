import { supabase } from '$lib/supabaseClient';
import type { CartItem } from '$lib/types'
import { error, fail, json, type Actions } from '@sveltejs/kit';
import * as v from 'valibot'
import { CreateCartSchema, DeleteCartEntriesSchema } from '$lib/actions/cart.schema.js';
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
            ID,
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
            id: cartItem.ID ?? -1,
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

export const actions:Actions =  {

    
    addCartEntry:  async({locals: {supabase}, request}) => {
        
        const user = (await supabase.auth.getUser()).data.user

        if(!user) {
            return fail(403, {message: "User is not logged in"})
        }
        
        const data = Object.fromEntries(await request.formData())
        let cart_input

        try {
            cart_input = v.parse(CreateCartSchema,data)
        }
        catch {
            return fail(422, {message: "Error Parsing or Evaluating Variant ID and Count arguments"})
        }

        const {data: insert_data, error:insert_error} = await supabase.from("ShoppingCartItems").insert(
            {
                VariantID: cart_input.variant_id,
                Count: cart_input.count,
                UserID: user.id
            }
        ).select("ID")

        if(insert_error) {
            return fail(501, {message: insert_error.message})
        }
        else {
            const [{ID}] = insert_data
           console.log(ID)
            
            return {success: true}
        }

    },

    deleteCartEntry: async ({locals: {supabase}, request}) => {
        const user = (await supabase.auth.getUser()).data.user

        if(!user) {
            return fail(403, {message: "User is not logged in"})
        }

        const data = await request.formData()
        let id
        try {
            id = Number(data.get("id")?.toString() ?? '-1')
        } catch(error) {
            return fail(500, {message: "Parsing Error"})
        }

        const {error: delete_error} =await  supabase.from("ShoppingCartItems").
        delete().
        eq('ID',id)
        
        if(delete_error) {
            return fail(500, {message: delete_error.message})
        }
        return {success: true}
    },
    
    deleteCartEntries: async({locals: {supabase}, request}) => {
        const user = (await supabase.auth.getUser()).data.user

        if(!user) {
            return fail(403, {message: "User is not logged in"})
        }

        const data = Object.fromEntries(await request.formData())
        
        //format of input is a Number array binded to a hidden input 
        //let toggled = $state<Number[]>([]) 
        //<input type="hidden" name="cartIDs" bind:value={toggled}>
    
        //{#each data.cartItems as c}
        //<input type="checkbox" value={c.id} bind:group={toggled}>
        //{/each}

        let input
        try {
            input = v.parse(DeleteCartEntriesSchema,data)
        } catch {
            return fail(422, {message: "Error Parsing or Evaluating Delete Entries"})
        }
        
        
        const {error:delete_error} = await supabase.from("ShoppingCartItems").delete().in("ID",input.cartIDs)

        //according to Supabase docs, if |cartIDs| > |user's cart entries|, the delete still returns a success
        //i.e. extra IDs are skipped, or ignored.
        if(delete_error) {
            return fail(500, {message: delete_error.message})
        }
        return {success:true}


    },
    editCartEntry: async ({locals: {supabase}, request}) => {
        const user = (await supabase.auth.getUser()).data.user

        if(!user) {
            return fail(403, {message: "User is not logged in"})
        }

        const data = await request.formData()
        let id, count
        try {
            id = Number(data.get("id")?.toString() ?? '-1')
            count = Number(data.get("count")?.toString() ?? '-1')
        } catch(error) {
            return fail(500, {message: "Parsing Error"})
        }

        if (count <=0 || id <= 0) {
            return fail(500, {mesage: "Value Out of Bounds"})
        }

        const {error} = await supabase.from("ShoppingCartItems").update({Count: count}).eq("ID",id)
        if(error) {
            return fail(500, {message:error.message})

        }
        return {success:true}
    }

}


async function validateStocks(variant_id: number, count: number) {
    const {data: variant_data, error:query_error} = await supabase.from("Variant")
            .select(`StockAmount`)
            .eq("id",variant_id)
            .eq("Active",true)
        
        if (query_error) {
            return fail (501, {message: query_error.message})
        }

        let [{StockAmount}] = variant_data

        if (!variant_data) {
            throw new Error("Variant not found or is not active")
        } else if(StockAmount < count) {
            throw new Error("Variant Stocks too low")
        }
        return true
}