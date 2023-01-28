import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const DeleteChatModal = ({ children, UserWhomDateIsToBeShownInModal }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dark, selectedChat, user, setSelectedChat , fetchChats, host} = ChatState();

  const [chatId, setChatId] = useState("gffd43423fwdw"); //chatId cannot be empty, it's giving error
  const [userId, setUserId] = useState(user._id);

  const deleteChat = async () => {
    const response = await fetch(
      `${host}/api/chat/delchat/${selectedChat._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      }
    );
    const json = await response.json();
    onClose();
    console.log(json);
    fetchChats();
    setSelectedChat();
  };
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Button
          onClick={onOpen}
          style={{
            marginRight: "20%",
            display:
              UserWhomDateIsToBeShownInModal.name === user.name ? "none" : "",
          }}
          colorScheme="red"
          size="sm"
        >
          Delete Chat
        </Button>
      )}
      <Modal onClose={onClose} size={"xs"} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to delete this chat?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button style={{ marginRight: "40%" }} onClick={deleteChat}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteChatModal;
