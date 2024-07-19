<script lang="ts">
    import { onMount } from "svelte";
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    
    
    onMount(async () => {
        const id = get(page).params.id;

        const res = await fetch("/api/scheduling", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hourId:id
          }),
        });
        const data = await res.json();
        console.log(data);
    });
    
    </script>

<div class="w-fit h-fit ml-auto mr-auto top-40 relative block">
<h1 class="text-[30px] font-bold">Cancelado</h1>
</div>