importScripts('https://unpkg.com/comlink/dist/umd/comlink.js');

let api = null;

Comlink.expose({
  init(port) {
    api = Comlink.wrap(port);
  }
});

function waitForApi() {
  function waitFor(result) {
    if (result) {
      return result;
    }
    return new Promise((resolve) => setTimeout(resolve, 50))
      .then(() => Promise.resolve(api))
      .then((res) => waitFor(res));
  }
  return waitFor();
}

(async () => {
  await waitForApi();
  for (path of ['./app.js']) {
    const resp = await fetch(path);
    const bundle = await resp.text();
    // app type
    const publicApi = await api.requestPublicApi({ type: 'addons', env: 'worker' })

    const factory = new Function('publicApi', bundle);
    factory(publicApi);
  }
})();
