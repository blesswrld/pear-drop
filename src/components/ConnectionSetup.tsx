interface ConnectionSetupProps {
    peerId: string;
    statusMessage: string;
    setRemotePeerId: (id: string) => void;
    connectToPeer: () => void;
}

/**
 * Компонент, отвечающий за UI до установки P2P-соединения.
 * Отображает ID пользователя и форму для подключения к другому пиру.
 */
export const ConnectionSetup = ({
    peerId,
    statusMessage,
    setRemotePeerId,
    connectToPeer,
}: ConnectionSetupProps) => (
    <>
        <div className="text-center">
            <p className="text-sm text-slate-400">Ваш ID:</p>
            <p className="font-mono text-emerald-400 break-all">
                {peerId || "Генерация..."}
            </p>
        </div>
        <div className="flex items-center gap-4">
            <hr className="flex-grow border-slate-700" />
            <span className="text-slate-500 text-sm">ПОДКЛЮЧИТЬСЯ К</span>
            <hr className="flex-grow border-slate-700" />
        </div>
        <div className="space-y-2">
            <input
                type="text"
                placeholder="Введите ID другого пользователя..."
                onChange={(e) => setRemotePeerId(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4"
            />
            <button
                onClick={connectToPeer}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg"
            >
                Подключиться
            </button>
        </div>
        {statusMessage && (
            <p className="text-center text-yellow-400 text-sm mt-4">
                {statusMessage}
            </p>
        )}
    </>
);
