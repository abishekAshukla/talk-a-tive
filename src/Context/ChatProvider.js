import React , { createContext , useContext, useState, useEffect} from 'react'
import {useHistory} from "react-router-dom"
import axios from "axios";

const ChatContext = createContext();

const ChatProvider = ({ children}) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    const [dark, setDark] = useState(false)
    const host = "https://shukla-apis.glitch.me"

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo)

        if (!userInfo) {
            history.push("/")
        }
    }, [history])  // it will run whenever history changes

    const fetchTheChats = async ()=>{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("https://inotebookbackend.herokuapp.com/api/chat", config);
      setChats(data);
    }

    const fetchChats = async () => {
      // console.log(user._id);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const { data } = await axios.get("https://inotebookbackend.herokuapp.com/api/chat", config);
        setChats(data);
      } catch (error) {
      }
    };

  return (
    <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat , chats, setChats, notification, setNotification, dark, setDark, host, fetchTheChats, fetchChats}}>{children}</ChatContext.Provider>
  )
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider