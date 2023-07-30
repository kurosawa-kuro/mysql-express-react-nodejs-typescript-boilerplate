// frontend\src\screens\HomeScreen.tsx

import { Message } from "../components/common/Message";

export const InformationScreen: React.FC = () => {
  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Information
      </h1>
      <Message variant="info">Information Data</Message>
    </>
  );
};
