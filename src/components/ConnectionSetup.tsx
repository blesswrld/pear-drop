import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";

interface ConnectionSetupProps {
    peerId: string;
    statusMessage: string;
    setRemotePeerId: (id: string) => void;
    connectToPeer: () => void;
}

export const ConnectionSetup = ({
    peerId,
    statusMessage,
    setRemotePeerId,
    connectToPeer,
}: ConnectionSetupProps) => (
    <Card className="max-w-md w-full bg-content1/70 backdrop-blur-md">
        <CardHeader className="flex-col items-start px-6 pt-6">
            <h2 className="text-2xl font-bold">Подключиться</h2>
            <p className="text-small text-default-500">{statusMessage}</p>
        </CardHeader>
        <CardBody className="space-y-6 p-6">
            <div className="text-center p-4 bg-default-100 rounded-lg">
                <p className="text-sm text-default-500">
                    Ваш ID для подключения:
                </p>
                <p className="font-mono text-success break-all mt-1">
                    {peerId || "Генерация..."}
                </p>
            </div>

            <div className="flex items-center">
                <Divider className="flex-1" />
                <span className="px-4 text-xs text-default-500">ИЛИ</span>
                <Divider className="flex-1" />
            </div>

            <div className="space-y-3">
                <Input
                    type="text"
                    label="ID другого пользователя"
                    placeholder="Введите ID..."
                    onValueChange={setRemotePeerId}
                />
                <Button
                    color="primary"
                    onPress={connectToPeer}
                    className="w-full font-bold"
                >
                    Подключиться
                </Button>
            </div>
        </CardBody>
    </Card>
);
