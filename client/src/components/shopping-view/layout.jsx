import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-neutral-200 overflow-hidden min-h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full bg-neutral-200">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
