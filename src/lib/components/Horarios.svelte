<script lang="ts">
import VanillaCalendar from 'vanilla-calendar-pro';
import { onMount } from "svelte";

import 'vanilla-calendar-pro/build/vanilla-calendar.min.css';
import 'vanilla-calendar-pro/build/vanilla-calendar.layout.min.css';
import type { IOptions } from 'vanilla-calendar-pro/types';

let specificDay: Array<any> = [];
let clientNumber:string;
let hourId:number | null;


const options: IOptions = {
    actions: {
      async clickDay(event, self) {
        let date = new Date(self.selectedDates[0]);
        let correctDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        specificDay = [];

        while (!correctDate.getDate()) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Aguarda 100ms antes de verificar novamente
        }

      const res = await fetch(`api/schedule?monthDay=${correctDate.getDate()}`);
      const data = await res.json();
      if (data.schedules) {
        data.schedules.forEach((e) => {
          e.hours.forEach((h) => {
            specificDay = [...specificDay, h]
          });
        });
      }
      document.getElementById("my_modal_2")?.showModal();

      },
    },
    CSSClasses: {
      day: "vanilla-calendar-day",
    },
    settings: {
      visibility: {
        theme: "dark",
      },
      selection: {
        month: false,
        year: false,
      },
    },
  };

  function formatPhoneNumber(value:any) {
  // Remove tudo que não for dígito
  const phoneNumber = value.replace(/[^\d]/g, '');

  const phoneNumberLength = phoneNumber.length;

  // Adiciona parênteses e hífens conforme o usuário digita
  if (phoneNumberLength <= 2) {
    return `(${phoneNumber}`;
  } else if (phoneNumberLength <= 6) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  } else if (phoneNumberLength <= 10) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6)}`;
  } else {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  }
}

function handleInput(event:any) {
    const input = event.target;
    const formattedPhoneNumber = formatPhoneNumber(input.value);
    input.value = formattedPhoneNumber;
    clientNumber = formattedPhoneNumber;
  }

  async function agendar(){
    clientNumber = clientNumber.replace(/\D/g, ''); 
    
    const params = new URLSearchParams({
      hourId: hourId.toString(),
  }).toString();

    const message = await fetch("api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to:clientNumber,
            message:`link de cancelamento: https://headship-barber.vercel.app/api/scheduling?${params}`,
          }),
        });
        let a = await message.json();
        console.log(a);

        const res = await fetch("api/scheduling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientNumber,
            hourId,
          }),
        });
        const data = await res.json();
        clientNumber = "";      
        hourId = null;  
        console.log(res);
  }

onMount(() => {
    const calendar = new VanillaCalendar('#calendar', options);
    calendar.init();
});

</script>

<a id="agenda"></a>
<div class="w-full h-[600px] text-center pt-10 mt-8">

    <h1 class="font-bold text-[44px]">HORÁRIOS</h1>
    <div id="calendar" class="ml-auto mr-auto"></div>

</div>

<!--MODAL SPECIFIC DAYS-->
<dialog id="my_modal_2" class="modal">
    <div class="modal-box text-center pt-8">
      <div class="modal-action absolute block top-0 right-5">
        <form method="dialog">
          <button class="btn btn-circle btn-outline min-h-0 h-6 w-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              /></svg
            >
          </button>
        </form>
      </div>
      <h3 class="font-bold text-3xl mb-10">Novo horário</h3>
      <div class="overflow-y-auto">


        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Dia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
          {#each specificDay as specific (specific.id) }
            <tr>
              <td></td>
              <td>{specific.hours}</td>
              <td><button class="btn btn-outline btn-primary h-4" on:click={() => hourId = specific.id} disabled={!specific.active}>Agendar</button>
              </td>
            </tr>
          {/each}
  
          </tbody>
        </table>
        <form on:submit={agendar}>
       
        <input type="text" placeholder="Telefone" on:input={handleInput} bind:value={clientNumber} class="input input-bordered w-full max-w-xs mt-12" /><br/><br/>
        {#if hourId != null}
        <button class="btn btn-success max-w-xs w-full" type="submit">Confirmar</button>

        {/if}
        </form>
      </div>
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8"
          >Cancelar</button
        >
      </form>
    </div>
  </dialog>
<style>
    h1{
        font-family: Urban Heroes;
    }
    #calendar{
        height: 80%;
        width: 90%;
    }
    #calendar .vanilla-calendar-day{
        height: 600px!important;
    }
    @media(min-width:768px){
      #calendar{
        width: 50%;
      }
    }
</style>