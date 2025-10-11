import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
}: ConfirmationModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            backdrop="blur"
            classNames={{
                base: "bg-content1/70 border border-default-200 m-4 sm:m-0",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
            placement="center"
        >
            <ModalContent>
                {(close) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Подтвердите действие
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-sm">
                                {" "}
                                Вы уверены, что хотите вернуться на главный
                                экран? Это разорвет ваше текущее соединение.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={close}
                            >
                                Отмена
                            </Button>
                            <Button color="primary" onPress={onConfirm}>
                                Да, вернуться
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
