<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    export let onIntersection: any;
    let element: any;
    
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            onIntersection(entries[0].isIntersecting);
        }, {
            root: null,
            rootMargin: "0px",
            threshold: .95,
        });
    
        observer.observe(element);
    
        return () => {
            observer.unobserve(element);
        }
    })
    
</script>

<div bind:this={element} class="h-[100%]">
    <slot/>
</div>
