let showLoaderExternal;
let hideLoaderExternal;

export const registerLoader = (show, hide) => {
  showLoaderExternal = show;
  hideLoaderExternal = hide;
};

export const showLoader = () => {
  if (showLoaderExternal) showLoaderExternal();
};

export const hideLoader = () => {
  if (hideLoaderExternal) hideLoaderExternal();
};
