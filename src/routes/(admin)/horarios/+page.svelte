<script lang="ts">
  import VanillaCalendar from "vanilla-calendar-pro";
  import { onMount } from "svelte";

  import "vanilla-calendar-pro/build/vanilla-calendar.min.css";
  import "vanilla-calendar-pro/build/vanilla-calendar.layout.min.css";
  import type { IOptions } from "vanilla-calendar-pro/types";
  import { goto } from "$app/navigation";

  let token:string;
  let active: boolean;
  let monthDay: number;
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
    //hoursFrontList = [...hoursFrontList, {hour, dayWeek}];

    days.forEach(async (element) => {
      monthDay = element;
      let dateDay = new Date(year, month - 1, element);
      let dayOfWeek = dateDay.getDay();

      if (weekDay === week[dayOfWeek]) {

        active = true;
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
        if(scheduleReturn.schedule.hours){
        if (scheduleReturn.schedule.hours.length) {

          scheduleReturn.schedule.hours.forEach((h) => {

              if (hoursFrontList[dayOfWeek].some((p) => p.hours === h.hours)) {
              } else {

                hoursFrontList[dayOfWeek] = [...hoursFrontList[dayOfWeek], h];
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
    });

    hours = [];
    // console.log(hour);
    hour = "";
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
    let cont = 0;
    week.forEach(async (element) => {
      const res = await fetch(`api/schedule?weekDay=${element}`,{
        headers:{
          'Authorization' : `Bearer ${token}`

        }
      });
      const data = await res.json();
      
      if (data.schedules.length) {
        data.schedules.forEach((e) => {
          e.hours.forEach((h) => {
            if (hoursFrontList[cont].some((p) => p.hours === h.hours)) {
            } else {
              hoursFrontList[cont] = [...hoursFrontList[cont], h];
            }
          });
        });
      }

      cont++;
    });
    console.log(hoursFrontList);
    cont = 0;
  });
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} on:click={() => {updateActive(h)}}/></td>
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} on:click={() => {updateActive(h)}}/></td>
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} /></td>
          </tr>
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} on:click={() => {updateActive(h)}}/></td>
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} on:click={() => {updateActive(h)}}/></td>
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} on:click={() => {updateActive(h)}}/></td>
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
            <td><input type="checkbox" class="toggle" bind:checked={h.active} on:click={() => {updateActive(h)}}/></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="flex relative">
    <button
      class="btn btn-outline btn-accent ml-auto mr-8 mt-8"
      on:click={() => {
        document.getElementById("my_modal_1")?.showModal();
      }}>Adicionar</button
    >
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
        <select
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
        </select>
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
            <td><input type="checkbox" class="toggle" bind:checked={specific.active} on:click={() => {updateActiveSpecific(specific)}}/></td>
          </tr>
        {/each}

        </tbody>
      </table>
    </div>
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
