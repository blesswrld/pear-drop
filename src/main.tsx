import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react"; // <-- Импорт провайдера
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* Оборачиваем App в NextUIProvider */}
        <NextUIProvider>
            {/* Указываем, что темная тема - по умолчанию */}
            <main className="dark text-foreground bg-background">
                <App />
                <Toaster
                    toastOptions={{
                        className:
                            "bg-content1 text-foreground border border-default-200 shadow-lg rounded-lg",
                    }}
                />
            </main>
        </NextUIProvider>
    </React.StrictMode>
);
