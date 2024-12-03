export const createElement = (
  elementName: any,
  props: any,
  ...children: any
) => {
  const chldrn = children.flat();

  if (typeof elementName === "function") {
    const component = () => elementName({ ...props, children: chldrn });

    return {
      ...component(),
      component,
    };
  }

  return {
    elementName,
    props,
    children: chldrn,
  };
};
