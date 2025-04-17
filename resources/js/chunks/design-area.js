import designArea from 'remote_bucket/mountMyDesignArea';

const { default: remoteMountMethod } = designArea;
const rootElement = document.getElementById('react-root');
const accessToken = window.anonToken;
const customerId = '12345';
remoteMountMethod(rootElement, {
  customerId,
  token: accessToken,
});
