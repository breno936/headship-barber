<script lang="ts">
  import VanillaCalendar from "vanilla-calendar-pro";
  import { onMount } from "svelte";

  import "vanilla-calendar-pro/build/vanilla-calendar.min.css";
  import "vanilla-calendar-pro/build/vanilla-calendar.layout.min.css";
  import type { IOptions } from "vanilla-calendar-pro/types";
  import { goto } from "$app/navigation";
    import ModalConfirm from "$components/ModalConfirm.svelte";

  let token:string;
  let active: boolean;
  let monthDay: number;
  let idDelete: number;
  let weekDay: String;
  let hours: Array<any> = [];
  let specificDay: Array<any> = [];
  let hoursFrontList: [
    Domingo: Array<any>,
    Segunda: Array<any>,
    Terça: Array<any>,
    Quarta: Array<any>,
    Quinta: Array<any>,
    Sexta: Array<any>,
    Sabado: Array<any>,
  ] = [[], [], [], [], [], [], []];
  let month: number;
  let year: number;

  let hour: any;
  let days: number[] = [];
  let date = new Date();
  const week = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  function getDiasMes() {
    var date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(date.getDate());
      date.setDate(date.getDate() + 1);
    }
  }

  async function recordHours() {
    hours = [...hours, hour];
    days = [];
    // var date = new Date(year, month, day);
    //hoursFrontList = [...hoursFrontList, {hour, dayWeek}];

      let dateDay = new Date(year, month - 1, monthDay);
      let dayOfWeek = dateDay.getDay();

      if (weekDay === week[dayOfWeek]) {

        active = true;
        console.log(hours);
        const res = await fetch("api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json",
          'Authorization' : `Bearer ${token}`

           },
          body: JSON.stringify({
            active,
            month,
            weekDay,
            monthDay,
            hours,
            year,
          }),
        });

        const scheduleReturn = await res.json();
        let currentDate = new Date();
        let currentWeek = getWeekOfMonth(currentDate);

        if(scheduleReturn.schedule.hours){
        if (scheduleReturn.schedule.hours.length) {

          scheduleReturn.schedule.hours.forEach((h) => {

          let dateE = new Date(scheduleReturn.schedule.year, scheduleReturn.schedule.month, scheduleReturn.schedule.monthDay);
          console.log(scheduleReturn, getWeekOfMonth(dateE), currentWeek);
          if(getWeekOfMonth(dateE) == currentWeek){

              if (hoursFrontList[dayOfWeek].some((p) => p.hours === h.hours)) {
              } else {
                
                hoursFrontList[dayOfWeek] = [...hoursFrontList[dayOfWeek], h];
              }
            }
          });
        }
      }else{
        hoursFrontList[dayOfWeek] = [...hoursFrontList[dayOfWeek], hours];
      }
        // hoursFrontList[dayOfWeek] = [
        //   ...hoursFrontList[dayOfWeek],
        //   scheduleReturn.schedule,
        // ];


      }
      // console.log(hoursFrontList);


    hours = [];
    // console.log(hour);
    hour = "";
  }

  function getWeekOfMonth(date) {
    // Obtemos o primeiro dia do mês
    var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
    // Obtém o dia da semana do primeiro dia do mês (0=domingo, 1=segunda-feira, ...)
    var firstDayWeekday = firstDayOfMonth.getDay();
    
    // Obtém o dia do mês da data fornecida
    var dayOfMonth = date.getDate();
    
    // Calcula o número da semana
    var weekNumber = Math.ceil((dayOfMonth + firstDayWeekday) / 7);
    
    return weekNumber;
}

  async function updateActive(hour:any) {

    let active = !hour.active;
    let hours = hour.hours;
    let id = hour.id;
    let scheduleId = hour.scheduleId;
    let specific = false;

    const res = await fetch("api/hours", {
          method: "PUT",
          headers: { "Content-Type": "application/json",
          'Authorization' : `Bearer ${token}`

           },
          body: JSON.stringify({
            active,
            hours,
            id,
            scheduleId,
            specific
          }),
        });  

      }

    async function updateActiveSpecific(hour:any) {

      let active = !hour.active;
      let hours = hour.hours;
      let id = hour.id;
      let scheduleId = hour.scheduleId;
      let specific = true;
      const res = await fetch("api/hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },
      body: JSON.stringify({
        active,
        hours,
        id,
        scheduleId,
        specific
      }),
    });  

  }

  const options: IOptions = {
    actions: {
      async clickDay(event, self) {
        let date = new Date(self.selectedDates[0]);
        let correctDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        specificDay = [];
        let weekIndex = date.getDay()
        if(weekIndex < 6){
        weekDay = week[weekIndex + 1];
        }else{
          weekDay = week[0];

        }
        monthDay = correctDate.getDate();
      const res = await fetch(`api/schedule?monthDay=${correctDate.getDate()}`,{
        headers:{
          'Authorization' : `Bearer ${token}`

        }
      });
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

  onMount(async () => {
    token = localStorage.getItem("token");

const resToken = await fetch("api/tokenAuth", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },

    });
  
if(resToken.status == 401){
  goto("/login");
}


    month = date.getMonth() + 1;
    year = date.getFullYear();
    getDiasMes();

    const calendar = new VanillaCalendar("#calendar", options);
    calendar.init();

    // Carregar produtos quando a página é carregada
    let cont = "";
    let currentDate = new Date();
    let currentWeek = getWeekOfMonth(currentDate);
    week.forEach(async (element) => {
      console.log(element);
      const res = await fetch(`api/schedule?weekDay=${element}`,{
        headers:{
          'Authorization' : `Bearer ${token}`

        }
      });
      const data = await res.json();

      console.log(data.schedules);
      if (data.schedules.length) {

        data.schedules.forEach((e) => {
          let dateE = new Date(e.year, e.month, e.monthDay);
          console.log(e, currentWeek, getWeekOfMonth(dateE));
          if(getWeekOfMonth(dateE) == currentWeek){
            e.hours.forEach((h) => {

            if(e.weekDay == "Domingo"){
              if (hoursFrontList[0].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[0] = [...hoursFrontList[0], h];
            }
            }

            if(e.weekDay == "Segunda"){
              if (hoursFrontList[1].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[1] = [...hoursFrontList[1], h];
            }
            }

            if(e.weekDay == "Terça"){
              if (hoursFrontList[2].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[2] = [...hoursFrontList[2], h];
            }
            }

            if(e.weekDay == "Quarta"){
              if (hoursFrontList[3].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[3] = [...hoursFrontList[3], h];
            }
            }

            if(e.weekDay == "Quinta"){
              if (hoursFrontList[4].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[4] = [...hoursFrontList[4], h];
            }
            }

            if(e.weekDay == "Sexta"){
              if (hoursFrontList[5].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[5] = [...hoursFrontList[5], h];
            }
            }

            if(e.weekDay == "Sábado"){
              if (hoursFrontList[6].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[6] = [...hoursFrontList[6], h];
            }
            }
         
          });
          }
     
        });
      }

      //cont++;
    });
    console.log(hoursFrontList);
  });

  async function deleteProduct() {
    const res = await fetch('api/hours', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`

       },
      body: JSON.stringify({ id:idDelete })
    });

    if (res.ok) {
        console.log("aaa");
        for (let index = 0; index < hoursFrontList.length; index++) {
          hoursFrontList = {...hoursFrontList, [index]: hoursFrontList[index].filter(hour => hour.id !== idDelete)}
          
        }

    }
  }
</script>

<div class="overflow-y-scroll h-screen">
  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Segunda</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[1] as h (h)}
          <tr>
            <td>{h.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>
                    </tr>
        {/each}
        <!-- <tr><td>Aquaman</td></tr>
          <tr><td>Asterix</td></tr>
          <tr><td>The Atom</td></tr>
          <tr><td>The Avengers</td></tr> -->
      </tbody>
    </table>
  </div>

  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Terça</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[2] as h (h)}
          <tr>
            <td>{h.hours}</td>

            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>
                    </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Quarta</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[3] as h (h)}
          <tr>
            <td>{h.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Quinta</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[4] as h (h)}
          <tr>
            <td>{h.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>
                    </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Sexta</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[5] as h (h)}
          <tr>
            <td>{h.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>
                    </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Sábado</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[6] as h (h)}
          <tr>
            <td>{h.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>
                    </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="">
    <table class="table table-pin-rows">
      <thead>
        <tr>
          <th class="font-black text-[23px]">Horários Domingo</th>
        </tr>
      </thead>
      <tbody>
        {#each hoursFrontList[0] as h (h)}
          <tr>
            <td>{h.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="flex relative">

  </div>

  <dialog id="my_modal_1" class="modal">
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
      <form on:submit={recordHours}>
        <input bind:value={hour} type="time" /><br />
        <!-- <select
          bind:value={weekDay}
          class="select select-bordered w-full max-w-xs"
        >
          <option disabled selected>Selecione o dia</option>
          <option value="Segunda">Segunda</option>
          <option value="Terça">Terça</option>
          <option value="Quarta">Quarta</option>
          <option value="Quinta">Quinta</option>
          <option value="Sexta">Sexta</option>
          <option value="Sábado">Sábado</option>
          <option value="Domingo">Domingo</option>
        </select> -->
        <button class="btn btn-success w-full max-w-xs mt-8" type="submit"
          >Adicionar</button
        >
      </form>
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8"
          >Cancelar</button
        >
      </form>
    </div>
  </dialog>



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
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
        {#each specificDay as specific (specific.id) }
          <tr>
            <td></td>
            <td>{specific.hours}</td>
            <td><button on:click={() =>{
              idDelete = h.id;
              document.getElementById('my_modal_confirm')?.showModal()}}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>    
            </td>          </tr>
        {/each}

        </tbody>
      </table>
    </div>
    <button
    class="btn btn-outline btn-accent ml-auto mr-8 mt-8"
    on:click={() => {
      document.getElementById("my_modal_1")?.showModal();
    }}>Adicionar</button
  >
    <form method="dialog">
      <!-- if there is a button in form, it will close the modal -->
      <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8"
        >Cancelar</button
      >
    </form>
  </div>
</dialog>


  <div class="w-full h-[600px] text-center pt-10 mt-8">
    <h1 class="font-bold text-[44px]">HORÁRIOS</h1>
    <div id="calendar" class="ml-auto mr-auto"></div>
  </div>
</div>


<ModalConfirm message="excluir" metodo={deleteProduct}/>
<style>
  h1 {
    font-family: Urban Heroes;
  }
  #calendar {
    height: 80%;
    width: 50%;
  }
  .vanilla-calendar-day {
    height: 600px !important;
  }
</style>
