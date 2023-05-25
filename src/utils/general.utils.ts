export function createNewJsonWithoutFields<T extends Record<string, any>>(
  originalJson: T,
  fieldsToExclude: Array<string>,
) {
  const updatedJson: Partial<T> = Object.keys(originalJson).reduce(
    (acc: Partial<T>, key: string) => {
      if (!fieldsToExclude.includes(key)) {
        acc[key as keyof T] = originalJson[key];
      }
      return acc;
    },
    {},
  );
  return updatedJson;
}
