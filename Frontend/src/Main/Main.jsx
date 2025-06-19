import ChatWindow from "./components/ChatWindow/ChatWindow";
import LeftBar from "./components/LeftBar/LeftBar";

const Main = () => {
  return (
    <div className="main">
      <LeftBar />
      <ChatWindow />
    </div>
  );
}

export default Main;