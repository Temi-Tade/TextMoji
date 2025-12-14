<script lang="ts">
    import image from "$lib/assets/favicon.svg";

    type Tab = {
        id: number,
        name: string,
        route: string,
        icon?: string
    }

    const TABS: Tab[] = $state([
        { id: 0, name: "My Cards", route: "/app" },
        { id: 1, name: "Create", route: "/app/create" },
        { id: 3, name: "Profile", route: "/app/profile" },
    ]);
    let activeTab = $state("My Cards");

    function setActiveTab(newTabName: string) {
        activeTab = newTabName;
    }
</script>

<div class="sticky bottom-0 right-0 left-0 p-1 shadow-lg bg-[#fff]">
    <ul class="p-1 flex justify-around items-center">
        {#each TABS as tab (tab.id)}
            <li class="{activeTab === tab.name ? 'text-[var(--button-primary)] font-bold' : ''}">
                <a href="{tab.route}" onclick={() => setActiveTab(tab.name)}>
                    {#if tab.id === TABS.length - 1}
                        <img src={image} alt="Avatar" width="20 " class="m-auto rounded-[50%] p-[.125rem]">
                    {/if}
                    <!-- icon here... -->
                    <p>{tab.name}</p>
                </a>
            </li>
        {/each}
    </ul>
</div>