import { writable } from 'svelte/store';

export const cartProducts = writable<any[]>([]);