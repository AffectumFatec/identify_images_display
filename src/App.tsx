import useWebSocket from "react-use-websocket";
import "./App.css";
import { useState } from "react";

const WS_URL = "ws://127.0.0.1:8000/wsairplane";

type AiplaneType = {
  airplane: {
    id: string;
    type: string;
    status: string;
    refined_id: string;
    created_at: string;
    image: string;
  };
  history: {
    id: string;
    title: string;
    description: string;
    airplane_id: string;
    user_id: string;
    created_at: string;
  }[];
};

function App() {
  const [airplaneInfos, setAirplaneInfos] = useState<AiplaneType>();
  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onMessage(e) {
      console.log(e.data);
      setAirplaneInfos(JSON.parse(e.data));
    },
  });

  return (
      <div className="roundedh-screen w-full ml-0 flex justify-between px-3 shadow bg-black dark:bg-gray-800">
        <div className="ml-full flex flex-col items-center">
          <img
            className="ml-0 rounded-t-lg bg-cover self-center max-w-lg mt-5 h-364"
            src={airplaneInfos?.airplane.image}
            alt=""
          />
          <div className="p-5 text-center">
            <a href="#" className="text-white">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {airplaneInfos?.airplane.refined_id}
              </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {airplaneInfos?.airplane.type}
            </p>
            <div className="flex justify-center items-center space-x-2">
              {airplaneInfos?.airplane.status === "Em manutenção" && (
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              )}
              {airplaneInfos?.airplane.status === "Quebrado" && (
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
              )}
              {airplaneInfos?.airplane.status === "Bom" && (
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              )}
              <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                {airplaneInfos?.airplane.status}
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-md p-4">
          <h1 className="text-2xl my-4 font-bold text-gray-900 dark:text-white">
            Histórico de Manutenção
          </h1>
          {airplaneInfos?.history.map((h) => (
            <div
              key={h.id}
              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {h.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-400">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
  );
}

export default App;
