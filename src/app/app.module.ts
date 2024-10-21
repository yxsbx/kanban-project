import { CoreModule } from "./core/core.module";

export class AppModule {
  loading: boolean;

  constructor() {
    this.loading = false;
    new CoreModule();
    this.bootstrap();
    this.simulateLoading();
  }

  bootstrap() {
    const appRoot = document.getElementById("app");
    if (appRoot) {
      this.renderApplication(appRoot);
    } else {
      console.error('Ponto de entrada "app" não encontrado no DOM.');
    }
  }

  simulateLoading() {
    this.loading = true;

    this.renderApplication(document.getElementById("app")!);

    setTimeout(() => {
      this.loading = false;
      this.updateLoadingState();
      this.initializeModules();
    }, 3000);
  }

  renderApplication(container: HTMLElement) {
    container.innerHTML = `
      <div>
        <div id="main-content"></div>
      </div>
      
      <div id="loading-overlay" class="loading-overlay">
        <div class="loading-message">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    `;
  }

  updateLoadingState() {
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = this.loading ? "flex" : "none";
    }
  }

  initializeModules() {
    CoreModule.getInstance();
  }
}
