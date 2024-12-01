async function getStatic(url: string) {
  const response: any = await fetch(url);
  // return url;
  return response.url;
}

export { getStatic };
