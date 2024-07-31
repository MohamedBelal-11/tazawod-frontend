export const get = <T extends HTMLElement = HTMLElement>(
  query: string,
  from: number = 0,
  to: number = 1
) => {
  let elements: T[] = [];
  try {
    document.querySelectorAll<T>(query).forEach((element) => {
      elements.push(element);
    });
  } catch {}

  return elements.slice(from, to === 0 ? undefined : to);
};

export const stateScroll = (
  scrolled: boolean,
  setScrolled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!scrolled) {
    const { hash } = location;
    if (
      hash.startsWith("#") &&
      hash.length > 1 &&
      !hash.slice(1).includes("#")
    ) {
      const hashed = get(hash)[0] as HTMLElement | undefined;
      if (hashed) {
        hashed.scrollIntoView({ behavior: "smooth" });
        setScrolled(true);
      }
    }
  }
};
