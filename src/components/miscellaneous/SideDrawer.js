import {useState } from 'react'
import { Button} from '@chakra-ui/react'
import { Box, Text } from "@chakra-ui/layout";
import { MenuButton, Tooltip } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from '../../Context/ChatProvider';
import axios from "axios";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks"
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading "
import UserListItem from "../UserAvatar/UserListItem"
import { Spinner } from "@chakra-ui/spinner";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import {
    Menu,
    MenuDivider,
    MenuItem,
    MenuList,
  } from "@chakra-ui/menu";
  import { getSender } from "../../config/ChatLogics";
import {Effect} from "react-notification-badge"  
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const {user , setSelectedChat , chats, setChats, notification, setNotification, dark, setDark, host} = ChatState();
    console.log(searchResult)
    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const handleSearch = async () =>{
      if (!search) {
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }

      try {
        setLoading(true);
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const { data } = await axios.get(`${host}/api/user?search=${search}`, config);
  
        setLoading(false);
        console.log(data);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }

    const accessChat = async (userId) => {
      try {
        setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${host}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    
    const darkmode = () =>{
      setDark(!dark)
    }
    console.log(notification)
  return (
    <>
     <Box  d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={dark===false?"white":"black"}
        color={dark===false?"black":"white"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen} >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
            <Menu>
            <Button  bg={dark===false?"#1da1f2":"#38b2ac"} color="white" size='sm' onClick={darkmode}>{dark===false?"Dark":"Bright"}</Button>
                <MenuButton p={1}>
                  <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
                    <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
                <MenuList bg="black" pl={2}>
                  {!notification.length && "no new messages"}
                  {notification.map((notif) => (
                     <MenuItem
                     key={notif._id}
                     onClick={() => {
                       setSelectedChat(notif.chat);
                       setNotification(notification.filter((n) => n !== notif));
                     }}
                   >
                     {notif.chat.isGroupChat
                       ? `New Message in ${notif.chat.chatName}`
                       : `New Message from ${getSender(user, notif.chat.users)}`}
                   </MenuItem>
                  ))}
                </MenuList>
            </Menu>
            <Menu>
            <MenuButton as={Button} bg={dark===false?"white":"black"} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg={dark===false?"white":"black"}>
              <ProfileModal user={user}>
                <MenuItem bg={dark===false?"white":"black"}>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem bg={dark===false?"white":"black"} onClick={logoutHandler} >Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
     </Box>

     <Drawer placement="left" onClose={onClose}  isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={dark===false?"white":"black"} color={dark===false?"black":"white"}>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button bg={dark===false?"#e8e8e8":"#202020"} onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody> 
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer