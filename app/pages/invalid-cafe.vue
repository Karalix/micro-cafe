
<template>
    <div class="bg-(--ui-bg-soft) p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6">Invalid Cafe</h1>
        <div class="flex flex-col justify-center grow">
            <h2 class="font-bold text-2xl mb-4 ml-4 sm:ml-6">This cafe does not exist</h2>
            <UCard
                variant="soft"
                class="flex flex-row bg-white drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-gray-50 active:drop-shadow-md transition-all">
               <div>Go back</div>
            </UCard>
        </div>
    </div>
</template>