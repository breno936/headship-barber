<script lang="ts">
    export let message = "";
    export let metodo = null;
</script>

<dialog id="my_modal_confirm" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Tem certeza que deseja {message} este item?</h3>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" on:click={metodo}>Confirmar</button>
        </form>
        <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Cancelar</button>
          </form>
      </div>
    </div>
  </dialog>