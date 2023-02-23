import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { authentication } from "../../firebase-config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ChatState } from "../../Context/ChatProvider";
// import { checkUserExistence } from "../../config/ChatLogics";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [phonenumber, setphonenumber] = useState("");
  const [stateofsignup, setStateofsignup] = useState("submit");
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const { host } = ChatState();

  const handleClick = () => {
    setShow(!show);
  };
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // console.log(pics);

    // if (a === 3) {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dw6ehse4v");
      fetch("https://api.cloudinary.com/v1_1/dw6ehse4v/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!pic) {
      setPic("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
    }
    if (!name || !email || !phonenumber|| !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      // console.log(name+" "+email+" "+phonenumber+" "+password+" "+pic);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${host}/api/user/createuserforchat`,
        {
          name,
          email,
          phonenumber,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(data);
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
      console.log(error)
      setLoading(false);
    }
  };
  const generateRecaptcha = () =>{
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, authentication );
  }
  const requestOTP = () => {
      generateRecaptcha()
      let appVerifier = window.recaptchaVerifier
      signInWithPhoneNumber(authentication, "+91"+phonenumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setStateofsignup("verify");
      }).catch((error) => {
        if (error = "FirebaseError: Firebase: Error (auth/too-many-requests).") {
          toast({
            title: "Multiple attempt on this phone number, Please try later",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        console.log(error);
      });
  }
  const verifyOTP = () =>{
    if (otp.length !== 6) {
      toast({
        title: "Please enter a valid number!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else{
      let confirmationResult = window.confirmationResult;
      confirmationResult.confirm(otp).then((result) => {
        const user = result.user;
        console.log(user);
        setStateofsignup("submit");
      }).catch((error) => {
        if (error = "FirebaseError: Firebase: Error (auth/invalid-verification-code).") {
          toast({
            title: "Invalid OTP",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        console.log(error);
      });
    }
  }
  const generateRecaptchaResend = () =>{
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-resend-container', {
      'size': 'invisible',
      'callback': (response) => {
      }
    }, authentication );
  }
  const resendotp = (e) => {
    e.preventDefault()
    generateRecaptchaResend()
    let appVerifier = window.recaptchaVerifier
    signInWithPhoneNumber(authentication, "+91"+phonenumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      setStateofsignup("verify");
    }).catch((error) => {
      if (error = "FirebaseError: Firebase: Error (auth/too-many-requests).") {
        toast({
          title: "Multiple attempt on this phone number, Please try later",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      console.log(error);
    });
  }
  const checkUserExistence = async () => {
    if (phonenumber.length !== 10) {
      toast({
        title: "Please enter a valid number!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const response = await fetch(
      `${host}/api/user/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phonenumber }),
      }
    );
    if (response.status === 400) {
      toast({
        title: "User already exists with this phone number",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const json = await response.json();
    if (json.message === "You can signup with this") {
      requestOTP();
      console.log("you can signup");
    }
  };


  return (
    <>
    <div id="recaptcha-container"></div>  {/* div for recaptha , necessary to send otp */}
    <div id="recaptcha-resend-container"></div>
      <VStack
        style={{ display: stateofsignup === "submit" ? "" : "none" }}
        spacing={"5px"}
      >
        <FormControl
          id="first-name"
          isRequired
          style={{ marginBottom: "10px" }}
        >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter your name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </FormControl>
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
        <FormControl id="phoennumber" isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            placeholder="Enter your phone Number"
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
            value={phonenumber}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Create Password</FormLabel>
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
        <FormControl id="confirmpassword" isRequired>
          <FormLabel>Confirm password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Re-enter your password"
              onChange={(e) => {
                setConfirmpassword(e.target.value);
              }}
              value={confirmpassword}
              type={"text"}
            />
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your picture</FormLabel>
          <Input
            type={"file"}
            onChange={(e) => {
              postDetails(e.target.files[0]);
            }}
          />
        </FormControl>

        <Button
          colorScheme={"blue"}
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign up
        </Button>
      </VStack>
      {/* ****************** div for otp ******************** */}
      <div style={{ display: stateofsignup === "otp" ? "" : "none" }}>
        <FormControl id="first-name" style={{ marginBottom: "10px" }}>
          <FormLabel>Enter Phone Number</FormLabel>
          <Input
            placeholder="Enter your number"
            type={"number"}
            onChange={(e) => {
              setphonenumber(e.target.value);
            }}
            value={phonenumber}
          />
        </FormControl>

        <Button
          colorScheme={"blue"}
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={checkUserExistence}
          isLoading={loading}
        >
          Get OTP
        </Button>
      </div>

      {/* *************** div for verify ************************* */}

      <div style={{ display: stateofsignup === "verify" ? "" : "none" }}>
        <FormControl style={{ marginBottom: "10px" }}>
          <FormLabel>Enter OTP sent to {phonenumber}</FormLabel>
          <Input
            placeholder="Enter your OTP"
            type={"number"}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            value={otp}
          />
        </FormControl>

        <Button onClick={verifyOTP} colorScheme={"blue"} width={"100%"} style={{ marginTop: 15 }}>
          Verify
        </Button>
        <Button onClick={resendotp} colorScheme={"blue"} width={"100%"} style={{ marginTop: 15 }}>
          Resend
        </Button>
      </div>
      {/* </VStack> */}
    </>
  );
};

export default Signup;
