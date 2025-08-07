import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Panel */}
            <div className="hidden lg:flex flex-col w-1/2 px-0 py-0 bg-ecocart-600">
                <h1 className="text-4xl font-extrabold tracking-tight text-white mt-12 mb-8  text-center">
                    Welcome to Ecocart
                </h1>
                <div className="flex-1 flex items-center justify-center">
                    <img
                        src="/assets/logo.png"
                        alt="Ecocart"
                        className="w-full h-full max-w-[500px] max-h-[500px] object-contain mx-auto"
                    />
                </div>
            </div>
            {/* Right Panel */}
            <div className="flex flex-1 items-center justify-center bg-neutral-200 px-4 py-12 sm:px-6 lg:px-8">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;