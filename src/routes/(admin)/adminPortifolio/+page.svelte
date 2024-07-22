<script lang="ts">
  import ModalConfirm from "$components/ModalConfirm.svelte";
  import type { Portifolio } from "@prisma/client";
  import type { Decimal } from "@prisma/client/runtime/library";
  import { onMount } from "svelte";

  let portifolio: Portifolio[] = [];
  let token:string;

  onMount(async () => {
    token = localStorage.getItem("token");

    // Carregar produtos quando a página é carregada
    const res = await fetch("api/portifolio", {
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });
    const data = await res.json();
    portifolio = data.portifolio;
  });

  let picture:any = null;
  let link = "";
  let id: any = null;
  let message:String = "";
  let metodoModal:any;

  async function createPortifolio(event:any) {

    event.preventDefault();
    const formData = new FormData();
    formData.append('link', link);
    formData.append('picture', picture);

      const res = await fetch('/api/portifolio', {
      method: 'POST',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });

    if (res.ok) {
      const newPortifolio = await res.json();
      portifolio = [...portifolio, newPortifolio.portifolio];
      document.getElementById("buttonClose")?.click();
      picture = null;
      link = "";
    }
  }

  async function editPortifolio(event:any) {

    event.preventDefault();
    const formData = new FormData();
    formData.append('link', link);
    formData.append('picture', picture);
    formData.append('id', id);

 
    const res = await fetch('/api/portifolio', {
      method: 'PUT',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });
    if (res.ok) {
      const updatedPortifolio = await res.json();
      portifolio = portifolio.map((p) =>
        p.id === updatedPortifolio.portifolio.id
          ? updatedPortifolio.portifolio
          : p
      );
      document.getElementById("buttonClose")?.click();
      picture = "";
      link = "";
      id = null;
    }
  }

  async function deletePortifolio() {
    const res = await fetch("api/portifolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      portifolio = portifolio.filter((p) => p.id !== id);
    }
  }

  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      picture = input.files[0];
      console.log(picture);
    }
  }

</script>
<div class="overflow-y-scroll h-screen">

<div class="flex relative">
    <button class="btn btn-outline btn-accent ml-auto mr-8 mt-8" on:click={() => {document.getElementById('my_modal_1')?.showModal();
        message = "Novo";
        metodoModal = createPortifolio;
    }}>Adicionar</button>
    </div>

    <dialog id="my_modal_1" class="modal">
        <div class="modal-box text-center pt-8">
          <div class="modal-action absolute block top-0 right-5">
              <form method="dialog">
                  <button id="buttonClose" class="btn btn-circle btn-outline min-h-0 h-6 w-6">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
              </form>
            </div>
          <h3 class="font-bold text-3xl mb-10">{message} Produto</h3>
          <form class="w-fit" on:submit={metodoModal}>
              <input type="file" on:change={handleFileChange} class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
              <input type="text" bind:value={link} placeholder="Nome" class="input input-bordered w-full max-w-xs mt-4" />
              <button class="btn btn-success w-full max-w-xs mt-8" type="submit">Cadastrar</button>
      
          </form>
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8">Cancelar</button>
              </form>
         
        </div>
      </dialog>

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th> </th>
        <th>Foto</th>
        <th>Link</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      {#if portifolio}
        {#each portifolio as p (p.id)}
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" />
              </label>
            </th>

            <td>
              <div class="flex items-center gap-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img
                      src="{p.picture}"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
              </div>
            </td>

            <td>{p.link}</td>
            <!--Edit Button-->
            <td
              ><button
                class="btn btn-square"
                on:click={() => {
                  document.getElementById("my_modal_1")?.showModal();
                  message = "Editar";
                  metodoModal = editPortifolio;
                  id = p.id;
                  link = p.link;
                  picture = p.picture;
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 512 512"
                  ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                    d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                  /></svg
                >
              </button></td
            >

            <!--Delete Button-->
            <td>
              <button
                class="btn btn-square btn-error"
                on:click={() => {
                  id = p.id;
                  document.getElementById("my_modal_confirm")?.showModal();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  viewBox="0 0 448 512"
                  ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                    d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                  /></svg
                >
              </button></td
            >
          </tr>
        {/each}
      {/if}

      <!-- row 2 -->

      <!-- foot -->
    </tbody><tfoot>
      <tr>
        <th></th>
        <th>Foto</th>
        <th>Link</th>
      </tr>
    </tfoot>
  </table>
</div>
 <!--Delete Modal-->
 <ModalConfirm message="Excluir" metodo={deletePortifolio}/>
 </div>