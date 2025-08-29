import { usePeer } from "./hooks/usePeer";
import { ConnectionSetup } from "./components/ConnectionSetup";
import { FileTransfer } from "./components/FileTransfer";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Главный компонент приложения.
 * Собирает хук и UI-компоненты вместе, управляя отображением
 * в зависимости от состояния соединения.
 */
function App() {
    const { isConnected, ...peerProps } = usePeer();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <header className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-extrabold mb-2"
                >
                    Pear<span className="text-success">Drop</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-default-500"
                >
                    Прямая P2P-передача файлов.
                </motion.p>
            </header>
            <main className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isConnected ? "transfer" : "setup"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Условный рендер */}
                        {isConnected ? (
                            <FileTransfer {...peerProps} />
                        ) : (
                            <ConnectionSetup {...peerProps} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export default App;
