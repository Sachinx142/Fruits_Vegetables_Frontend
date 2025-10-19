import React, { Suspense } from "react";
import ProductEdit from "./ProductEdit";

const Page = () => {
  return (
    <Suspense>
      <ProductEdit />
    </Suspense>
  );
};

export default Page;
