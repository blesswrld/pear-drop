import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import toast from "react-hot-toast";

// @ts-ignore
type DataConnection = any;

type Metadata = {
    type: "metadata";
    name: string;
    size: number;
    fileType: string;
};

/**
 * Кастомный хук для управления всей логикой PeerJS соединения.
 * Инкапсулирует состояние и методы для P2P-взаимодействия.
 */
export const usePeer = () => {
    // Состояния, напрямую влияющие на UI
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [statusMessage, setStatusMessage] = useState("Инициализация...");
    const [isConnected, setIsConnected] = useState(false);
    const [receivedFile, setReceivedFile] = useState<{
        url: string;
        name: string;
    } | null>(null);
    const [progress, setProgress] = useState(0);

    // Refs для хранения экземпляров Peer и DataConnection без вызова ререндеров
    const peerRef = useRef<Peer | null>(null);
    const connRef = useRef<DataConnection | null>(null);

    // 1. Инициализация PeerJS при первом рендере
    useEffect(() => {
        // Динамический импорт решает проблемы с React Strict Mode
        import("peerjs").then(({ default: Peer }) => {
            const newPeer = new Peer();
            peerRef.current = newPeer;

            // Срабатывает при успешном подключении к сигнальному серверу PeerJS
            newPeer.on("open", (id) => {
                setPeerId(id);
                setStatusMessage("Готов к работе. Поделитесь ID.");
            });

            // Срабатывает при входящем соединении от другого пира
            newPeer.on("connection", (connection) => {
                // --- Немедленно очищаем старые слушатели ---
                if (connRef.current) {
                    connRef.current.removeAllListeners();
                }
                connRef.current = connection;
                setupConnectionEvents(connection);
            });

            newPeer.on("error", (err) => {
                console.error("PeerJS Error:", err);
                if (err.type === "peer-unavailable") {
                    setStatusMessage("Пользователь с таким ID не найден.");
                }
            });
        });

        // Очистка при размонтировании компонента
        return () => {
            peerRef.current?.destroy();
        };
    }, []);

    // 2. Настройка обработчиков для соединения
    const setupConnectionEvents = (conn: DataConnection) => {
        conn.removeAllListeners();

        conn.on("open", () => {
            setIsConnected(true);
            toast.success("Соединение установлено!");
        });

        conn.on("close", () => {
            toast.error("Соединение разорвано.");
            setIsConnected(false);
            setStatusMessage("Готов к работе. Поделитесь ID.");
        });

        let receivedChunks: ArrayBuffer[] = [];
        let metadata: Metadata | null = null;

        // Обработка входящих данных
        // @ts-ignore
        conn.on("data", (data: any) => {
            if (data.type === "metadata") {
                metadata = data;
                receivedChunks = [];
                setProgress(0);
                // @ts-ignore
                setStatusMessage(`Получение файла: ${metadata.name}`);
            } else {
                receivedChunks.push(data);
                if (metadata) {
                    const receivedSize = receivedChunks.reduce(
                        (acc, chunk) => acc + chunk.byteLength,
                        0
                    );
                    setProgress(
                        Math.round((receivedSize / metadata.size) * 100)
                    );
                    if (receivedSize === metadata.size) {
                        const fileBlob = new Blob(receivedChunks, {
                            type: metadata.fileType,
                        });
                        const url = URL.createObjectURL(fileBlob);
                        toast.success(`Файл "${metadata.name}" получен!`);
                        setReceivedFile({ url, name: metadata.name });
                        setProgress(0);
                    }
                }
            }
        });
    };

    // 3. Функция подключения к другому пиру
    const connectToPeer = () => {
        if (!peerRef.current || !remotePeerId) return;
        setStatusMessage(`Подключение к ${remotePeerId}...`);

        // --- Немедленно очищаем старые слушатели ---
        if (connRef.current) {
            connRef.current.removeAllListeners();
        }

        const conn = peerRef.current.connect(remotePeerId);
        connRef.current = conn;
        setupConnectionEvents(conn);
    };

    // --- функция для разрыва соединения ---
    const disconnectPeer = () => {
        connRef.current?.close();
    };

    // Возвращаем все необходимые данные и функции для использования в UI
    return {
        peerId,
        remotePeerId,
        setRemotePeerId,
        statusMessage,
        isConnected,
        receivedFile,
        setReceivedFile,
        progress,
        connectToPeer,
        connRef, // Отдаем ref для отправки файла
        onDisconnect: disconnectPeer,
    };
};
