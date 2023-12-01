import {Progress, Modal, ModalHeader, ModalBody, CircularProgress, ModalContent} from "@nextui-org/react";

interface LoadingModalProps {
    visible: boolean;
    title: string;
}

export default function LoadingModal(props: LoadingModalProps) {
    return (
        <Modal isOpen={props.visible} hideCloseButton={true} isDismissable={true}>
            <ModalContent>
                <ModalHeader>
                    <h3> {props.title} </h3>
                </ModalHeader>
                <ModalBody>
                    <div style={{
                        'display': 'flex',
                        'justifyContent': 'center',
                    }}>
                        <CircularProgress/>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}