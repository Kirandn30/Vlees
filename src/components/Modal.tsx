import React, { ReactNode } from "react";
import { Modal, Button, Input, FormControl, HStack, Center, NativeBaseProvider } from "native-base";

export default function ModalCompo({ setModalVisible, modalVisible, children }: {
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    modalVisible: boolean,
    children: ReactNode
}) {
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    return <>
        <Modal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            size="full"
        >
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Contact Us</Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setModalVisible(false);
                        }}>
                            Cancel
                        </Button>
                        <Button onPress={() => {
                            setModalVisible(false);
                        }}>
                            Save
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    </>;
}
