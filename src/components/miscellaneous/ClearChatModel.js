import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const ClearChatModal = ({
  children,
  setMessages,
  UserWhomDateIsToBeShownInModal,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dark, user, selectedChat, host } = ChatState();
  const toast = useToast();
  //   console.log(selectedChat._id);

  const clearChat = async () => {
    const response = await fetch(
      `${host}/api/message/del/${selectedChat._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();
    setMessages([]);
    if (json.Success === "Messages Has Been Deleted") {
      toast({
        title: "Messages Has Been Deleted Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    onClose();
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
          colorScheme="blue"
          size="sm"
        >
          Clear Chat
        </Button>
      )}
      <Modal onClose={onClose} size={"xs"} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to clear all the messages of this chat?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button style={{ marginRight: "40%" }} onClick={clearChat}>
              Clear
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClearChatModal;
