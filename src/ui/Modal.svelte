<script lang="ts">
    let { children, onClose } = $props();
</script>

<div class="fixed inset-0 bg-[#7777] backdrop-filter-[blur(4px)] pt-20 z-999">
    <div class="p-2 m-auto w-90 rounded-sm shadow-md bg-[#fff]">
        <div class="flex justify-end">
            <button
                onclick={onClose}
                class="text-lg !bg-[transparent] !text-[#333] !p-1">&times;</button>
        </div>
        <p>{@render children?.()}</p>
    </div>
</div>

<!-- 
flow: sign in with google -> setup github -> enter name of repo to share/go to feed
-->