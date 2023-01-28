import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useEffect } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user, dark } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
            <div
              style={{ display: "flex" }}
              key={m._id}
              onClick={()=>{if (m.content.slice(0,4)==="http") {
                window.open(m.content)
              }}}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    // m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    m.sender._id === user._id
                      ? dark === false
                        ? "#bee3f8"
                        : "black"
                      : dark === false
                      ? "#b9f5d0"
                      : "black"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  height: m.content.slice(0,4)==="http" ? "100px" : "",
                }}
              >
                {m.content.slice(0,4)==="http"
                  ? "Click To View This Media File"
                  : m.content}
                <div
                  style={{
                    display: m.content.slice(0,4)==="http" ? "" : "none",
                    marginTop: "10px",
                    textAlign: "center",
                    fontWeight: "bolder",
                  }}
                >
                  Media
                </div>
              </span>
            </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
