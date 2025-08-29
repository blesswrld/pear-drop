import { usePeer } from "./hooks/usePeer";
import { ConnectionSetup } from "./components/ConnectionSetup";
import { FileTransfer } from "./components/FileTransfer";

/**
 * Главный компонент приложения.
 * Собирает хук и UI-компоненты вместе, управляя отображением
 * в зависимости от состояния соединения.
 */
function App() {
    const {
        peerId,
        setRemotePeerId,
        statusMessage,
        isConnected,
        receivedFile,
        setReceivedFile,
        progress,
        connectToPeer,
        connRef,
    } = usePeer();

    return (
        <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-4">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold mb-2">
                    Pear<span className="text-emerald-400">Drop</span>
                </h1>
                <p className="text-slate-400">Прямая P2P-передача файлов.</p>
            </header>
            <main className="w-full max-w-md">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
                    {/* Условный рендеринг: показываем либо UI подключения, либо UI передачи файла */}
                    {isConnected ? (
                        <FileTransfer
                            connRef={connRef}
                            statusMessage={statusMessage}
                            progress={progress}
                            receivedFile={receivedFile}
                            setReceivedFile={setReceivedFile}
                        />
                    ) : (
                        <ConnectionSetup
                            peerId={peerId}
                            statusMessage={statusMessage}
                            setRemotePeerId={setRemotePeerId}
                            connectToPeer={connectToPeer}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
