import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from './Context/ChatProvider';

function App() {
  const { darkTheme } = ChatState();
  return (
    <div className={`${darkTheme ? "bg-[#1F1E21]" : "bg-[#faf1ed]"} App min-h-[100vh]`}>
      <Routes>
        <Route path='/' Component={Homepage} exact />
        <Route path='/chats' Component={Chatpage} exact />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
