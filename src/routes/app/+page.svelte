<script lang="ts">
	import { onMount } from "svelte";
	import Modal from "../../ui/Modal.svelte";
	import Toast from "../../ui/Toast.svelte";
	import Header from "../../ui/Header.svelte";

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

    let sort: string = $state("descending")
    let showModal: boolean = $state(true);
    let showToast: boolean = $state(false);
    let toastText: string = $state("");
    let modalText: string = $state("Loading Unicode Emoji list. Please wait");

    let isCounting = $state(false);

    onMount(() => {
        const request = new XMLHttpRequest();
        request.open('GET', "/array.json");

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

    function handleFileUpload(e:Event) {
        uploadedChatFile = (e.target as any).files[0];
        const fileReader = new FileReader();
        modalText = "Loading file..."
        showModal = true;

        fileReader.onload = async function (e:Event) {
            result = await (e.target as any).result;
            showModal = false;
        }

        fileReader.readAsText(uploadedChatFile);
    }

    function parseChat(chat:string) {
        toastText = "Counting... hang on, this might take a while";
        const chars = chat.replace(/\d/g, "").split("").filter(char => char !== " ");

        unicodeEmojis.forEach((e: any, i:number) => {
            const chatEmojis = chars.filter((c: any) => c.charCodeAt() === e.charCodeAt());
            emojis.push(...chatEmojis);
        });

        return emojis;
    }

    function countEmojis() {
        return new Promise(resolve => {
            countedEmojis.length = 0;
            const parsedEmojis = parseChat(result);
            uniqueEmojis = [...new Set(parsedEmojis)];
            
            uniqueEmojis.forEach(async (e:any) => {
                countedEmojis.push({
                    emoji: e,
                    count: parsedEmojis.filter((c: any) => e.charCodeAt() === c.charCodeAt()).length
                });
            });

            countedEmojis.sort((a,b) => b.count - a.count);
            if (countedEmojis.length === 0) {
                showModal = true;
                modalText = "I could not find emojis in here, ensure you uploaded a TXT file of an exported WhatsApp chat. If you are sure you did, you lot don't use emojis when chatting eh?";
            }
            resolve(countedEmojis);
        })
    }

    function tryAnotherChat() {
        emojis.length = 0;
        countedEmojis.length = 0;
        result = "";
        sort = "descending";
        chatFile = undefined;
        uploadedChatFile = undefined;
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
                        <label for="chat"
                            class="p-2 bg-[#0505ff] text-[#fff] rounded-sm">Upload &uarr;
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
        
        {#if result !== "" && countedEmojis.length === 0 && showModal === false}
            <div class="flex flex-col justify-center items-center">
                <p class="text-center">
                    <em>{uploadedChatFile.name} ({uploadedChatFile.size} Bytes)</em>
                </p>
                <div class="p-2">
                    <button
                        onclick={async () => {
                            alert();
                            isCounting = true;
                            try {
                                await countEmojis();
                            } finally {
                                isCounting = false;
                            }
                        }}>Count Emojis</button>
                    </div>
                </div>
                <div class="p-2">
                    <button onclick={tryAnotherChat}>{isCounting ? "Shit" : "Upload a different chat"}</button>
                </div>
        {/if}
        {#if isCounting}
            <p>Wait up</p>
        {/if}
        {#if countedEmojis.length !== 0}
            <div class="max-h-[65dvh] overflow-auto">
                <div class="sticky top-0 left-0 right-0 bg-[#fff] shadow-sm">
                    <h3 class="text-center text-xl font-bold">Emojis found in chat</h3>
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
                {#each countedEmojis as entry}
                    <p class="flex p-1 w-[80dvw] rounded-sm even:bg-[#ccc7]">
                        <span>{entry.emoji}</span>
                        <span>{formatter.format(entry.count)}</span>
                    </p>
                {/each}
            </div>

            <div class="mt-4 p-2 flex flex-col justify-around items-center h-[8rem]">
                <button>Share stats</button>
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