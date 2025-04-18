const { default: remoteMountMethod } = import(
  'remote_bucket/mountMyDesignArea'
);

const rootElement = document.getElementById('react-root');
const accessToken = window.anonToken;
const customerId = '12345';
remoteMountMethod(rootElement, {
  customerId,
  token: accessToken,
});
