export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const getSender = (loggedUser, users) => {
  // if (users.length === 1) {
  //   return "Deleted"
  // }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  // if (users.length === 1) {
  //   let userHasDeleteThisChat = [{name:'User has deleted this chat', email:'User has deleted this chat', pic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGm4IWXnBVrI_I9qXhfw_vIhZKYfLh1NoMk5ACNs9L_UrF6wQIF50wQrk_Bv5PfE66D_4&usqp=CAU'}];
  //   return userHasDeleteThisChat[0]
  // }
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
// const phonenumber = "1928304958";
const phonenumber = "8793831256";

export const checkUserExistence = async () => {
  const response = await fetch(
    "https://inotebookbackend.herokuapp.com/api/user/check",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phonenumber }),
    }
  );
  if (response.status === 400) {
    console.log("user already exists");
  }
  const json = await response.json();
  if (json.message === "You can signup with this") {
    console.log("yo ho");
  }
};
