import { Button, Col, Input, Row, Typography } from "antd";
const { Text } = Typography;

import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";
export default function ChatBox({ ChatRoomId }) {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let unsubscribe = db
      .collection("chatRooms")
      .doc(ChatRoomId)
      .onSnapshot((snapshot) => {
        if (snapshot.data === undefined) {
          return;
        }

        setChats(snapshot.data());
        console.log(snapshot.data());
      });

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div>
      {chats ? (
        chats.filter((c) => (
          <Message
            content={c.content}
            name={c.name}
            isMe={c.uid === auth.currentUser.uid}
          ></Message>
        ))
      ) : (
        <div></div>
      )}
      <div>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="enter message"
        ></Input>
        <Button
          onClick={() => {
            setChats(chats);
            db.collection("chatRooms")
              .doc(ChatRoomId)
              .update({
                chats: [
                  ...chats,
                  {
                    uid: auth.currentUser.uid,
                    name: auth.currentUser.displayName,
                    content: message,
                  },
                ],
              });
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

function Message({ content, name, isMe }) {
  return (
    <Row justify={isMe ? "end" : "start"}>
      <Col span={4}>
        <Text>{content}</Text>
        <Text type="secondary">{name}</Text>
      </Col>
    </Row>
  );
}