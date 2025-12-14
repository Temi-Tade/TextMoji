<script lang="ts">
    let { text } = $props();
</script>

<div class="fixed top-0 left-0 right-0 z-999">
    <div class="p-2 bg-[#333] shadow-md m-1 rounded-md">
        <p class="text-[#fff]">{text}</p>
    </div>
</div>