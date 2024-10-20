export default function loadComponent(component: string, id?: string) {
  const wrapper = document.querySelector<HTMLDivElement>(id ? id : "#app");

  if (wrapper) {
    wrapper.insertAdjacentHTML("beforeend", component);
  }
}
