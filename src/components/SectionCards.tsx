/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import dummyData from "../dummyData";
import { FC, useState } from "react";
import { Card } from "./Card";
import { db, auth } from "../firebase";
import { SectionTitle } from "./SectionTitle";
import { SectionDeleteButton } from "./button/SectionDeleteButton";
import { AddSection } from "./AddSection";
import { v4 as uuid } from "uuid";
import { AddCard } from "./AddCard";
import { CardEdit } from "./CardEdit";

interface Card {
  cardId: string;
  title: string;
  limitDateTime: string;
  labelColor: string;
  progress: string;
  memo: string;
}

interface Section {
  id: string;
  title: string;
  cards: Card[];
}

export const SectionCards: FC = () => {
  const [data, setData] = useState<Section[]>(dummyData);
  const [columnDropping, setColumnDropping] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSectionId, setEditSectionId] = useState("");
  const [edtCardData, setEditCardData] = useState({
    cardId: "",
    title: "",
    limitDateTime: "",
    labelColor: "",
    progress: "",
    memo: "",
  });
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result; // source: 移動元の情報, destination: 移動先の情報

    console.log(result);

    setColumnDropping(false);

    // カードをドロップした場所がない場合
    if (!destination) {
      return;
    }

    // 動きが無い場合
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
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
      const sourceColIndex = data.findIndex(
        (col) => col.id === source.droppableId,
      ); // 移動元のcardsのindex
      const destinationColIndex = data.findIndex(
        (col) => col.id === destination.droppableId,
      ); // 移動先のcardsのindex
      const sourceCol = data[sourceColIndex]; // 移動元のcardsの全データを取得
      const destinationCol = data[destinationColIndex]; // 移動先のcardsの全データを取得

      const sourceCards = [...sourceCol.cards]; // 移動元のcardsの全データをコピー
      const destinationCards = [...destinationCol.cards]; // 移動元のcardsの全データをコピー

      // 動かし始めたタスクの削除
      const [removed] = sourceCards.splice(source.index, 1); // 移動元のcardsから移動したタスクを削除
      // 動かした後のカラムにタスクの追加
      destinationCards.splice(destination.index, 0, removed); // 移動先のcardsに移動したタスクを追加

      data[sourceColIndex].cards = sourceCards; // 移動元のcardsを更新
      data[destinationColIndex].cards = destinationCards; // 移動元のcardsを更新

      setData(data); // dataを更新
    } else {
      // 同じカラム内でのタスクの入れ替え
      const sourceColIndex = data.findIndex(
        (col) => col.id === source.droppableId,
      ); // 移動元のcardsのindex
      console.log(sourceColIndex);
      const sourceCol = data[sourceColIndex]; // 移動元のcardsの全データを取得
      console.log(sourceCol);

      const sourceCards = [...sourceCol.cards]; // 移動元のcardsの全データをコピー
      // タスクの削除
      const [removed] = sourceCards.splice(source.index, 1); // 移動元のcardsから移動したタスクを削除
      // タスクの追加
      sourceCards.splice(destination.index, 0, removed); // 移動先のcardsに移動したタスクを追加

      data[sourceColIndex].cards = sourceCards; // 移動元のcardsを更新
      setData(data); // dataを更新
    }
  };

  // FireStoreにdataのデータを追加する関数
  const insertFireStore = () => {
    // data.map((section, index) => {
    //     console.log(section);
    //     db.collection("contents").doc(auth.currentUser?.uid).set({index: section});
    // });
    // db.collection("contents").doc(auth.currentUser?.uid).set(data);
    data.map((section, index) => {
      const { id, title, cards } = section;
      const formattedCards = cards.map((card) => ({ ...card }));
      const formattedData = { id, title, cards: formattedCards, order: index };
      db.collection("users")
        .doc(auth.currentUser?.uid)
        .collection("contents")
        .doc(id)
        .set(formattedData);
      // db.collection("contents").doc(auth.currentUser?.uid).set(formattedData);
    });
  };

  // FireStoreに対象データがあれば削除する。
  const deleteFireStore = () => {
    db.collection("users")
      .doc(auth.currentUser?.uid)
      .collection("contents")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection("users")
            .doc(auth.currentUser?.uid)
            .collection("contents")
            .doc(doc.id)
            .delete();
        });
      });
  };

  const selectFireStore = () => {
    let selectData: any = [];
    db.collection("users")
      .doc(auth.currentUser?.uid)
      .collection("contents")
      .orderBy("order")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          selectData.push(docData);
        });
        console.log(selectData);
        console.log(data);
        setData(selectData);
      });
  };

  // dataのsectionのtitleを変更する関数
  const changeTitle = (id: string, newTitle: string) => {
    const newData = data.map((section) => {
      if (section.id === id) {
        return { ...section, title: newTitle };
      } else {
        return section;
      }
    });
    setData(newData);
  };

  // dataのsectionを追加する関数
  const addSection = (title: string) => {
    const newSection = {
      id: uuid(),
      title: title,
      cards: [],
    };
    const newData = [...data, newSection];
    setData(newData);
  };

  // dataのsectionを削除する関数
  const deleteSection = (id: string) => {
    const newData = data.filter((section) => section.id !== id);
    setData(newData);
  };

  // dataのcardを追加する関数
  const addCard = (sectionId: string, title: string) => {
    const newCard = {
      cardId: uuid(),
      title: title,
      limitDateTime: "",
      labelColor: "",
      progress: "",
      memo: "",
    };
    const newData = data.map((section) => {
      if (section.id === sectionId) {
        return { ...section, cards: [...section.cards, newCard] };
      } else {
        return section;
      }
    });
    setData(newData);
  };

  // dataのardを変更する関数
  const changeCard = (
    sectionId: string,
    cardId: string,
    title: string,
    limitDateTime: string,
    labelColor: string,
    progress: string,
    memo: string,
  ) => {
    const newData = data.map((section) => {
      if (section.id === sectionId) {
        const newCards = section.cards.map((card) => {
          if (card.cardId === cardId) {
            return {
              ...card,
              title: title,
              limitDateTime: limitDateTime,
              labelColor: labelColor,
              progress: progress,
              memo: memo,
            };
          } else {
            return card;
          }
        });
        return { ...section, cards: newCards };
      } else {
        return section;
      }
    });
    setData(newData);
  };

  // dataのcardを削除する関数
  const deleteCard = (sectionId: string, cardId: string) => {
    const newData = data.map((section) => {
      if (section.id === sectionId) {
        const newCards = section.cards.filter((card) => card.cardId !== cardId);
        return { ...section, cards: newCards };
      } else {
        return section;
      }
    });
    setData(newData);
  };

  // editModalを開く関数
  const openEditModalFunc = (sectionId: string, card: Card) => {
    setEditSectionId(sectionId);
    setEditCardData(card);
    setOpenEditModal(true);
    console.log("sectionId: " + sectionId);
    console.log("card: " + card);
  };

  // Drag開始時に実行される関数
  const onDragStart = (tmp: any) => {
    if (tmp.type === "COLUMN") {
      setColumnDropping(true);
      console.log("start");
    }
  };

  return (
    <div css={Container}>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable type="COLUMN" droppableId="board" direction="horizontal">
          {(provided: any) => (
            <div
              css={sectionList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {data.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                  // disableInteractiveElementBlocking={false}
                >
                  {(provided: any, snapshot: any) => (
                    <div
                      css={trelloSection}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                      }}
                    >
                      <div css={sectionTitleSectionDeleteArea}>
                        <SectionTitle
                          changeTitle={changeTitle}
                          section={section}
                        />
                        <SectionDeleteButton
                          id={section.id}
                          deleteSection={deleteSection}
                        />
                      </div>
                      <Droppable droppableId={section.id}>
                        {(provided: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            <div css={sectionListStyle}>
                              <div css={sectionInnerListStyle}>
                                {section.cards.map((card, index) => (
                                  <Draggable
                                    key={card.cardId}
                                    draggableId={card.cardId}
                                    index={index}
                                    // disableInteractiveElementBlocking={false}
                                  >
                                    {(provided: any, snapshot: any) => (
                                      <div
                                        css={draggingCardStyle}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                          opacity: snapshot.isDragging
                                            ? 0.5
                                            : 1,
                                        }}
                                      >
                                        <div
                                          onClick={() =>
                                            openEditModalFunc(section.id, card)
                                          }
                                        >
                                          <Card>{card.title}</Card>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            </div>
                            <AddCard addCard={addCard} sectionId={section.id} />
                          </div>
                        )}
                      </Droppable>

                      {provided.placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
              <AddSection
                addSection={addSection}
                columnDropping={columnDropping}
                style={trelloSection}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <CardEdit
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        sectionId={editSectionId}
        changeCard={changeCard}
        card={edtCardData}
        deleteCard={deleteCard}
      />

      <button onClick={() => console.log(data)}>console.log(data)</button>
      <button onClick={() => insertFireStore()}>FireStoreに追加</button>
      <button onClick={() => deleteFireStore()}>FireStoreから削除</button>
      <button onClick={() => selectFireStore()}>FireStoreから取得</button>
    </div>
  );
};

// 大枠
const Container = css`
  margin: 30px 30px;
  //max-height: calc(100vh - 150px);
  //display: inline-flex;
  //min-width: 100vw;
`;

const sectionListStyle = css`
  //margin: 5px 0 5px 0;
  //margin: 5px 5px 5px 0;
  padding: 5px 0 0 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
`;

const draggingCardStyle = css`
  padding: 5px 0 5px 0;
`;

const sectionInnerListStyle = css`
  padding: 0 6px 0 6px;
  margin: 0;
`;

// Sectionの枠
const trelloSection = css`
  width: 320px;
  min-width: 320px;
  /* border: 1px solid white; */
  background: rgb(30, 25, 31);
  background: linear-gradient(
    126deg,
    rgba(30, 25, 31, 1) 0%,
    rgba(51, 45, 54, 1) 96%
  );
  padding: 10px 5px 10px 5px;
  border-radius: 8px;
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
