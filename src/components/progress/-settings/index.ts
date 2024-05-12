import style from './settings.css?inline';
import form from './settings.html?raw';

class CircularProgressBarSettings extends HTMLElement {
  private progressBar: Element | null;

  constructor() {
    super();
    this.progressBar = null;
    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      console.error('Shadow root is not defined');
      return;
    }

    this.shadowRoot?.appendChild(this.template.content.cloneNode(true));

    const progressBarId = this.getAttribute('for');
    this.progressBar = progressBarId
      ? document.getElementById(progressBarId)
      : null;
    if (!this.progressBar) {
      console.error('Target progress bar is not found in the document');
    }
  }

  get template() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${style}</style>
      ${form}
    `;
    return template;
  }

  connectedCallback() {
    this.shadowRoot
      ?.querySelector('#settingsForm')
      ?.addEventListener('input', (e) => this._handleInput(e));
    this._initializeFormWithAttributes();
  }

  disconnectedCallback() {
    this.shadowRoot
      ?.querySelector('#settingsForm')
      ?.removeEventListener('input', (e) => this._handleInput(e));
  }

  private _handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!this.progressBar || !target.name) return;

    switch (target.name) {
      case 'transparent':
        this.progressBar.toggleAttribute('transparent', target.checked);
        break;
      case 'animated':
        this.progressBar.toggleAttribute('animated', target.checked);
        break;
      case 'value':
        if (+target.value < 0) {
          target.value = '0';
        } else if (+target.value > 100) {
          target.value = '100';
        }

        this.progressBar.setAttribute('value', target.value);
        break;
    }
  }

  private _initializeFormWithAttributes() {
    const settingsForm = this.shadowRoot?.querySelector('#settingsForm');
    if (!this.progressBar || !settingsForm) return;

    const value = this.getAttribute('value') ?? '0';
    const transparent = this.hasAttribute('transparent');
    const animated = this.hasAttribute('animated');

    (settingsForm.querySelector('[name="value"]') as HTMLInputElement).value =
      value;
    (
      settingsForm.querySelector('[name="transparent"]') as HTMLInputElement
    ).checked = transparent;
    (
      settingsForm.querySelector('[name="animated"]') as HTMLInputElement
    ).checked = animated;

    this.progressBar.setAttribute('value', value);
    if (transparent) this.progressBar.setAttribute('transparent', '');
    if (animated) this.progressBar.setAttribute('animated', '');
  }
}

customElements.define('progress-settings', CircularProgressBarSettings);
