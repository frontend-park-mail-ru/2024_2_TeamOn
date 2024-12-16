async function getUrlStatic(url: string) {
  const response: any = await fetch(url);
  return response.url;
}
function setStatic(container: any, url: string) {
  container.style.backgroundImage = `url(${url})`;
  return url;
}

export { setStatic, getUrlStatic };
