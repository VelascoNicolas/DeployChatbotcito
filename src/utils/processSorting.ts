export const processSorting = (queryOrderBy: string | undefined): any => {
  const orderBy: any = {};
  if (queryOrderBy && typeof queryOrderBy === "string") {
    const orderByParams = queryOrderBy.split(",");
    orderByParams.forEach((param) => {
      const splitParams = param.split(":");
      const column = splitParams[0];
      const direction =
        splitParams.length > 1 ? splitParams[1].toUpperCase() : "ASC";
      orderBy[column] = direction;
    });
  }
  return orderBy;
};
