import { useState } from "react";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import "./App.css";

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(
!!localStorage.getItem("token")
);

return (
<>
{isLoggedIn ? ( <ChatPage />
) : (
<Login
onLogin={() => setIsLoggedIn(true)}
/>
)}
</>
);
}

export default App;
