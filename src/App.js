import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import Global from "./scenes/global/global";
import Exam from "./scenes/exam";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import NewExam from "./scenes/newexam/NewExam";
import ExistingExam from "./scenes/existingexam/ExistingExam";
import ViewQuestion from "./scenes/viewquestions/ViewQuestion";
import PastExams from "./scenes/pastexams/PastExams";
import PublishResults from "./scenes/publishresults/PublishResults";
import Home from "./scenes/Home/Home";
import ForgotPass from "./scenes/forgotpassword/ForgotPass";
import EditExam from "./scenes/editexam/EditExam"
import EditProfile from "./scenes/editprofile/EditProfile";
import { Toaster } from 'react-hot-toast';
import StudentDetails from "./scenes/studentdetails/StudentDetails";
import GenerateQuestion from "./scenes/generateQuestion/GenerateQuestion";
import { useEffect, useRef, useState } from "react";
import Chat from "./scenes/chat";  
import NewDashboard from "./scenes/new_dashboard"
import AIMonitor from "./scenes/AIMonitor";

function App() {
  const ws = useRef(null)
  const [theme, colorMode] = useMode();
  const [websocket, setWebsocket] = useState(null)
  useEffect(() => {
    let url = "ws://192.168.215.83:6503"

    ws.current = new WebSocket(url, "json");

    ws.current.onopen = () => {
      console.log("connected");
    }
    ws.current.onclose = () => {
      console.log("dis connected");
    }

    ws.current.onmessage = (msg) => {
      var message = JSON.parse(msg.data);
      localStorage.setItem('message', JSON.stringify(message))
      const event = new StorageEvent("storage", {
        key: "message",
      });
      window.dispatchEvent(event);

      console.log("message", message);
    }
    // websocket = ws.current;
    setWebsocket(ws.current)
    console.log(websocket)
    // return () => {
    //   ws.current.close()
    // }
  }, [])
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      // element: <NewDashboard />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPass />,
    },
    {
      path: "global",
      element: <Global />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "aimon",
          element: <AIMonitor/>,
        },
        {
          path: "exam",
          element: <Exam ws={websocket} />,
        },
        {
          path: "new_exam",
          element: <NewExam />,
        },
        {
          path: "existing_exam",
          element: <ExistingExam />,
        },
        {
          path: "generate_question",
          element: <GenerateQuestion />,
        },
        {
          path: "edit_exams", element: <EditExam />
        },
        {
          path: "past_exams", element: <PastExams />
        },
        {
          path: "student_details", element: <StudentDetails />
        },
        {
          path: "publish_results", element: <PublishResults />
        },
        {
          path: "view_questions",
          element: <ViewQuestion />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "publish_results",
          element: <PublishResults />,
        },
        {
          path: "edit_profile",
          element: <EditProfile />,
        },
      ],
    },
  ]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <Toaster position="bottom-center" />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
