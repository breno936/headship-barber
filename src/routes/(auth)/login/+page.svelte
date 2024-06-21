<script lang="ts">
  import { goto } from '$app/navigation';


  let username:string;
  let password:string;
  async function logar(){

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);


    const res = await fetch('/api/login', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(res);
    if(res.status == 200){
      localStorage.setItem("token", data.user)
      goto("/dashboard");
    }
  }
   
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col w-1/2 lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Login!</h1>
        <p class="py-6">Logue-se para acessar o painel de administração</p>
      </div>
      <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form class="card-body" on:submit={logar}>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Username</span>
            </label>
            <input bind:value={username} type="text" placeholder="email" class="input input-bordered" required />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input bind:value={password} type="password" placeholder="password" class="input input-bordered" required />
            <label class="label">
              <!--<a href="#" class="label-text-alt link link-hover">Forgot password?</a>-->
            </label>
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>