<script lang='ts'>
    import Cart from '$lib/assets/shopping_cart.svg';

    let {
        message
    } : {
        message: string
    } = $props();
</script>

<div class="fixed inset-0 z-100 flex items-center justify-center">
    <div class="flex flex-wrap flex-column justify-center w-1/4 rounded-lg p-8 bg-gray-950/50">
        <img src={Cart} alt="Shopping Cart Icon" />
        <p class="w-full mt-4 text-center font-bold text-white text-lg">{message}</p>
    </div>
</div>