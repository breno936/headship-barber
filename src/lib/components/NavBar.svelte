<script lang="ts">
  import { onMount } from "svelte";

  var lastScrollTop = 0;
  // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.

  onMount(() => {
    window.addEventListener("resize", function(){
      const screenWidth = window.innerWidth;

      if(screenWidth > 769){
        let nav = document.getElementById("collapse-nav-menu");
        nav.style.display = "none";
        nav.style.height = "0";
      }
    });

    window.addEventListener(
      "scroll",
      function () {
        const screenWidth = window.innerWidth;

        var st = window.pageYOffset || document.documentElement.scrollTop;
      if(screenWidth > 769){
        let nav = document.getElementById("collapse-nav-menu");
        nav.style.display = "none";
        nav.style.height = "0";

        if (st > lastScrollTop) {
          // Do scroll down code
          if (st > 120) {
            this.document.getElementById("navTopo").style.opacity = 0;
            this.document.getElementById("navScroll").style.display = "block";

            setTimeout(() => {
              this.document.getElementById("navTopo").style.display = "none";
              this.document.getElementById("navScroll").style.opacity = 1;
            }, 100);
          }
        } else {
          // Do scroll down code
          if (st == 0) {
            this.document.getElementById("navTopo").style.display = "flex";

            this.document.getElementById("navScroll").style.opacity = 0;

            setTimeout(() => {
              this.document.getElementById("navTopo").style.opacity = 1;
              this.document.getElementById("navScroll").style.display = "none";
            }, 100);
          }
        }
      }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      },
      false
    );
  });

  function collapseNav(){
    let nav = document.getElementById("collapse-nav-menu");

    if(nav?.style.height == "0px"){
      nav.style.display = "block";

        setTimeout(() => {
          nav.style.height = "20rem";
        }, 100);
    }else{
      setTimeout(() => {
          nav.style.display = "none";
        }, 100);
      nav.style.height = "0";
    }
  }
</script>

<div
  id="navTopo"
  class="w-full h-32 bg-[#183A5D] flex flex-col z-50 fixed md:relative transition-all"
>
  <div>
    <div class="socialMedias w-full p-2 pr-4 h-fit flex justify-end relative">
      <a href="https://wa.me/+5519953228737" target="_blank">
      <img
        src="/img/whatsapp-pb.png"
        class="w-5 h-5 mr-3 cursor-pointer transition-all"
      />
      </a>
      <a href="https://www.instagram.com/headship.barber?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank">
      <img
        src="/img/white-instagram-icon-instagram-logo-instagram-instagram-icon-white-11553385558pigg7yyye3.webp"
        class="w-5 h-5 cursor-pointer transition-all"
      />
      </a>
    </div>
    <hr />
  </div>

  <div class="w-full h-full relative px-4 md:px-0 flex justify-between md:justify-center items-center">
   
    <nav class="hidden   md:block mr-10">
      <ul class="flex justify-evenly">
        <li class="md:mr-4 lg:mr-7"><a href="/">HOME</a></li>
        <li class="md:mr-4 lg:mr-7"><a href="/portifolio">PORTIFÓLIO</a></li>
        <li class="lg:mr-7"><a href="/#servicos">SERVIÇOS</a></li>
      </ul>
    </nav>
    <div class="bg-black w-auto md:w-40 h-full">
      <a href="/">
      <img
        src="/img/425497447_377500168349674_2839481224583091659_n.jpg"
        class="h-full -auto md:h-36 md:w-40 absolute cursor-pointer logo transition-all"
      />
    </a>
    </div>
    <nav class="hidden md:block ml-10">
      <ul class="flex">
        <li class="lg:ml-7"><a href="/#agenda">AGENDA</a></li>
        <li class="md:ml-4 lg:ml-7">A HEADSHIP</li>
        <li class="md:ml-4 lg:ml-7"><a href="/shop">SHOP</a></li>
      </ul>
    </nav>

    <div class="blck md:hidden" on:click={collapseNav}>
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 17 14">
        <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
    </svg>
    </div>

  </div>
</div>


<div
  id="navScroll"
  class="w-full h-24 bg-[#183A5D] flex flex-col z-50 fixed hidden opacity-0 transition-all top-0"
>
  <div class="w-full h-full relative flex justify-between items-center">
    <div class="bg-black w-auto 4/6 ml-10">
      <a href="/">
      <img
        src="/img/425497447_377500168349674_2839481224583091659_n.jpg"
        class="h-full w-auto cursor-pointer logo transition-all"
      />
    </a>
    </div>
    <nav class="mr-10 flex items-center">
      <ul class="flex justify-evenly">
        <li class="mr-7"><a href="/">HOME</a></li>
        <li class="mr-7"><a href="/portifolio">PORTIFÓLIO</a></li>
        <li class="mr-7"><a href="/#servicos">SERVIÇOS</a></li>
        <li class="mr-7"><a href="/#agenda">AGENDA</a></li>
        <li class="mr-7">A HEADSHIP</li>
        <li class="mr-7"><a href="/shop">SHOP</a></li>

      </ul>

    </nav>
    <label for="my-drawer-4" class="drawer-button relative mr-10 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></label>

    
  </div>
  
</div>

<div id="collapse-nav-menu" class="h-0 top-32 w-full bg-black transition-all fixed z-50 overflow-hidden md:hidden">
  <nav class="h-full mt-auto relative">
    <ul class="flex justify-center bg-slate-800 h-full items-center flex-col">
      <li class=""><a href="/">HOME</a></li>
      <li class="mt-4"><a href="/portifolio">PORTIFÓLIO</a></li>
      <li class="mt-4"><a href="#servicos">SERVIÇOS</a></li>
      <li class="mt-4"><a href="#agenda">AGENDA</a></li>
      <li class="mt-4">A HEADSHIP</li>
      <li class="mt-4">SHOP</li>
    </ul>
  </nav>
  </div>

<style>
  hr {
    height: 1px;
    margin-left: auto;
    width: 30%;
    border: none;
    background-image: linear-gradient(to left, white, #183a5d);
  }

  li {
    font-family: Inter;
    color: white;
    font-weight: 800;
    cursor: pointer;
  }
  li::after {
    content: "";
    width: 0px;
    height: 1px;
    display: block;
    background-color: white;
    margin-left: auto;
    margin-right: auto;
    transition: all 0.1s linear;
  }
  li:hover::after {
    content: "";
    width: 100%;
  }
  .socialMedias img:hover {
    transform: scale(1.1);
  }
  .logo:hover {
    transform: scale(1.1);
  }
</style>
