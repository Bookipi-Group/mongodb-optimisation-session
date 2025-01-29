export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const lodgeTimeCost = async (
  fn: () => Promise<any>,
  name: string,
  loop = 1000,
) => {
  const start = Date.now();
  for (let i = 0; i < loop; ++i) {
    await fn();
  }
  console.log(
    `${name}(${loop} loop${loop > 1 ? "s" : ""}) took ${Date.now() - start}ms`,
  );
};
