import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

let api = null;

class IframeApi {
  init(port) {
    api = Comlink.wrap(port);
  }
}

Comlink.expose(new IframeApi());

function waitForApi() {
  let counter = 0;
  function waitFor(result) {
    if (result) {
      return result;
    }
    return new Promise((resolve) => setTimeout(resolve, 50))
      .then(() => {
        if (counter < 50) {
          return Promise.resolve(api)
        } else {
          return Promise.reject('timeout')
        }
      })
      .then((res) => waitFor(res));
  }
  return waitFor();
}

(async () => {
  await waitForApi();
  const publicApi = await api.requestPublicApi({ type: 'addons', env: 'iframe' })
  console.log('calling in iframe', await publicApi.method('iframe call'));
})()
