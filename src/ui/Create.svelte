<script lang="ts">
	import { readStorage } from "$lib/functions/lib";

    let svgContents: string = $state("");
    // const SVG_CONTENT_DATA = {
    //     headerFontSize: 
    // }
    const userGithubData: any = readStorage();
    const formEntries = Object.entries(userGithubData);

    function handleCreateCard(e: Event) {
        e.preventDefault();

        svgContents = `
            <foreignObject x="10" y="20" width="100" height="50">
                <div>
                    <small style="font-size: .5rem; line-spacing: 0;"><em>${userGithubData.bio}</em></small>
                </div>
            </foreignObject>
            <text fill="#333" font-size="9" x="120" y="20" font-style="italic">${userGithubData.userName}</text>
            <text fill="#333" font-size="9" x="120" y="30" font-style="italic">${userGithubData.xUserName}</text>
            <text fill="#333" font-size="9" x="120" y="40" font-style="italic">${userGithubData.publicRepos} Public Repos</text>
        `
    }
</script>

<div class="p-2">
    <div class="p-2">
        <p>This is the data that would be used to create your card, it was fetched from your GitHub profile, if you need to make any changes, head over to your GitHub profile.</p>
    </div>

    <form autocomplete="off" spellcheck="false" onsubmit={handleCreateCard}>
        {#each formEntries as formEntry}
            {#if (formEntry[0] !== "publicRepos") && 
                (formEntry[0] !== "githubUrl") && 
                (formEntry[0] !== "cards") &&
                (formEntry[0] !== "id")}
                <div class="my-1">
                    <label
                        for="{formEntry[0]}"
                        class="p-2 font-bold text-lg">{formEntry[0].toLowerCase()}</label>
                    {#if formEntry[0] === "avatar"}
                        <img
                            width="150"
                            src={(formEntry[1] as string)}
                            alt="{userGithubData.userName} GitHub Avatar">
                    {:else if formEntry[0] === "bio"}
                        <textarea
                            readonly
                            autocomplete="off"
                            rows="3"
                            cols="40"
                            id={formEntry[0]}
                            value={(formEntry[1] as string)}></textarea>
                    {:else}    
                        <input
                            readonly
                            type="text"
                            autocomplete="off"
                            class="w-[95%]"
                            id="{formEntry[0]}"
                            value={(formEntry[1] as string  )}>
                    {/if}
                </div>
            {/if}
        {/each}

        <div class="flex justify-center">
            <button type="submit">Create</button>
        </div>
    </form>

    <div>
        <svg viewBox="0 0 200 100" width="100" class="w-[100%] border-1 rounded-md">
            {@html svgContents}
            <!-- <text fill="#333" font-size="20" textLength text-rendering="smooth" x="10" y="20" text-decoration="underline">AAA</text> -->
        </svg>
    </div>
</div>