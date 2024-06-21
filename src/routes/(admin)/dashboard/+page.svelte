<script lang="ts">
    import { onMount } from 'svelte';
    import type { Products } from '@prisma/client';
  import type { Decimal } from '@prisma/client/runtime/library';
  import { goto } from '$app/navigation';

  let products: number = 0;
  let services: number = 0;
  let scheduling: number = 0;
  let hoursOpen: number = 0;
  let hoursClosed: number = 0;

 
  onMount(async () => {
    // Carregar produtos quando a página é carregada
    const token = localStorage.getItem("token");

    const resToken = await fetch("api/tokenAuth", {
          method: "POST",
          headers: { "Content-Type": "application/json",
          'Authorization' : `Bearer ${token}`

           },
         
        });
      console.log(resToken);
    if(resToken.status == 401){
      goto("/login");
    }

    
    const res = await fetch('api/dashboard',{
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });
    const data = await res.json();
    products = data.products;
    services = data.services;
    scheduling = data.scheduling;
    hoursClosed = data.hoursClosed;
    hoursOpen = data.hoursOpen;
  });
 

</script>

<div class="stats shadow flex w-max h-max ml-auto mr-auto relative">
  
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div class="stat-title">Produtos</div>
      <div class="stat-value">{products}</div>
      <div class="stat-desc">Jan 1st - Feb 1st</div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
      </div>
      <div class="stat-title">Serviços</div>
      <div class="stat-value">{services}</div>
      <div class="stat-desc">↗︎ 400 (22%)</div>
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
      </div>
      <div class="stat-title">Agendamentos Totais</div>
      <div class="stat-value">{scheduling}</div>
      <div class="stat-desc">↘︎ 90 (14%)</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
      </div>
      <div class="stat-title">Horários Disponiveis</div>
      <div class="stat-value">{hoursOpen}</div>
      <div class="stat-desc">↘︎ 90 (14%)</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
      </div>
      <div class="stat-title">Horários marcados</div>
      <div class="stat-value">{hoursClosed}</div>
      <div class="stat-desc">↘︎ 90 (14%)</div>
    </div>
    
  </div>


  
  <style>
    .stats{
        top:45vh;
    }
  </style>