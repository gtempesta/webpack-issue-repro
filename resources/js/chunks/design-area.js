async function runProcess() {
  const { default: remoteMountMethod } = await import(
    'remote_bucket/remoteMountMethod'
  );
  const rootElement = document.getElementById('react-root');
  const accessToken = window.anonToken;
  const customerId = '12345';
  remoteMountMethod(rootElement, {
    customerId,
    token: accessToken,
  });
  console.log("Design area module updated at", new Date().toISOString());

}

runProcess();
