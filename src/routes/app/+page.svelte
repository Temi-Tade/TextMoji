<script lang="ts">
	import { onMount } from "svelte";
	import Modal from "../../ui/Modal.svelte";
	import Toast from "../../ui/Toast.svelte";
	import Header from "../../ui/Header.svelte";
    import {base} from '$app/paths';

    const formatter = Intl.NumberFormat('en-US', {
        style: "decimal",
        useGrouping: true
    })

    let emojis: any[] = [];
    let unicodeEmojis: any[] = $state([]);
    let countedEmojis: any[] = $state([]);
    let uniqueEmojis: any[] = $state([]);

    let chatFile:any = $state();
    let uploadedChatFile: any = $state();
    let result:string = $state("");

    let sort: string = $state("descending");
    let showModal: boolean = $state(true);
    let showToast: boolean = $state(false);
    let toastText: string = $state("");
    let modalText: string = $state("Loading Unicode Emoji list. Please wait");

    onMount(() => {
        const request = new XMLHttpRequest();
        request.open('GET', `${base}/array.json`);

        request.onload = function() {
            if (request.status === 200) {
                unicodeEmojis = JSON.parse(request.responseText).emojis;
            } else {
                showModal = true;
                modalText = "An error occured. Failed to load Unicode Emoji List"
            }
        }

        request.onloadend = function() {
            showModal = false;
        }

        request.send();
    })

    function removeToast() {
        setTimeout(() => {
            showToast = false;
        }, 3000);
    }

    function handleFileUpload(e:Event) {
        uploadedChatFile = (e.target as any).files[0];
        const fileReader = new FileReader();
        modalText = "Parsing chat..."
        showModal = true;

        fileReader.onload = async function (e:Event) {
            result = await (e.target as any).result;
            showModal = false;

            const chars = result.replace(/\d/g, "").split("").filter(char => char !== " "); // remove digits and whitespaces

            unicodeEmojis.forEach((e: any) => {
                const chatEmojis = chars.filter((c: any) => c === e);
                emojis.push(...chatEmojis);
            });

            countEmojis();
        }

        fileReader.readAsText(uploadedChatFile);
    }

    function countEmojis() {
        countedEmojis.length = 0;
        uniqueEmojis = [...new Set(emojis)];
        
        uniqueEmojis.forEach(async (e:any) => {
            countedEmojis.push({
                emoji: e,
                count: emojis.filter((c: any) => e === c).length
            });
        });

        countedEmojis.sort((a,b) => b.count - a.count);
        if (countedEmojis.length === 0) {
            showToast = true;
            toastText = "I could not find emojis in here, ensure you uploaded a TXT file of an exported WhatsApp chat. If you are sure you did, you lot don't use emojis when chatting eh?";

            removeToast();
            tryAnotherChat();
        }
    }

    function tryAnotherChat() {
        emojis.length = 0;
        countedEmojis.length = 0;
        result = "";
        sort = "descending";
        chatFile = undefined;
        uploadedChatFile = undefined;
    }

    function shareStats() {
        let topFiveText = "";
        const topFiveEmojis = countedEmojis.slice(0, 5);

        topFiveEmojis.forEach(entry => topFiveText += `\n${entry.emoji} -> ${entry.count}`);
        try {
            navigator.share({
                text: `Top emojis in WhatsApp chat with ${uploadedChatFile.name}: ${topFiveEmojis.forEach((e) => `${e.emoji} ${e.count}`)}`,
                url: location.toString(),
            });
        } catch {
            showModal = true;
            modalText = "An error occured while trying to share";
        }
    }
</script>

<section>
    <Header label="TextMoji"/>

    <div class="p-2 grid place-items-center h-[100%]">
        {#if result === ""}
            <div>
                <form>
                    <div>
                        <p class="text-center">Upload your exported WhatsApp chats.</p>
                    </div>

                    <div class="p-3 flex flex-column justify-center items-center">
                        <label for="chat">Upload &uarr;
                            <input
                                type="file"
                                name="chat"
                                id="chat"
                                bind:files={chatFile}
                                class="!hidden"
                                onchange={handleFileUpload}
                            />
                        </label>
                    </div>
                </form>
            </div>
        {/if}
        
        {#if countedEmojis.length !== 0}
            <div class="max-h-[65dvh] overflow-auto">
                <div class="sticky top-0 left-0 right-0 bg-[#fff] shadow-sm">
                    <h3 class="text-center text-xl font-bold">Emojis found in chat:</h3>
                    <p class="flex justify-end">
                        <button
                            class="!bg-[transparent] !text-[var(--button-primary)] text-md"
                            onclick={() => {
                                if (sort === "ascending") {
                                    sort = "descending";
                                    countedEmojis.sort((a,b) => b.count - a.count);
                                } else {
                                    sort = "ascending";
                                    countedEmojis.sort((a,b) => a.count - b.count);
                                }
                            }}>Change order</button>
                    </p>
                </div>
                <p class="flex p-1 w-[80dvw] rounded-sm even:bg-[#ccc7]">
                    <span>Emoji</span>
                    <span>Usage</span>
                </p>
                <div class="flex justify-center flex-col items-center">
                    {#each countedEmojis as entry}
                        <p class="flex p-1 w-[80dvw] rounded-sm even:bg-[#ccc7]">
                            <span>{entry.emoji}</span>
                            <span>{formatter.format(entry.count)}</span>
                        </p>
                    {/each}
                </div>
            </div>

            <div class="mt-4 p-2 flex flex-col justify-around items-center h-[8rem]">
                <button onclick={shareStats}>Share stats</button>
                <button onclick={tryAnotherChat}>Upload another chat</button>
            </div>
        {/if}
    </div>

    {#if showModal}
        <Modal onClose={() => showModal = false}>
            {modalText}
        </Modal>
    {/if}

    {#if showToast}
        <Toast text={toastText}/>
    {/if}
</section>

<style>
    span{
        display: inline-block;
        width: 50%;
        text-align: center;
        padding: .25rem;
        font-size: 1.2rem;
    }
</style>
