<script lang="ts">
  import { register } from 'swiper/element/bundle';
  import { onMount } from "svelte";

  let slides:Array<any> = [];

  onMount(async () => {
    register();
 // Carregar produtos quando a página é carregada
    const resSlide = await fetch('api/slideHome');
    const dataSlide = await resSlide.json();
    slides = dataSlide.slides;
    console.log(slides);

    var swiper = new Swiper(".mySwiperTopo", {
      loop: true,
      autoplay:true,
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

   

    });
</script>


<div class="swiper mySwiperTopo z-10 relative">
    <div class="swiper-wrapper">
      {#each slides as slide(slide.id) }
      <div class="swiper-slide">
  
        <div class="absolute z-30">
          <div class="titleSlide text-[44px] py-5 px-14 text-white">{slide.title}</div>
          <div class="pSlide text-[16px] py-2 px-10 text-white w-fit ml-auto mr-auto">{slide.subTitle}</div>
          <a href="{slide.linkButton}"><button class="mt-4 py-2 px-10 border border-white text-white rounded-xl text-sm transition-all slideButton">{slide.textButton}</button></a>
        </div>
      <div class="backBlur absolute w-full h-full z-20"></div>
      
      <img src="{slide.picture}" class="w-full h-full"/>
  
      </div>
      {/each}
   
      
    </div>
    <div class="swiper-button-next md:mr-10"></div>
    <div class="swiper-button-prev md:ml-10"></div>
  </div>


<style module>
    .backBlur{
        backdrop-filter: blur(2.5px);
    }
    .titleSlide{
        background-color: rgb(56, 112, 171, 0.5);
        font-family: Urban Heroes;
    }
    .pSlide{
        background-color: rgb(56, 112, 171, 0.5);
        font-family:Inter;

    }
    .swiper-button-next, .swiper-button-prev{
          color: rgb(56, 112, 171) !important;
    }
    .swiper {
      width: 100%;
      height: 80vh;
    }

    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    
    }

    .swiper-slide img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .slideButton:hover{
      border-color: white;
      background-color: white;
      color: #3870AB;
    }
  
</style>