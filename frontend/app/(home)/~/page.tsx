"use client";

import { useEffect, useState } from "react";
import DirectoryTreeView from "../../../components/dirTree";

const page = () => {
  const [message, setMessage] = useState<string>();
  useEffect(() => {}, []);

  return (
    <div className="h-full w-full p-8">
      <h1 className="text-4xl">Home</h1>
      {/* <DirectoryTreeView /> */}
    </div>
  );
};

export default page;
