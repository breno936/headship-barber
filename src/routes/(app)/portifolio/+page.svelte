<script lang="ts">
/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'edge'
};

  import { onMount } from "svelte";

  let styleAspect = "aspect-video";
  let contador = 0;

  let portifolio:Array<any> = [];
  onMount(async () => {

    // Carregar produtos quando a página é carregada
    const resPortifolio = await fetch('api/portifolio');
    const dataPortifolio = await resPortifolio.json();
    portifolio = dataPortifolio.portifolio;


  });

  function updateAspect() {
    console.log(styleAspect);
    console.log(contador);
    
    if (contador === 0 && styleAspect === "aspect-video") {
      contador++;
      return styleAspect = "aspect-video";
    } else if (contador === 1 && styleAspect === "aspect-video") {
      contador = 0;
      return styleAspect = "aspect-square";
    } else if (contador === 0 && styleAspect === "aspect-square") {
      contador++;
      return styleAspect = "aspect-square";
    } else if (contador === 1 && styleAspect === "aspect-square") {
      contador = 0;
      return styleAspect = "aspect-video";
    }
  }
</script>

<div class="columns-3 gap-8 top-32 md:top-0 relative">
  {#each portifolio as p (p.id) }

    <div class="w-full {updateAspect()} h-full mb-8 cursor-pointer relative block">
      <div class="absolute w-full h-full camadaEscura transition-all"/>

      <img src="{p.picture}" class="h-full w-full"/>
    </div>

  {/each}

</div>

<style>
   .camadaEscura{
    background-color: rgba(255, 255, 255, 0.2);
 }
 div div:hover .camadaEscura{
    background-color: rgba(255, 255, 255, 0.3);

 }
</style>