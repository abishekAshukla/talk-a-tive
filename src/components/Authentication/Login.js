import React from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const { host } = ChatState();
  // console.log(`${host}/api/user/login`)

  const handleClick = () => {
    setShow(!show);
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${host}/api/user/login`,
        {
          email,
          password
        },
        config
      );
      console.log(data);

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type={show ? "text" : "password"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={"blue"}
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading = {loading}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme={"red"}
        width={"100%"}
        onClick={() => {
          setEmail("guest@testing.com");
          setPassword("96782Guest.com");
        }}
      >
        Get Guest1 User Credentials
      </Button>
      <Button
        variant={"solid"}
        colorScheme={"red"}
        width={"100%"}
        onClick={() => {
          setEmail("guest2@testing.com");
          setPassword("96782Guest.com");
        }}
      >
        Get Guest2 User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
