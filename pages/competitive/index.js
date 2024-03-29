import { Button, Col, Input, Row, Typography } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import ChatBox from "../../src/components/ChatBox";
import MatchQueue from "../../src/config/QueueMatch";
import Quiz from "../../src/components/quiz";
import { auth, db } from "../../src/config/firebaseConfig";
import Leaderbord from "../../src/components/LeaderBord";
import Timer from "../../src/components/timer";
import firebase from "firebase";
import { Divider } from "antd";
export default function Casual() {
  const [gameRoomId, setGameRoomId] = useState("");
  const [chatRoomIdm, setChatRoomId] = useState("");
  const [quizState, setQuizState] = useState(false);
  const hasTime = true;
  const overTime = 30;
  const playerCount = 3;
  const questionMultiplier = 4;
  useEffect(() => {
    const Match = async () => {
      const [chatRoomId, gameRoomId] = await MatchQueue(
        "Competitive",
        questionMultiplier,
        playerCount
      );
      setGameRoomId(gameRoomId);
      setChatRoomId(chatRoomId);
    };
    Match();
  }, []);

  useEffect(() => {
    if (gameRoomId === "") {
      return;
    }
    let unsub;
    if (gameRoomId !== "") {
      unsub = db
        .collection("gameRoom")
        .doc(gameRoomId)
        .onSnapshot((doc) => {
          //do something with data change
          const data = doc.data();
          if (data.state === "Running") {
            setQuizState(true);
          }
        });
    }
    return () => {
      try {
        unsub();
      } catch {}
    };
  }, [gameRoomId]);
  const onWin = async () => {
    //DO Something When Win to db
    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        CompetitiveGamesPlayed: firebase.firestore.FieldValue.increment(1),
        CompetitiveGamesWin: firebase.firestore.FieldValue.increment(1),
      });
  };
  const onLoose = async () => {
    //Do Something When Loose to db

    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        CompetitiveGamesPlayed: firebase.firestore.FieldValue.increment(1),
      });
  };
  return (
    <div style={{
      backgroundColor:"rgba(187,147,83,25)",
      width:"100%",
      height:"680px",
      overflowY: "hidden"
    }}>
      <div style={{ textAlign: "center" }}>
      <h2 style={{marginLeft:"15px"}}>
        Answer All {questionMultiplier * 5} questions Before Timer Runs Out To
        Win
      </h2>
      <Divider></Divider>
      {hasTime && (
        <Timer
          key="555"
          gameRoomId={gameRoomId}
          quizState={quizState}
          overTime={overTime}
        ></Timer>
      )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
        <Leaderbord
        gameRoomId={gameRoomId}
        timeBased={hasTime}
        key="a"
        onWin={onWin}
        onLoose={onLoose}
      ></Leaderbord>
      </div>
        <div>
      <Quiz
        queMultiplier={questionMultiplier}
        gameRoomId={gameRoomId}
        quizState={quizState}
        hasTime={hasTime}
        key="10"
      ></Quiz>{" "}
       </div>
      <div>
       <ChatBox ChatRoomId={chatRoomIdm} key="1"></ChatBox>
        </div>
       </div>
    </div>
  );
}
