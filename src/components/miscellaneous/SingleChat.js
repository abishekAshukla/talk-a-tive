import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Button, ButtonGroup, Textarea } from "@chakra-ui/react";

import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { ChatState } from "../../Context/ChatProvider";
import "./style.css";

const ENDPOINT = "https://shukla-apis.glitch.me"
// const ENDPOINT = "https://backendapis.vercel.app"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  // const [mediaFileToSend, setMediaFileToSend] = useState()
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    dark,
    host
  } = ChatState();

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    } // do nothing

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${host}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      console.log(messages);
      console.log(selectedChat._id);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${host}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // const data = [newMessage ,selectedChat._id ]
        // socket.emit("new message", data);
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const sendMessage1 = async (event) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${host}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const postDetails = async (media) => {
    // setLoading(true);
    if (media === undefined) {
      toast({
        title: "Please Select an Image or Video or PDF!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (media.type === "image/jpeg" || media.type === "image/png") {
      const data = new FormData();
      data.append("file", media);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dw6ehse4v");
      fetch("https://api.cloudinary.com/v1_1/dw6ehse4v/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async (data) => {
          let string = data.url.toString();
          let actualString = string.slice(7);
          socket.emit("stop typing", selectedChat._id);
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data1 } = await axios.post(
              `${host}/api/message`,
              {
                content: "https://"+actualString,
                chatId: selectedChat._id,
              },
              config
            );
            console.log(data1)
        //     socket.emit("new message", data1);
        // setMessages([...messages, data1]);
          } catch (error) {
            console.log(error)
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
          // console.log(data);
          // setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setLoading(false);
      return;
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const sendMedia = async (media) => {
    setLoading(true)
    if (media === undefined) {
      toast({
        title: "Please Select an Image or Video or PDF!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    const data = new FormData();
      data.append("file", media);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dw6ehse4v");
      fetch("https://api.cloudinary.com/v1_1/dw6ehse4v/auto/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async (data1) => {
          let string = data1.url.toString();
          let actualString = string.slice(7);
          console.log(actualString)
          setNewMessage(actualString)

          socket.emit("stop typing", selectedChat._id);
          const config = {
                  headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                };
                setNewMessage("");
                const { data } = await axios.post(
                  `${host}/api/message`,
                  {
                    content: "https://"+actualString,
                    chatId: selectedChat._id,
                  },
                  config
                );
                console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
                setLoading(false)
        })
        
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              bg={dark === false ? "#e8e8e8" : "#202020"}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  setMessages={setMessages}
                  user={getSenderFull(user, selectedChat.users, selectedChat)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg={dark === false ? "#e8e8e8" : "#202020"}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div style={{ display: "flex" }}>
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      height={50}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <Input
                  variant="filled"
                  bg={dark === false ? "#e0e0e0" : "black"}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
              <Button
                onClick={sendMessage1}
                style={{ marginTop: "15px", marginLeft: "5px" }}
                colorScheme="teal"
                size="sm"
              >
                Send
              </Button>
              {/* <input type="file" id="imgupload" style="display:none"/>  */}
              {/* <Input
                type={"file"}
                className=""
                style={{ display: "none" }}
                onChange={(e) => {
                  postDetails(e.target.files[0]);
                }}
              /> */}
              {/* <Button
                // onClick={}
                style={{ marginTop: "15px", marginLeft: "5px" }}
                colorScheme="teal"
                size="sm"
              >
                Media
              </Button> */}
              <label for="file-upload" class="custom-file-upload">
                <i class="fa fa-cloud-upload"></i> Media
              </label>
              <input id="file-upload" type="file" onChange={(e) =>{
                sendMedia(e.target.files[0]);
              }} />
            </div>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
