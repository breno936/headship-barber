<script lang="ts">
  import { onMount } from "svelte";

  let servicos:Array<any> = [];
  onMount(async () => {

    // Carregar produtos quando a página é carregada
    const resServico = await fetch('api/servicos');
    const dataServico = await resServico.json();
    servicos = dataServico.services;

      var swiper = new Swiper(".mySwiper", {
      effect: "coverflow",
      centeredSlides: true,
      initialSlide:1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
      },
      });
  });



</script>
<a id="servicos"></a>

<div
  class="w-full h-[700px] bg-[#2A4C71] mt-32 flex justify-evenly items-center"
>
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    {#each servicos as service (service.id) }
    <div class="swiper-slide">
      <div class="bg-white p-5 text-center w-full flex items-center flex-col">
        <div class="w-36 h-26">
        <img
          src="{service.picture}"
          class="w-full h-full"
        />
      </div>
        <h1 class="text-3xl">{service.name}</h1>
        <p class="mt-8">{service.description}</p>
    
        <h2 class="font-black text-2xl mt-4 text-[#183A5D]">R${service.price}</h2>
        <a href="#agenda"><button class="mt-4 py-2 px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all">AGENDAR</button></a>
      </div>
        </div>
    {/each}

    <!-- <div class="swiper-slide">
      <div class="bg-white p-5 text-center w-full flex items-center flex-col">
        <img
          src="/img/tesoura-e-pente-branco.png"
          class="w-40 h-30"
        />
        <h1 class="text-3xl">BARBA</h1>
        <p class="mt-8">Exemplo de texto para corte de cabelo</p>
    
        <h2 class="font-black text-2xl mt-4 text-[#183A5D]">R$45,00</h2>
        <button class="mt-4 py-2 px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all">AGENDAR</button>
      </div>
        </div>
    <div class="swiper-slide">
      <div class="bg-white p-5 text-center w-full flex items-center flex-col">
        <img
          src="/img/navalha.jpg"
          class="w-32 h-22"
        />
        <h1 class="text-3xl">COMBO</h1>
        <p class="mt-8">Exemplo de texto para corte de cabelo</p>
    
        <h2 class="font-black text-2xl mt-4 text-[#183A5D]">R$45,00</h2>
        <button class="mt-4 py-2 px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all">AGENDAR</button>
      </div>
        </div> -->

  </div>
  <div class="swiper-button-next mr-5 md:mr-10 lg:mr-20 text-[rgb(56, 112, 171)]"></div>
  <div class="swiper-button-prev ml-5 md:ml-10 lg:ml-20 text-[rgb(56, 112, 171)]"></div>
  <div class="swiper-pagination"></div>
</div>


</div>




<style>
  
  .swiper {
      width: 100%;
      padding-top: 50px;
      padding-bottom: 50px;
    }

    .swiper-slide {
      width: 300px;
      height: 100%;
    }

  h1 {
    font-family: Urban Heroes;
  }
  p {
    font-family: Inter;
  }
  h2 {
    font-family: Inter;
  }
  
  button:hover{
    background-color: #183A5D;
    color:white;
    border-color: #183A5D;
  }
</style>
