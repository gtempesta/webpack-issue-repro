async function runProcess() {
  const { default: designAreaModule } = await import(
    'remote/mountMyDesignArea'
  );
  // const { default: designAreaModule } = await import('remote_bucket/mountMyDesignArea');
  // extract mount method and eventBus from the remote module
  const { default: remoteMountMethod } = designAreaModule;

  console.log('xxeeeex 23');

  const rootElement = document.getElementById('react-root');
  const accessToken = window.anonToken;
  const customerId = '12345';
  remoteMountMethod(rootElement, {
    customerId,
    token: accessToken,
  });
}

runProcess();
