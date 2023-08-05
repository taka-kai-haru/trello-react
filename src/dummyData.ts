import { v4 as uuid } from "uuid";

const dummyData = [
  {
    id: uuid(),
    title: "未着手",
    cards: [
      {
        cardId: uuid(),
        title: "Reactの勉強",
        limitDate: "2023/10/10",
        labelColor: "",
        progress: 100,
        memo: "",
      },
      {
        cardId: uuid(),
        title: "Youtubeで勉強",
        limitDate: "2023/10/10",
        labelColor: "",
        progress: 0,
        memo: "",
      },
      {
        cardId: uuid(),
        title: "散歩",
        limitDate: "2023/01/20",
        labelColor: "",
        progress: 0,
        memo: "",
      },
    ],
  },
  {
    id: uuid(),
    title: "実施中",
    cards: [
      {
        cardId: uuid(),
        title: "コーディング",
        limitDate: "2023/07/29",
        labelColor: "",
        progress: 0,
        memo: "",
      },
      {
        cardId: uuid(),
        title: "コーチング",
        limitDate: "",
        labelColor: "",
        progress: 100,
        memo: "",
      },
    ],
  },
  {
    id: uuid(),
    title: "完了",
    cards: [
      {
        cardId: uuid(),
        title: "読書",
        limitDate: "",
        labelColor: "",
        progress: 0,
        memo: "",
      },
    ],
  },
];

export default dummyData;
