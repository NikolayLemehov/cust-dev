const COLOR_CLASS = `color-block`;
const colorBlockElements = document.querySelectorAll(`.${COLOR_CLASS}`);

const getOneDeepCollection = (collection) => {
  return Array.from(collection).reduce((acc, it) => {
    it.classList.add(COLOR_CLASS);
    acc.push(...it.children);
    console.log(acc);
    return acc;
  }, []);
};

const getDeepCollection = (collection) => {
  collection.forEach((it) => {
    const deepCount = Number(it.dataset.deep);
    if (deepCount) {
      let elements = it.children;
      for (let i = 0; i < deepCount; i++) {
        elements = getOneDeepCollection(elements);
      }
    }
  });
  return document.querySelectorAll(`.${COLOR_CLASS}`);
};

const removeExtraChildElement = (element) => {
  const childColorElement = element.querySelector(`.${COLOR_CLASS}`);
  if (!childColorElement) {
    Array.from(element.children).forEach((it) => it.remove());
  }
};
const colorBlock = (collection) => {
  let color = 0;
  collection.forEach((it) => {
    removeExtraChildElement(it);
    color += 130;
    it.style.cssText = `
      /*position: relative;*/
      /*outline: 2px solid hsl(${color}, 100%, 50%);*/
      box-shadow: inset 0 0 0 3px hsla(${color}, 100%, 50%, 0.9);
      background-color: hsla(${color}, 100%, 50%, 0.1);
      `;
  });
};

const newColorBlockElements = getDeepCollection(colorBlockElements);
colorBlock(newColorBlockElements);
