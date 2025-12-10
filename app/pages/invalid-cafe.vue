
<template>
    <div class="bg-latte p-8 min-h-screen flex flex-col">
        <h1 class="font-bold text-3xl mb-4 ml-4 sm:ml-6 text-coffee">Invalid Cafe</h1>
        <div class="flex flex-col justify-center grow">
            <h2 class="font-bold text-2xl mb-4 ml-4 sm:ml-6 text-coffee">This cafe does not exist</h2>
            <UCard
                class="flex flex-row bg-white dark:bg-latte-50 drop-shadow-xl rounded-2xl hover:cursor-pointer hover:bg-latte-50 dark:hover:bg-latte-100 active:drop-shadow-md transition-all ring-1 ring-gray-200 dark:ring-gray-700">
               <div class="text-coffee">Go back</div>
            </UCard>
        </div>
    </div>
</template>