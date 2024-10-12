// interface State {
// 	filterUser: User | null;
// 	filterTag: string | null;
// 	currentUser: User | null;
// }
// interface User {
// 	id: number;
// 	name: string;
// 	image: string;
// }

// class TagManager {
//   tags: string[];
//   constructor(tags: string[]) {
//     this.tags = tags;
//   }
//   findTagById(id: string): string | undefined {
//     return this.tags.find((t) => t === id);
//   }
// }
class TagManager {
  getSelectedTag() {
    const selectedTag = localStorage.getItem("selectedTag");
    if (!selectedTag) {
      return null;
    }
    return JSON.parse(selectedTag);
  }

  setTag(selectedTag: string) {
    localStorage.setItem("selectedTag", JSON.stringify(selectedTag));
  }
}
export default class NavBarRender {
  selectedTag: string;
	$header: HTMLElement;
  tags: string[];

  constructor() {
		const header = (document.querySelector("#js-header") as HTMLElement);
		this.$header = header;

    const tagManager = new TagManager();
    this.selectedTag = tagManager.getSelectedTag();
    this.tags = ["Front-End", "Back-End", "UX / UI", "Data"];
		this.init();
    
    
  }
	init(): void {
		if (this.$header) this.$header.innerHTML = this.render();
		this.addEventListeners();
	}
  render() {
    return `
      <nav class="pl-10 flex items-center bg-gray-100">
        <h1 class="w-1/4">Lista de Tarefas</h1>
        <div id="js-tags" class="flex items-center justify-beetwen navBar h-16">
          <p>Filtros: </p>
          <div class="pl-10 flex gap-8">
            ${this.tags.map(tag => `
              <span class="${tag === this.selectedTag ? 'relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg text-white' : 'border-2 border-solid border-gray-300'} rounded-lg pr-4 pl-4 pt-2 pb-2 cursor-pointer">${tag === this.selectedTag ? `
								<div>${this.selectedTag}</div>` : tag}
							</span>
            `).join('')}
          </div>

        </div>
      </nav>
    `;
  }
	addEventListeners(): void {
		this.$header?.addEventListener("click", (event) => {
			const target = (event.target as HTMLElement);
			const spanElement = target.closest("span");
	
			if (spanElement) {
				const selectedTag = String(spanElement.textContent?.trim());
				const tagManager = new TagManager;
				tagManager.setTag(selectedTag)
				console.log(selectedTag);
			}
		});
	}
}
