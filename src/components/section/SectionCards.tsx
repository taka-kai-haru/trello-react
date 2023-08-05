/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import dummyData from "../../dummyData";
import { FC, useCallback, useEffect, useState } from "react";
import { Card } from "../card/Card";
import { db, auth } from "../../firebase";
import { SectionTitle } from "./SectionTitle";
import { SectionDeleteButton } from "./SectionDeleteButton";
import { AddSection } from "./AddSection";
import { v4 as uuid } from "uuid";
import { AddCard } from "../card/AddCard";
import { CardEdit } from "../card/CardEdit";
// import { DocumentData } from "firebase/firestore";

interface Card {
  cardId: string;
  title: string;
  limitDate: string;
  labelColor: string;
  progress: number;
  memo: string;
}

interface Section {
  id: string;
  title: string;
  cards: Card[];
}

export const SectionCards: FC = () => {
  // const [data, setData] = useState<Section[]>(dummyData);
  const [data, setData] = useState<Section[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSectionId, setEditSectionId] = useState("");
  const [edtCardData, setEditCardData] = useState({
    cardId: "",
    title: "",
    limitDate: "",
    labelColor: "",
    progress: 0,
    memo: "",
  });

  useEffect(() => {
    selectFireStore();
  }, []);

  useEffect(() => {
    updateFirestoreData(data);
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result; // source: 移動元の情報, destination: 移動先の情報

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

      setData([...data]); // dataを更新
    } else {
      // 同じカラム内でのタスクの入れ替え
      const sourceColIndex = data.findIndex(
        (col) => col.id === source.droppableId,
      ); // 移動元のcardsのindex

      const sourceCol = data[sourceColIndex]; // 移動元のcardsの全データを取得

      const sourceCards = [...sourceCol.cards]; // 移動元のcardsの全データをコピー
      // タスクの削除
      const [removed] = sourceCards.splice(source.index, 1); // 移動元のcardsから移動したタスクを削除
      // タスクの追加
      sourceCards.splice(destination.index, 0, removed); // 移動先のcardsに移動したタスクを追加

      data[sourceColIndex].cards = sourceCards; // 移動元のcardsを更新
      setData([...data]); // dataを更新
    }
  };

  const updateFirestoreData = async (updatedData: Section[]) => {
    try {
      await Promise.all(
        updatedData.map(async (section, index) => {
          const { id, title, cards } = section;
          const formattedCards = cards.map((card) => ({ ...card }));
          const formattedData = {
            id,
            title,
            cards: formattedCards,
            order: index,
          };

          const docRef = db
            .collection("users")
            .doc(auth.currentUser?.uid)
            .collection("contents")
            .doc(id);

          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            // ドキュメントが存在する場合は更新
            await docRef.update(formattedData);
          } else {
            // ドキュメントが存在しない場合は新規作成
            await docRef.set(formattedData);
          }
        }),
      );
    } catch (error) {
      console.error("データ更新時にエラーが発生しました。 Firebase:", error);
    }
  }; // Firestoreからデータを取得

  const selectFireStore = useCallback(async (): Promise<void> => {
    try {
      const querySnapshot = await db
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection("contents")
        .orderBy("order")
        .get();

      const selectData: Section[] = querySnapshot.docs.map(
        (doc) => doc.data() as Section,
      );
      setData(selectData);
    } catch (error) {
      console.error("データ取得時にエラーが発生しました。 Firebase:", error);
    }
  }, []);

  // dataのsectionのtitleを変更
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

  // dataのsectionを追加
  const addSection = (title: string) => {
    const newSection = {
      id: uuid(),
      title: title,
      cards: [],
    };
    const newData = [...data, newSection];
    setData(newData);
  };

  // dataのsectionを削除
  const deleteSection = (id: string) => {
    const newData = data.filter((section) => section.id !== id);
    setData(newData);
  };

  // dataのcardを追加
  const addCard = (sectionId: string, title: string) => {
    const newCard = {
      cardId: uuid(),
      title: title,
      limitDate: "",
      labelColor: "",
      progress: 0,
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

  // dataのardを変更
  const changeCard = (
    sectionId: string,
    cardId: string,
    title: string,
    limitDate: string,
    labelColor: string,
    progress: number,
    memo: string,
  ) => {
    const newData = data.map((section) => {
      if (section.id === sectionId) {
        const newCards = section.cards.map((card) => {
          if (card.cardId === cardId) {
            return {
              ...card,
              title: title,
              limitDate: limitDate,
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

  // dataのcardを削除
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

  // editModalを表示
  const openEditModalFunc = (sectionId: string, card: Card) => {
    setEditSectionId(sectionId);
    setEditCardData(card);
    setOpenEditModal(true);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
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
                                          <Card card={card} />
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <AddSection addSection={addSection} style={trelloSection} />
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
    </div>
  );
};

const sectionListStyle = css`
  padding: 5px 0 0 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 220px);
  scrollbar-gutter: stable;
`;

const draggingCardStyle = css`
  padding: 5px 0 5px 0;
`;

const sectionInnerListStyle = css`
  padding: 0 6px 0 6px;
  margin: 0 0 0 6px;
`;

// Section
const trelloSection = css`
  width: 320px;
  min-width: 320px;
  background: rgb(30, 25, 31);
  background: linear-gradient(
    126deg,
    rgba(30, 25, 31, 1) 0%,
    rgba(51, 45, 54, 1) 96%
  );
  padding: 10px 5px 10px 5px;
  border-radius: 8px;
  margin: 0 16px 0 0;
  display: inline-block;
`;

const sectionTitleSectionDeleteArea = css`
  display: flex;
  justify-content: space-between;
`;

const sectionList = css`
  padding: 0 20px 0 20px;
  white-space: nowrap;
  overflow-x: auto;
  height: calc(100vh - 80px);
  display: flex;
  align-items: flex-start;
  width: calc(100vw - 40px);
`;
