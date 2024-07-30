<script lang="ts">
  import { goto } from '$app/navigation';
  import ModalConfirm from '$components/ModalConfirm.svelte';
   import type { SlideHome } from '@prisma/client';
   import type { PortifolioHome } from '@prisma/client';
   import type { ProductsHome } from '@prisma/client';
   import type { Decimal } from '@prisma/client/runtime/library';
   import { onMount } from 'svelte';


let slideHome: SlideHome[] = [];
let portifolioHome: PortifolioHome[] = [];
let productsHome: ProductsHome[] = [];
let id: number | null = null;
let metodoModal:any = null;
let metodoDelete:any = null;
let message:String = "";
let token:string;

  onMount(async () => {
    token = localStorage.getItem("token");

    const resToken = await fetch("api/tokenAuth", {
          method: "POST",
          headers: { "Content-Type": "application/json",
          'Authorization' : `Bearer ${token}`

           },
          
        });
      
    if(resToken.status == 401){
      console.log("a");
      goto("/login");
    }

    // Carregar produtos quando a página é carregada
    const resSlide = await fetch('api/slideHome',{
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });
    const dataSlide = await resSlide.json();
    slideHome = dataSlide.slides;

    const resPortifolio = await fetch('api/portifolioHome', {
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });
    const dataPortifolio = await resPortifolio.json();
    portifolioHome = dataPortifolio.portifolio;

    const resProducts = await fetch('api/productsHome', {
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });
    const dataProducts = await resProducts.json();
    productsHome = dataProducts.products;
  });

  let name = '';
  let description = '';
  let price:any;
  let picture = '';

  let title = '';
  let linkButton = '';
  let textButton = '';
  let subTitle = '';

  let link = '';

  async function createSlide(event:any) {

    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('picture', picture);
    formData.append('linkButton', linkButton);
    formData.append('textButton', textButton);
    formData.append('subTitle', subTitle);

    const res = await fetch('/api/slideHome', {
      method: 'POST',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });

    if (res.ok) {
      const newSlide = await res.json();
      slideHome = [...slideHome, newSlide.slides];
      document.getElementById("buttonClose")?.click();
      name = '';
      description = '';
      price = 0.0;
      picture = '';

      title = '';
      linkButton = '';
      textButton = '';
      subTitle = '';

      link = '';
    }
  }

  async function editSlide(event:any) {

    event.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('picture', picture);
    formData.append('linkButton', linkButton);
    formData.append('textButton', textButton);
    formData.append('subTitle', subTitle);

   const res = await fetch('/api/slideHome', {
      method: 'PUT',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });

    if (res.ok) {
        const updatedSlide = await res.json();
        slideHome = slideHome.map(s => s.id === updatedSlide.slides.id ? updatedSlide.slides : s);
        document.getElementById("buttonClose")?.click();

        name = '';
      description = '';
      price = 0.0;
      picture = '';

      title = '';
      linkButton = '';
      textButton = '';
      subTitle = '';

      link = '';
    }
  }

  async function deleteSlide() {
    const res = await fetch('api/slideHome', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`

       },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
        console.log("aaa");
        slideHome = slideHome.filter(s => s.id !== id)

    }
  }

  async function createProduct(event:any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('picture', picture);


    const res = await fetch('/api/productsHome', {
      method: 'POST',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });

    if (res.ok) {
      const newProduct = await res.json();
      productsHome = [...productsHome, newProduct.product];
      document.getElementById("buttonClose")?.click();

      name = '';
      description = '';
      price = 0.0;
      picture = '';

      title = '';
      linkButton = '';
      textButton = '';
      subTitle = '';

      link = '';
    }
  }

  async function editProduct(event:any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('picture', picture);

    const res = await fetch('/api/productsHome', {
      method: 'PUT',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });


    if (res.ok) {
        const updatedProduct = await res.json();
        productsHome = productsHome.map(product => product.id === updatedProduct.product.id ? updatedProduct.product : product);
        document.getElementById("buttonClose")?.click();

        name = '';
      description = '';
      price = 0.0;
      picture = '';

      title = '';
      linkButton = '';
      textButton = '';
      subTitle = '';

      link = '';
    }
  }

  async function deleteProduct() {
    const res = await fetch('api/productsHome', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`

       },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
        console.log("aaa");
        productsHome = productsHome.filter(product => product.id !== id)

    }
  }

  async function createPortifolio(event:any) {

    event.preventDefault();
    const formData = new FormData();
    formData.append('link', link);
    formData.append('picture', picture);

   
    const res = await fetch('/api/portifolioHome', {
      method: 'POST',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });

    if (res.ok) {
      const newPortifolio = await res.json();
      portifolioHome = [...portifolioHome, newPortifolio.portifolio];
      document.getElementById("buttonClose")?.click();

      name = '';
      description = '';
      price = 0.0;
      picture = '';

      title = '';
      linkButton = '';
      textButton = '';
      subTitle = '';

      link = '';
    }
  }
  async function editPortifolio(event:any) {

    event.preventDefault();
    const formData = new FormData();
    formData.append('id', id);
    formData.append('link', link);
    formData.append('picture', picture);

     const res = await fetch('/api/portifolioHome', {
      method: 'PUT',
      body: formData,
      headers:{
        'Authorization' : `Bearer ${token}`

      }
    });

    if (res.ok) {
      const updatedPortifolio = await res.json();
      portifolioHome = portifolioHome.map((p) =>
        p.id === updatedPortifolio.portifolio.id
          ? updatedPortifolio.portifolio
          : p
      );
      document.getElementById("buttonClose")?.click();

      name = '';
      description = '';
      price = 0.0;
      picture = '';

      title = '';
      linkButton = '';
      textButton = '';
      subTitle = '';

      link = '';
    }
  }

  async function deletePortifolio() {
    const res = await fetch("api/portifolioHome", {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      portifolioHome = portifolioHome.filter((p) => p.id !== id);
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
      metodoModal = createSlide;
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
      <h3 class="font-bold text-3xl mb-10">{message} Slide</h3>
      <form class="w-fit" on:submit={metodoModal}>
        <input type="file" on:change={handleFileChange} class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
        <input type="text" bind:value={title} placeholder="Título" class="input input-bordered w-full max-w-xs mt-4" />
        <input type="text" bind:value={subTitle} placeholder="Sub Título" step="0.01" class="input input-bordered w-full max-w-xs mt-4" />
        <input type="text" bind:value={linkButton} placeholder="Link Botão" step="0.01" class="input input-bordered w-full max-w-xs mt-4" />
        <input type="text" bind:value={textButton} placeholder="Texto Botão" class="input input-bordered w-full max-w-xs mt-4" />
          <button class="btn btn-success w-full max-w-xs mt-8" type="submit">Cadastrar</button>
  
      </form>
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8">Cancelar</button>
          </form>
     
    </div>
  </dialog>

<h3 class="w-fit ml-auto mr-auto relative block font-bold text-[36px]">Slides</h3>

<div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>
          
          </th>
      

          <th>Foto</th>
          <th>Título</th>
          <th>Sub Título</th>
          <th>Texto do Botão</th>
          <th>Link do Botão</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
         {#if slideHome}
         {#each slideHome as slide (slide.id)}
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
                     <img src="{slide.picture}" alt="Avatar Tailwind CSS Component" />
                   </div>
                 </div>
                
               </div>
             </td>
             <td>
               {slide.title}
               <br/>
             </td>
             <td>{slide.subTitle}</td>
             <td>{slide.textButton}</td>
             <td>{slide.linkButton}</td>
                       <!--Edit Button-->
                       <td><button class="btn btn-square" on:click={() => {document.getElementById('my_modal_1')?.showModal();
                        message = "Editar";
                        metodoModal = editSlide;
                        id = slide.id;
                        title = slide.title;
                        subTitle = slide.subTitle;
                        textButton = slide.textButton;
                        linkButton = slide.linkButton;
                        picture = slide.picture;
                    }}>
                        
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>             
                     </button></td>
        
                      <!--Delete Button-->
                     <td>
                    <button class="btn btn-square btn-error" on:click={() =>{
                        id = slide.id;
                        metodoDelete = deleteSlide;
                        document.getElementById('my_modal_confirm')?.showModal()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>        
                          </button></td>
             
           </tr>
         {/each}
         {/if}

        
        <!-- row 2 -->
        
      <!-- foot -->
      <tfoot>
        <tr>
          <th></th>
          <th>Foto</th>
          <th>Título</th>
          <th>Sub Título</th>
          <th>Texto do Botão</th>
          <th>Link do Botão</th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
      
    </table>
  </div>

  <div class="flex relative">
    <button class="btn btn-outline btn-accent ml-auto mr-8 mt-8" on:click={() => {document.getElementById('my_modal_2')?.showModal();
        message = "Editar";
        metodoModal = createProduct;
    }}>Adicionar</button>
    </div>

    <dialog id="my_modal_2" class="modal">
      <div class="modal-box text-center pt-8">
        <div class="modal-action absolute block top-0 right-5">
            <form method="dialog">
                <button class="btn btn-circle btn-outline min-h-0 h-6 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
            </form>
          </div>
        <h3 class="font-bold text-3xl mb-10">{message} Slide</h3>
        <form class="w-fit" on:submit={metodoModal}>
            <input type="file" on:change={handleFileChange} class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
            <input type="text" bind:value={name} placeholder="Nome" class="input input-bordered w-full max-w-xs mt-4" />
            <input type="number" bind:value={price} placeholder="Preço" step="0.01" class="input input-bordered w-full max-w-xs mt-4" />
            <input type="text" bind:value={description} placeholder="Descrição" class="input input-bordered w-full max-w-xs mt-4" />
            <button class="btn btn-success w-full max-w-xs mt-8" type="submit">Cadastrar</button>
    
        </form>
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8">Cancelar</button>
            </form>
       
      </div>
    </dialog>

  <h3 class="w-fit ml-auto mr-auto relative block font-bold text-[36px] mt-14">Produtos</h3>


  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>
          
          </th>
          <th>Foto</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Descrição</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
         {#if productsHome}
         {#each productsHome as product (product.id)}
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
                     <img src="{product.picture}" alt="Avatar Tailwind CSS Component" />
                   </div>
                 </div>
                
               </div>
             </td>
             <td>
               {product.name}
               <br/>
             </td>
             <td>
              {product.price}
             </td>
             <td>{product.price}</td>
                         <!--Edit Button-->
                         <td><button class="btn btn-square" on:click={() => {document.getElementById('my_modal_2')?.showModal();
                          message = "Editar";
                          metodoModal = editProduct;
                          id = product.id;
                          name = product.name;
                          picture = product.picture;
                          description = product.description;
                          price = product.price;
                      }}>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>             
                       </button></td>
          
                        <!--Delete Button-->
                       <td>
                      <button class="btn btn-square btn-error" on:click={() =>{
                          id = product.id;
                          metodoDelete = deleteProduct;
                          document.getElementById('my_modal_confirm')?.showModal()}}>
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>        
                            </button></td>
             
           </tr>
         {/each}
         {/if}

        
        <!-- row 2 -->
        
      <!-- foot -->
      <tfoot>
        <tr>
          <th></th>
          <th>Foto</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Descrição</th>
        </tr>
      </tfoot>
      
    </table>
  </div>

  <div class="flex relative">
    <button class="btn btn-outline btn-accent ml-auto mr-8 mt-8" on:click={() => {document.getElementById('my_modal_3')?.showModal();
        message = "Novo";
        metodoModal = createPortifolio;
    }}>Adicionar</button>
    </div>

    <dialog id="my_modal_3" class="modal">
      <div class="modal-box text-center pt-8">
        <div class="modal-action absolute block top-0 right-5">
            <form method="dialog">
                <button class="btn btn-circle btn-outline min-h-0 h-6 w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
            </form>
          </div>
        <h3 class="font-bold text-3xl mb-10">{message} Portifolio</h3>
        <form class="w-fit" on:submit={metodoModal}>
          <input type="file" on:change={handleFileChange} class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
          <input type="text" bind:value={link} placeholder="Link" class="input input-bordered w-full max-w-xs mt-4" />
            <button class="btn btn-success w-full max-w-xs mt-8" type="submit">Cadastrar</button>
    
        </form>
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8">Cancelar</button>
            </form>
       
      </div>
    </dialog>

<h3 class="w-fit ml-auto mr-auto relative block font-bold text-[36px] mt-14">Portifólio</h3>

  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>
          
          </th>
          <th>Foto</th>
          <th>Link</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
         {#if portifolioHome}
         {#each portifolioHome as portifolio (portifolio.id)}
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
                     <img src="{portifolio.picture}" alt="Avatar Tailwind CSS Component" />
                   </div>
                 </div>
                
               </div>
             </td>
             <td>
               {portifolio.link}
               <br/>
             </td>
                         <!--Edit Button-->
                         <td><button class="btn btn-square" on:click={() => {document.getElementById('my_modal_3')?.showModal();
                          message = "Editar";
                          metodoModal = editPortifolio;
                          id = portifolio.id;
                          link = portifolio.link
                          price = portifolio.price;
                      }}>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>             
                       </button></td>
          
                        <!--Delete Button-->
                       <td>
                      <button class="btn btn-square btn-error" on:click={() =>{
                          id = portifolio.id;
                          metodoDelete = deletePortifolio;
                          document.getElementById('my_modal_confirm')?.showModal()}}>
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>        
                            </button></td>
    
             
           </tr>
         {/each}
         {/if}

        
        <!-- row 2 -->
        
      <!-- foot -->
      <tfoot>
        <tr>
          <th></th>
          <th>Foto</th>
          <th>Link</th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
      
    </table>
  </div>

       <!--Delete Modal-->
       <ModalConfirm message="Excluir" metodo={metodoDelete}/>
</div>