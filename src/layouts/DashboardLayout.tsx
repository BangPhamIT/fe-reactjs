import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";

export default function DashboardLayout() {
    return (
        <ThemeProvider>
            <div className="h-screen w-full bg-blue-gray-50/50 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto min-w-0 min-h-0">
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    );
}
