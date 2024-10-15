import FormComponent from "../components/Form";
import CardEntity from "../models/cardEntity";
import { generateId } from "../utils/generateID";
import { formatCurrentDate } from "../utils/formatDate";

const form = new FormComponent();
const kanbanForm: HTMLFormElement | null = (document.querySelector("formCard") as HTMLFormElement);

kanbanForm?.addEventListener(("submit"), (event: SubmitEvent) => {
    event.preventDefault();

    const target = (event.target as any); //Need to be changed

    const arrayCards: Array<CardEntity> = JSON.parse(localStorage.getItem("arrayCards") ?? "[]");
    const idCard = Number(generateId());
    const currentDate = formatCurrentDate();

    arrayCards.push({
        id: idCard,
        status: "to do",
        tag: target?.elements["tag"].value,
        description: target?.elements["description"].value,
        createdAt: currentDate
    });

    localStorage.setItem("arrayCards", JSON.stringify(arrayCards));

    kanbanForm.reset();
});