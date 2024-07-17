export const get = <T extends HTMLElement = HTMLElement>(
  query: string,
  from: number = 0,
  to: number = 1
) => {
  let elements: T[] = [];

  document.querySelectorAll<T>(query).forEach((element) => {
    elements.push(element);
  });

  return elements.slice(from, to === 0 ? undefined : to);
};
