<script lang='ts'>
    let {
        message,
        icon,
        isDisplayed = $bindable()
    } : {
        message: string
        icon: string,
        isDisplayed: boolean
    } = $props();
</script>

<button class="fixed inset-0 z-100 flex items-center justify-center" onclick={() => isDisplayed = false}>
    <div class="flex flex-wrap flex-column justify-center w-1/4 rounded-lg p-8 bg-gray-950/50">
        <img src={icon} class="w-20 h-20" alt="Modal Icon" />
        <p class="w-full mt-4 text-center font-bold text-white text-lg">{message}</p>
    </div>
</button>