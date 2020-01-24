import { curry } from '@typed/curry';
import { render } from 'lit-html';

/**
 * Remove an element from the DOM
 * @param {ChildNode} el
 * @return {void}
 */
/* istanbul ignore next */
export const remove = el =>
  el?.remove();

export const appendTemplate = curry(function appendTemplate(template, target) {
  const tmp = document.createElement('div');
  render(template, tmp);
  const { firstElementChild } = tmp;
  target.appendChild(firstElementChild);
  tmp.remove();
  return firstElementChild;
});

const mapPropEntry = mapping => ([key, value]) =>
  key in mapping &&
    typeof mapping[key] === 'function' ?
    [key, mapping[key](value)]
    : [key, value];

export const mapProps = mapping => obj =>
  Object.fromEntries(Object.entries(obj).map(mapPropEntry(mapping)));

export const mapDataset = f => ({ dataset }) => f(dataset);
