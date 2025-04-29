async function runProcess() {
  const { default: remoteMountMethod } = await import(
    'remote/mountMyDesignArea'
  );
  // const { default: remoteMountMethod } = await import(
  //   'remote_bucket/mountMyDesignArea'
  // );

  console.log('test check check');

  const rootElement = document.getElementById('react-root');
  const accessToken = window.anonToken;
  const customerId = '12345';
  remoteMountMethod(rootElement, {
    customerId,
    token: accessToken,
  });
}

runProcess();
