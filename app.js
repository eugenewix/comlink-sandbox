// same as
// import shape from 'sdk'
async function shape() {
  console.log('[APP 1]', await publicApi.method('param1'));
}

// 3rd party code
console.log('app code 1')
shape();
