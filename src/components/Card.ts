import CardEntity from "../models/cardEntity";

export default class CardComponent {
    constructor(newCard: CardEntity) {
        const cardsList = document.querySelector("#cards-list");

        if(cardsList) {
            cardsList.innerHTML += this.renderCard(newCard);
        }
    }

    renderCard(newCard: CardEntity) {
        return `
        <li>
            <span>${newCard.tag}</span>
            <p>${newCard.description}</p>
            <div>
                <button id="editar" data-id="${newCard.id}"><i class="fa fa-pencil">&ensp;Editar</i></button>&ensp;
                <button id="deletar" data-id="${newCard.id}"><i class="fa fa-pencil">&ensp;Deletar</i></button>&ensp;
            </div>
            <div>
                <span>${newCard.createdBy}</span>
                <span>${newCard.createdAt}</span>
            </div>
        </li>
        `;
    }
}