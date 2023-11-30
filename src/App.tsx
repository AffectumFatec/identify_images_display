import useWebSocket from "react-use-websocket";

import "./App.css";
import { useState } from "react";

const WS_URL = "wss://acme-pi-79552883051b.herokuapp.com/wsairplane";

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
  report: {
    id: string;
    title: string;
    description: string;
    airplane_id: string;
    created_at: string;
  };
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
    <div className="bg-white border border-gray-200 flex justify-between px-3 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {!airplaneInfos?.airplane.id ? (
        <div className="flex w-full p-3 justify-center text-xl">
          Waiting for connections...
        </div>
      ) : (
        <div className="flex justify-around w-full">
          <div>
            <img
              className="rounded bg-cover self-center max-w-lg mt-4"
              src={airplaneInfos?.airplane.image}
              alt=""
            />

            <div className="p-5 flex flex-col items-center ">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {airplaneInfos?.airplane.refined_id}
                </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {airplaneInfos?.airplane.type}
              </p>
              <div className="mb-3 flex w-full justify-center gap-2 items-center font-normal text-gray-700 dark:text-gray-400">
                {airplaneInfos?.airplane.status}
                <p
                  className={`w-3 h-3 rounded-full ${
                    airplaneInfos?.airplane.status == "PENDING"
                      ? "bg-yellow-400"
                      : "hidden"
                  }`}
                ></p>
                <p
                  className={`w-3 h-3 rounded-full ${
                    airplaneInfos?.airplane.status == "BROKEN"
                      ? "bg-red-400"
                      : "hidden"
                  }`}
                ></p>
                <p
                  className={`w-3 h-3 rounded-full ${
                    airplaneInfos?.airplane.status == "GOOD"
                      ? "bg-green-400"
                      : "hidden"
                  }`}
                ></p>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-2xl my-8 font-bold">Reporte atual</h1>

            {!airplaneInfos.report.id ? (
              <div>Esse avião não possui nenhum reporte atualmente</div>
            ) : (
              <div className="shadow rounded border py-4 px-8 my-2 mx-2">
                <h2 className="font-semibold">{airplaneInfos?.report.title}</h2>
                <p>{airplaneInfos?.report.description}</p>
                <p>
                  {new Date(
                    airplaneInfos?.report.created_at
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl my-8 font-bold">Histórico de manutenção</h1>
            {airplaneInfos?.history.map((h) => (
              <div className="shadow rounded border py-4 px-8 my-2 mx-2">
                <h2 className="font-semibold">{h.title}</h2>
                <p>{h.description}</p>
                <p>{new Date(h.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <h1 className="text-4xl text-blue-500 fixed bottom-10 font-semibold right-20">
            Acme
          </h1>
        </div>
      )}
    </div>
  );
}

export default App;
