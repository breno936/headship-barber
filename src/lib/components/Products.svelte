
<script lang="ts">
    import { onMount } from "svelte";
    import { cartProducts } from "../../store";
  
    let products:Array<any> = [];
    let productsWithQuantity:Array<any> = [];
    onMount(async () => {
  
      // Carregar produtos quando a página é carregada
      const resProduct = await fetch('api/productsHome');
      const dataProduct = await resProduct.json();
      products = dataProduct.products;
      productsWithQuantity = products.map(pro =>({
        ...pro,
        quantity:0
      }))

      let listaLocalStorage = localStorage.getItem("cartProducts");

      if(listaLocalStorage){
      $cartProducts = JSON.parse(listaLocalStorage);
      }
    });
  
  function addProduct(prod:any){
    const productExists = $cartProducts.some(product => product.id === prod.id);

    if(productExists){

    $cartProducts = $cartProducts.map(product => {
    if (product.id === prod.id) {
      return { ...product, quantity: product.quantity + prod.quantity };
    } else {
      return product;
    }
  });
    }else{
    $cartProducts = [...$cartProducts, prod];
    }
    
    localStorage.setItem("cartProducts", JSON.stringify($cartProducts));
  }
  
  </script>

<div class="flex py-32 lg:h-[600px] flex-col items-center md:items-start md:flex-row justify-center overflow-hidden flex-wrap">
    {#each productsWithQuantity as product (product.id)}
    <div class="w-5/6 sm:w-3/6 md:w-2/6 lg:w-1/6 h-fit mt-6 lg:mt-0 md:ml-6 cardProduct rounded-md overflow-hidden">
        <div class="w-full h-[150px]">
            <img src="{product.picture}" class="w-full h-full"/>
        </div>
        <div class="description h-[200px] p-4 w-full transition-all">
            <h1 class="mb-2 text-xl font-bold">{product.name}</h1>

            <p class="mb-2 text-sm">{product.description}</p>
            

            <h2 class="text-xl font-medium text-[#183A5D]">R${product.price}</h2>

        </div>
        <div class="h-0 block relative buttonAdd transition-all text-center">
            {#if product.quantity > 0}
            {product.quantity}
    
            {/if}            <div class="w-full px-2 flex justify-center items-center h-fit relative" style="bottom:-20px;">
                <a on:click={() => {product.quantity--}} class="rounded-full p-2 cursor-pointer mr-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg></a>
                <button on:click={() => addProduct(product)} class="py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block relative">ADICIONAR</button>
                <a on:click={() => {product.quantity++}} class="rounded-full p-2 cursor-pointer ml-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg></a>
        </div>
          </div>
    </div>
    {/each}
</div>

<a href="/shop"><button class="mb-16 ml-auto mr-auto block w-fit h-fit py-2 px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all">VER MAIS</button></a>


<style>
    .description::before{
        content:'';
        position: absolute;
        height: 18%;
        width: 1px;
        background-color: #183A5D;
        margin-left: -6px;
        
    }
    .description{
        overflow: hidden;
    }
    .cardProduct{
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.415);
    }
    .cardProduct:hover .buttonAdd{
        height: 100px;
    }
    button:hover{
    background-color: #183A5D;
    color:white;
    border-color: #183A5D;
  }
  .buttonAdd div a:hover{
    border:1px solid black;
  }
</style>