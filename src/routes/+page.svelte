<script lang="ts">
    import image from '$lib/assets/favicon.svg';
    import { base } from '$app/paths';
</script>

<header class="flex justify-between p-2 items-center shadow-sm sticky top-0 bg-[#fff] h-[8dvh]">
    <h1 class="text-xl font-bold">TextMoji</h1>
    <div>
        <a href="{base}/app/privacy">Privacy Notice</a>
    </div>
</header>

<div class="h-[92dvh] grid place-items-center">
    <div>
        <!-- <div>
            <img src="{image}" alt="TextMoji" class="m-auto">
        </div> -->

        <div class="text-center">
            <h1 class="text-3xl font-bold">TextMoji</h1>
            <p class="mb-2">Discover your most used emojis in your WhatsApp chats.</p>
            <a href="{base}/app" class="bg-[var(--button-primary)] !text-[#fff] p-2 rounded-sm">Try it out &rarr;</a>
        </div>

        <div class="p-4">
            <h3 class="font-bold text-lg">How to export WhatsApp chats</h3>
            <ul class="p-2">
                <li>Open a WhatsApp chat of your choice.</li>
                <li>Click on the three vertical dots at the top right corner.</li>
                <li>Click on 'More'.</li>
                <li>Click on 'Export Chat'.</li>
                <li>Click 'Without media' to make the process a bit faster.</li>
                <li>Depending on the size of the chat, it might take a while. Exporting the chat will create a zip file, unzip the file and you will find a .txt file of yor chat. This is the file you need to upload here</li>
            </ul>
        </div>

    </div>
</div>