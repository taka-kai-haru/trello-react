import { v4 as uuid } from "uuid";

const dummyData = [
  {
    id: uuid(),
    title: "📝今からやる事",
    cards: [
      {
        cardId: uuid(),
        title: "Reactの勉強",
        limitDateTime: "",
        labelColor: "",
        progress: "",
        memo: "",
      },
      {
        cardId: uuid(),
        title: "Youtubeで勉強",
        limitDateTime: "",
        labelColor: "",
        progress: "",
        memo: "",
      },
      {
        cardId: uuid(),
        title: "散歩",
        limitDateTime: "",
        labelColor: "",
        progress: "",
        memo: "",
      },
    ],
  },
  {
    id: uuid(),
    title: "🚀今後やること",
    cards: [
      {
        cardId: uuid(),
        title: "コーディング",
        limitDateTime: "",
        labelColor: "",
        progress: "",
        memo: "",
      },
      {
        cardId: uuid(),
        title: "転職活動",
        limitDateTime: "",
        labelColor: "",
        progress: "",
        memo: "",
      },
    ],
  },
  {
    id: uuid(),
    title: "🌳終わったこと",
    cards: [
      {
        cardId: uuid(),
        title: "読書",
        limitDateTime: "",
        labelColor: "",
        progress: "",
        memo: "",
      },
    ],
  },
];

export default dummyData;
