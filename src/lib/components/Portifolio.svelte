<script lang="ts">
    import { onMount } from "svelte";
  
    let portifolio:Array<any> = [];
    onMount(async () => {
  
      // Carregar produtos quando a página é carregada
      const resPortifolio = await fetch('api/portifolioHome');
      const dataPortifolio = await resPortifolio.json();
      portifolio = dataPortifolio.portifolio;
  
    });
  
  </script>

<div class="flex flex-col md:flex-row w-full md:h-[400px]">
    {#each portifolio as p(p.id)}
    <div class="md:w-1/3 h-full relative cursor-pointer transition-all">
        <div class="absolute w-full h-full camadaEscura transition-all">
            <img src="img/white-instagram-icon-instagram-logo-instagram-instagram-icon-white-11553385558pigg7yyye3.webp" class="w-8 ml-auto mr-auto bottom-1/2 top-1/2 relative opacity-0 instaIcon transition-all"/>
    
        </div>
        <img src="{p.picture}" class="w-full h-full"/>
    </div>
    {/each}

<!-- <div class="md:w-1/3 h-full relative cursor-pointer ">
        <div class="absolute w-full h-full camadaEscura transition-all">
            <img src="img/white-instagram-icon-instagram-logo-instagram-instagram-icon-white-11553385558pigg7yyye3.webp" class="w-8 ml-auto mr-auto bottom-1/2 top-1/2 relative opacity-0 instaIcon transition-all"/>

        </div>

    <img src="img/2024-05-27_09h08_01.png" class="w-full h-full"/>
</div>
<div class="md:w-1/3 h-full relative cursor-pointer">
    <div class="absolute w-full h-full camadaEscura transition-all">
        <img src="img/white-instagram-icon-instagram-logo-instagram-instagram-icon-white-11553385558pigg7yyye3.webp" class="w-8 ml-auto mr-auto bottom-1/2 top-1/2 relative opacity-0 instaIcon transition-all"/>
    </div>
    <img src="img/2024-05-26_08h35_34.png" class="w-full h-full"/>
</div> -->
</div>

<style>
 .camadaEscura{
    background-color: rgba(0, 0, 0, 0.2);
 }
 div div:hover .camadaEscura{
    background-color: rgba(0, 0, 0, 0.3);

 }
 div div:hover .instaIcon{
    opacity: 0.7;
 }
</style>