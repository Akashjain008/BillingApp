// src/index.ts

import { handleRequest } from './api';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
