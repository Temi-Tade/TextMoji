<script lang="ts">
    let { users } = $props();
    let isSearching: boolean = $state(false);
    let searchResults: any = $state([]);
    let searchParam: string = $state("");
    let isNoSearchResult: boolean = $state(false);

    function handleSearch(e:any) {
        isSearching = true;
        isNoSearchResult = searchResults.every((result:any) => !result.name.toLowerCase().includes(searchParam.toLowerCase().trim()));
    }
</script>

<section>
    <form autocomplete="off">
        <div class="flex justify-center items-center pt-4">
            <input
                type="search"
                name="search"
                id="search"
                class="w-[95%] m-auto block"
                autocorrect="off"
                placeholder="Search people, projects..."
                bind:value={searchParam}
                oninput={handleSearch}
                onfocus={() => searchResults = [...Object.values(users)]}>
        </div>

        {#if isSearching}
            <div class="p-2">
                <ul>
                    {#each searchResults as result}
                        {#if result.name.toLowerCase().includes(searchParam.toLowerCase().trim())}
                            <li class="p-1 my-1">
                                {result.name}
                            </li>
                        {/if}
                    {/each}

                    {#if isNoSearchResult}
                        <div class="p-4 text-center">
                            <p class="text-xl font-bold">Could not find results for "{searchParam}"</p>
                        </div>
                    {/if}
                </ul>
            </div>
        {/if}
    </form>
</section>