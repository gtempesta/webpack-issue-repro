const extractMicroFrontend = async () => {
  const { default: designAreaModule } = await import(
    'remote/mountMyDesignArea'
  );
  window.designArea = designAreaModule;
};

extractMicroFrontend();
