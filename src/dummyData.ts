import { v4 as uuid } from "uuid";

const dummyData = [
    {
        id: uuid(),
        title: "📝今からやる事",
        cards: [
            {
                id: uuid(),
                title: "Reactの勉強",
            },
            {
                id: uuid(),
                title: "Youtubeで勉強",
            },
            {
                id: uuid(),
                title: "散歩",
            },
        ],
    },
    {
        id: uuid(),
        title: "🚀今後やること",
        cards: [
            {
                id: uuid(),
                title: "コーディング",
            },
            {
                id: uuid(),
                title: "転職活動",
            },
        ],
    },
    {
        id: uuid(),
        title: "🌳終わったこと",
        cards: [
            {
                id: uuid(),
                title: "読書",
            },
        ],
    },
];

export default dummyData;