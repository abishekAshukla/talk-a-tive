import React from "react";
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
import DeleteChatModal from "./DeleteChatModal";
import ClearChatModal from "./ClearChatModel";

const ProfileModal = ({ user, children, setMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { dark, users } = ChatState();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          bg={dark === false ? "#e8e8e8" : "#202020"}
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h="410px"
          bg={dark === false ? "white" : "#101010"}
          color={dark === false ? "black" : "white"}
          style={{ border: dark === false ? "" : "2px solid white" }}
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
              <ClearChatModal setMessages={setMessages} UserWhomDateIsToBeShownInModal={user}/>
              <DeleteChatModal UserWhomDateIsToBeShownInModal={user}/>
            <Button bg={dark === false ? "" : "black"} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
