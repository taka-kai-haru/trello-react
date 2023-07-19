/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import dummyData from "../dummyData";
import {useState} from "react";
import {Card} from "./Card";
import firebase from "firebase/app";
import {storage, db, auth} from "../firebase";
import {SectionTitle} from "./SectionTitle";
import {SectionDeleteButton} from "./button/SectionDeleteButton";

interface Task {
    id: string;
    title: string;
}

interface Section {
    id: string;
    title: string;
    tasks: Task[];
}


export const TaskCards = () => {
    const [data, setData] = useState<Section[]>(dummyData);

    const onDragEnd = (result: DropResult) => {
        const {source, destination} = result; // source: 移動元の情報, destination: 移動先の情報

        console.log(result);

        // カードをドロップした場所がない場合
        if (!destination) {
            return;
        }

        // 動きが無い場合
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            return;
        }

        // typeが"COLUMN"の場合
        if (result.type === "COLUMN") {
            const newColumnOrder = [...data]; // カラムの順番をコピー
            const [removed] = newColumnOrder.splice(source.index, 1); // 移動したカラムを削除
            newColumnOrder.splice(destination.index, 0, removed); // 移動したカラムを追加
            setData(newColumnOrder);
            return;
        }

        // 別のカラムにタスクが移動した時
        if (source.droppableId !== destination.droppableId) {

            // 同じカラム内でのタスクの入れ替え
            const sourceColIndex = data.findIndex((col) => col.id === source.droppableId); // 移動元のtasksのindex
            const destinationColIndex = data.findIndex((col) => col.id === destination.droppableId); // 移動先のtasksのindex
            const sourceCol = data[sourceColIndex]; // 移動元のtasksの全データを取得
            const destinationCol = data[destinationColIndex]; // 移動先のtasksの全データを取得

            const sourceTasks = [...sourceCol.tasks]; // 移動元のtasksの全データをコピー
            const destinationTasks = [...destinationCol.tasks]; // 移動元のtasksの全データをコピー

            // 動かし始めたタスクの削除
            const [removed] = sourceTasks.splice(source.index, 1); // 移動元のtasksから移動したタスクを削除
            // 動かした後のカラムにタスクの追加
            destinationTasks.splice(destination.index, 0, removed); // 移動先のtasksに移動したタスクを追加

            data[sourceColIndex].tasks = sourceTasks; // 移動元のtasksを更新
            data[destinationColIndex].tasks = destinationTasks; // 移動元のtasksを更新

            setData(data); // dataを更新

        } else {

            // 同じカラム内でのタスクの入れ替え
            const sourceColIndex = data.findIndex((col) => col.id === source.droppableId); // 移動元のtasksのindex
            console.log(sourceColIndex);
            const sourceCol = data[sourceColIndex]; // 移動元のtasksの全データを取得
            console.log(sourceCol);

            const sourceTasks = [...sourceCol.tasks]; // 移動元のtasksの全データをコピー
            // タスクの削除
            const [removed] = sourceTasks.splice(source.index, 1); // 移動元のtasksから移動したタスクを削除
            // タスクの追加
            sourceTasks.splice(destination.index, 0, removed); // 移動先のtasksに移動したタスクを追加

            data[sourceColIndex].tasks = sourceTasks; // 移動元のtasksを更新
            setData(data); // dataを更新

        }

    }

    // FireStoreにdataのデータを追加する関数
    const insertFireStore = () => {
        // data.map((section, index) => {
        //     console.log(section);
        //     db.collection("contents").doc(auth.currentUser?.uid).set({index: section});
        // });
        // db.collection("contents").doc(auth.currentUser?.uid).set(data);
        data.map((section, index) => {
            const {id, title, tasks} = section;
            const formattedTasks = tasks.map(task => ({...task}));
            const formattedData = {id, title, tasks: formattedTasks, order: index};
            db.collection("users").doc(auth.currentUser?.uid).collection("contents").doc(id).set(formattedData);
            // db.collection("contents").doc(auth.currentUser?.uid).set(formattedData);
            })
        }


    // FireStoreに対象データがあれば削除する。
    const deleteFireStore = () => {
        db.collection("users").doc(auth.currentUser?.uid).collection("contents").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection("users").doc(auth.currentUser?.uid).collection("contents").doc(doc.id).delete();
            });
        }
        );
    }

    const selectFireStore = () => {
        let dadata: any = [];
        db.collection("users").doc(auth.currentUser?.uid).collection("contents").orderBy("order").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                dadata.push(docData);
            });
                console.log(dadata);
                console.log(data);
                setData(dadata);
        }
        );


    }

    // dataのsectionのtitleを変更する関数
    const changeTitle = (id: string, newTitle: string) => {
        const newData = data.map((section) => {
            if (section.id === id) {
                return {...section, title: newTitle};
            } else {
                return section;
            }
        });
        setData(newData);
    }

    return (
        <div css={Container}>

            <DragDropContext onDragEnd={onDragEnd}>

                <Droppable type="COLUMN" droppableId="board" direction="horizontal">
                    {(provided: any) => (
                <div css={sectionList}
                     ref={provided.innerRef}
                     {...provided.droppableProps}>
                    {data.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided: any, snapshot: any) => (

                                <div
                                    css={trelloSection}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.5 : 1,}}
                                >
                                    <div css={sectionTitleSectionDeleteArea}>
                                        <SectionTitle changeTitle={changeTitle} section={section} />
                                        <SectionDeleteButton />
                                    </div>
                                    <Droppable droppableId={section.id} >
                                        {(provided: any) => (
                                        <div className="trello-section-content"
                                             ref={provided.innerRef}
                                             {...provided.droppableProps}
                                        >
                                        {section.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided: any, snapshot: any) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            opacity: snapshot.isDragging ? 0.5 : 1,
                                                        }}
                                                    >
                                                        <Card>{task.title}</Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                        )}
                                    </Droppable>
                                    {provided.placeholder}
                                </div>


                            )}

                        </Draggable>

                    ))}
                    <div css={trelloSection}>リストを追加</div>
                </div>

            )}
            </Droppable>


            </DragDropContext>


            <button onClick={() => console.log(data)}>console.log(data)</button>
            <button onClick={() => insertFireStore()}>FireStoreに追加</button>
            <button onClick={() => deleteFireStore()}>FireStoreから削除</button>
            <button onClick={() => selectFireStore()}>FireStoreから取得</button>
        </div>
    )
}

// 大枠
const Container = css`
    margin: 30px 30px;
`;

// Sectionの枠
const trelloSection = css`
  min-width: 320px;
  /* border: 1px solid white; */
  background: rgb(30, 25, 31);
  background: linear-gradient(
          126deg,
          rgba(30, 25, 31, 1) 0%,
          rgba(51, 45, 54, 1) 96%
  );
  padding: 10px;
  border-radius: 10px;
  margin-left: 10px;
`;

const sectionTitleSectionDeleteArea = css`
  display: flex;
  justify-content: space-between;
  `;

const sectionList = css`
  display: flex;
  align-items: flex-start;
`;
