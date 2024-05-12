import componentStyles from './loader.css?inline';
import component from './loader.svg?raw';

class CircularProgressBar extends HTMLElement {
  private value: number;
  private isAnimated: boolean;
  private isHidden: boolean;
  private arc: SVGCircleElement | null;
  private circle: SVGElement | null;

  constructor() {
    super();
    this.value = 0;
    this.isAnimated = false;
    this.isHidden = false;
    this.circle = null;
    this.arc = null;

    this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) {
      console.error('Shadow root is not defined');
      return;
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    const circle = this.shadowRoot.querySelector('.progress');
    const arc = this.shadowRoot.querySelector('.progress__arc');

    if (!circle || !(circle instanceof SVGElement)) {
      console.error('Circle element is not found or incorrect type');
      return;
    } else {
      this.circle = circle as SVGElement;
    }
    
    if (!arc || !(arc instanceof SVGCircleElement)) {
      console.error('Arc element is not found or incorrect type');
      return;
    } else {
      this.arc = arc as SVGCircleElement;
    }
  }

  get template() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>${componentStyles}</style>
      ${component}
    `;
    return template;
  }

  static get observedAttributes() {
    return ['value', 'animated', 'transparent'];
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    switch (name) {
      case 'value':
        this.value = newValue ? Number(newValue) : 0;
        break;
      case 'animated':
        this.isAnimated = newValue !== null;
        break;
      case 'transparent':
        this.isHidden = newValue !== null;
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    if (!this.arc || !this.circle) {
      return;
    }

    const circumference = 2 * Math.PI * this.arc.r.baseVal.value;
    this.arc.style.strokeDasharray = `${
      (circumference * this.value) / 100
    } ${circumference}`;

    this.circle.classList.toggle('progress_hidden', this.isHidden);
    this.arc.classList.toggle(
      'progress__arc_animated',
      this.isAnimated
    );
  }
}

customElements.define('progress-loader', CircularProgressBar);
