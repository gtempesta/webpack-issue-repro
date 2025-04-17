import designArea from 'remote_bucket/mountMyDesignArea';

const { default: remoteMountMethod } = designArea;
const rootElement = document.getElementById('react-root');
const accessToken = window.anonToken;
const customerId = 'PIXf380e22ax502ex4dedxbdb4x05c5ee7c32fe';
console.log('ss');
remoteMountMethod(rootElement, {
    customerId,
    token: accessToken,
    merchant: 'pixartprinting',
    artworkType: 'drafts',
});
