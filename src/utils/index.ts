export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const lodgeTimeCost = async (fn: () => Promise<any>, name: string) => {
  const start = Date.now();
  await fn();
  console.log(`${name} took ${Date.now() - start}ms`);
};
