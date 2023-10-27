import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

const privateApi = {
  // @Env(['worker', 'panel'])
  // @AppType(['addon'])
  method: async (param) => {
    return 'Return private API: ' + JSON.stringify(param);
  }
}

const createPublicApi = (privateApi, config) => {
  return privateApi
}

const api = {
  requestPublicApi({ type, env }) {
    return Comlink.proxy(createPublicApi(privateApi, { type, env }));
  }
}

async function initWorker() {
  const { port1, port2 } = new MessageChannel();
  Comlink.expose(api, port1);

  const worker = new Worker("./worker.js");
  const workerApi = Comlink.wrap(worker);
  await workerApi.init(Comlink.transfer(port2, [port2]));
}

async function initIframe() {
  const { port1, port2 } = new MessageChannel();

  Comlink.expose(api, port1);

  const iframe = document.getElementById('frame');
  if (iframe.contentDocument.readyState !== 'complete') {
    await new Promise((resolve) => (iframe.onload = resolve));
  }
  const f = Comlink.wrap(Comlink.windowEndpoint(iframe.contentWindow));
  await f.init(Comlink.transfer(port2, [port2]));
}

async function init() {
  await initWorker();
  await initIframe();
}
init();
