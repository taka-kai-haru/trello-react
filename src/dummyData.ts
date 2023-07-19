import { v4 as uuid } from "uuid";

const dummyData = [
    {
        id: uuid(),
        title: "📝今からやる事",
        tasks: [
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
        tasks: [
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
        tasks: [
            {
                id: uuid(),
                title: "読書",
            },
        ],
    },
];

export default dummyData;