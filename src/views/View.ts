import { Model } from "../models/Model";

export abstract class View<T extends Model<K>, K> {
  regions: { [key: string]: Element } = {};

  constructor(public parent: Element, public model: T) {
    this.bindModel();
  }

  /**
   * HTML template string that will be rendered
   */
  abstract template(): string;

  /**
   * List of events to bind in format {event}:{element}:{function}
   */
  eventsMap(): { [key: string]: () => void } {
    return {};
  }

  /**
   * List of regions to bind in format {regionName}:{Region container as Document Fragment}
   */
  regionsMap(): { [key: string]: string } {
    return {};
  }

  /**
   * Rerender view html on model change
   */
  bindModel(): void {
    this.model.on("change", () => {
      this.render();
    });
  }

  /**
   * Helper function to bind events to HTML fragments
   */
  bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for (let eventKey in eventsMap) {
      const [eventName, selector] = eventKey.split(":");

      fragment.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    }
  }

  /**
   * Helper function to bind region or child containers to keys or region names
   */
  mapRegions(fragment: DocumentFragment): void {
    const regionsMap = this.regionsMap();

    for (let key in regionsMap) {
      const selector = regionsMap[key];
      const element = fragment.querySelector(selector);
      if (element) {
        this.regions[key] = element;
      }
    }
  }

  /**
   * Function to render all child elements or regions before parent view renders
   */
  onRender(): void {}

  /**
   * Render method to add HTML and Event listeners to the DOM
   */
  render(): void {
    // Emptying parent html on each render to replace html
    this.parent.innerHTML = "";

    // Creating template and assigning it the views template string
    const templateElement = document.createElement("template");
    templateElement.innerHTML = this.template();

    // Call to bind events to DOM elements
    this.bindEvents(templateElement.content);

    // Call to store references to all child elements of a view via the region map
    this.mapRegions(templateElement.content);

    // Call to render all child elements of a view before parent view is rendered
    this.onRender();

    // Render parent element to the DOM
    this.parent.append(templateElement.content);
  }
}
