import { useState } from "react";
import { usePeer } from "./hooks/usePeer";
import { ConnectionSetup } from "./components/ConnectionSetup";
import { FileTransfer } from "./components/FileTransfer";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { Button } from "@nextui-org/button";
import { ArrowLeft } from "lucide-react";
import { SupportedFormats } from "./components/SupportedFormats";
import { AnimatePresence, motion } from "framer-motion";

function App() {
    const peerProps = usePeer();
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleConfirmDisconnect = () => {
        peerProps.onDisconnect();
        setConfirmModalOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <AnimatePresence>
                {peerProps.isConnected && (
                    <motion.div
                        className="absolute top-6 left-6"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => setConfirmModalOpen(true)}
                            aria-label="Вернуться"
                        >
                            <ArrowLeft className="h-5 w-5 text-default-500" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        key={peerProps.isConnected ? "transfer" : "setup"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {peerProps.isConnected ? (
                            <FileTransfer {...peerProps} />
                        ) : (
                            <ConnectionSetup {...peerProps} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {!peerProps.isConnected && <SupportedFormats />}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmDisconnect}
            />
        </div>
    );
}

export default App;
