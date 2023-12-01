import {Modal, ModalHeader, ModalBody, ModalContent} from "@nextui-org/react";

interface TextModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    title: string;
    message: string | string[];
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

export default function TextModal(props: TextModalProps) {
    return (
        <Modal isOpen={props.visible} onClose={() => props.setVisible(false)} size={props.size}>
            <ModalContent>
                <ModalHeader>
                    <h3> {props.title} </h3>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <h4> {props.message} </h4>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}