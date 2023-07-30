// frontend\src\screens\HomeScreen.tsx

import { useEffect, useState } from "react";

import { readTop } from "../services/api";
import { Loader } from "../components/common/Loader";
import { Message } from "../components/common/Message";
import { setExceptionError } from "../utils";

export const HomeScreen: React.FC = () => {
  const [topStatus, setTopStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const readTopAndSet = async () => {
    setIsLoading(true);
    try {
      setTopStatus(await readTop());
    } catch (error: unknown) {
      setExceptionError(error, setMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    readTopAndSet();
  }, []);

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Home
      </h1>
      {isLoading && <Loader />}
      {message && <Message variant="danger">{message}</Message>}
      {topStatus && <Message variant="success">{topStatus}</Message>}
      {topStatus == "" && (
        <Message variant="danger">API is not running....</Message>
      )}
    </>
  );
};
