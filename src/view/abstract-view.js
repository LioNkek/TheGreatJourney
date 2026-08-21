export default class AbstractView {
  #element = null;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = this.createElement();
    }
    return this.#element;
  }

  createElement() {
    const newElement = document.createElement('div');
    newElement.innerHTML = this.template;
    return newElement.firstElementChild;
  }

  get template() {
    throw new Error('AbstractView method not implemented: get template');
  }

  getElement() {
    return this.element;
  }

  removeElement() {
    this.#element = null;
  }
}
