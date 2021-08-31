import { curry } from '@typed/curry';
import { render } from 'lit';
import type { TemplateResult } from 'lit';

/**
 * Remove an element from the DOM
 * @param  el element to remove
 */
/* istanbul ignore next */
export const remove = (el: ChildNode): void =>
  el?.remove();

export const appendTemplate = curry(
  function appendTemplate(template: TemplateResult, target: Node) {
    const tmp = document.createElement('div');
    render(template, tmp);
    const { firstElementChild } = tmp;
    target.appendChild(firstElementChild);
    tmp.remove();
    return firstElementChild;
  }
);
