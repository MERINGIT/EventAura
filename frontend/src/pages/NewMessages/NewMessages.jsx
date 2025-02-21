/**
 * Author : Kabilesh Ravi Chandran
 */

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react';
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import { ChatContext } from '../../context/chatContext';
import { AuthorizationContext } from '../../context/AuthorizationContext';
import { db } from '../../firebase';
import ChatInterface from '../EventHistory/components/ChatInterace';
import './style.scss'

const NewMessages = () => {
  const { user, } = useContext(AuthorizationContext);
  const { data, dispatch, } = useContext(ChatContext);
  const [chats, setChats,] = useState([]);
  const [messages, setMessages,] = useState([]);
  const [newChat, setNewChat,] = useState('');
  const [selectedReceiver, setSelectedReceiver,] = useState([]);
console.log(user);
  useEffect(() => {
  }, [chats,]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', user.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    user?.uid && getChats();
  }, [user?.uid,]);

  useEffect(() => {
    setSelectedReceiver(Object.entries(chats)?.[0]);
  }, [chats,]);

  useEffect(() => {
    if (Object.entries(chats)?.length) dispatch({ type: 'CHANGE_USER', payload: selectedReceiver?.[1]?.userInfo, });
  }, [selectedReceiver,]);

  useEffect(() => {
    if (selectedReceiver?.length) {
      const unSub = onSnapshot(doc(db, 'chats', selectedReceiver?.[0]), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      return () => {
        if (selectedReceiver?.length) unSub();
      };
    }
  }, [selectedReceiver,]);

  const getFirstLetter = (name) => {
    return name?.[0];
  };

  const onSendMsg = async () => {
    await updateDoc(doc(db, 'chats', data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: newChat,
        senderId: user?.uid,
        date: Timestamp.now(),
      }),
    });
    setNewChat('');
  };

  return (
    <>
    {
      Object.keys(chats).length ? (
        <div className='my-messages'>
          <div className='left-container'>
            {
              Object.entries(chats)?.map((chatItem) => (
                <div
                  className={`left-container-user ${selectedReceiver?.[0] === chatItem?.[0] ? 'selected' : ''}`}
                  key={chatItem?.[0]}
                  onClick={() => setSelectedReceiver(chatItem)}
                >
                  <Avatar style={{ backgroundColor: '#FF9A00' }}>{getFirstLetter(chatItem?.[1]?.userInfo?.displayName)}</Avatar>
                  <div>{chatItem?.[1]?.userInfo?.displayName}</div>
                </div>
              ))
            }
          </div>
          <div className='right-container'>
        <div className='chat-modal-header'>
          <Avatar style={{ backgroundColor: '#FF9A00' }}>{getFirstLetter(selectedReceiver?.[1]?.userInfo?.displayName)}</Avatar>
          <Typography
            className='chat-modal-header-title'
            variant="h6"
            component="h2"
          >
            {selectedReceiver?.[1]?.userInfo?.displayName}
          </Typography>
        </div>
        <Typography
          sx={{ mt: 2, }}
          className='chat-modal-description'
        >
          <ChatInterface
            messages={messages}
            receiver={selectedReceiver?.[1]?.userInfo}
            sender={user}
          />
        </Typography>
        <div className='chat-modal-sender'>
          <TextField
            type='text'
            onChange={(e) => setNewChat(e.target.value)}
            value={newChat}
            className='chat-modal-sender-input'
            onKeyDown={(e) => { if (e.key === 'Enter') onSendMsg(); }}
          />
          <Button onClick={onSendMsg}><i style={{ fontSize: '40px', color: '#FF9A00' }} className="fa-solid fa-paper-plane"></i></Button>
        </div>
          </div>
        </div>
      ) : <div>No Message received</div>
    }
    </>
  );
};

export default NewMessages;
