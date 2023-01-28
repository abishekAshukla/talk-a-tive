import './App.css';
import {Route} from"react-router-dom"
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';
import { ChatState }  from './Context/ChatProvider';

function App() {

  const {dark} =
    ChatState();

  return (
    // <div style={{backgroundColor:'#1da1f2'}} className='App'>
    <div style={{backgroundColor: dark===false?'#1da1f2':'#202020'}} className='App'>
      <Route exact path="/" component={Homepage}/>
      <Route exact path="/chats" component={ChatPage}/>
    </div>
  );
}

export default App;
