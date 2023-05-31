import { Popover, Button, Box } from "native-base";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-svg";
import { Firebase } from "../../config";
import { useNavigation } from "@react-navigation/native";
import React from "react";

export function PopOverCompo({ children, }: { children: ReactNode }) {
    const navigate = useNavigation()
    return <Box className="w-fit" alignItems="center">
        <Popover trigger={triggerProps => {
            return <Pressable {...triggerProps}>{children}</Pressable>;
        }}
        >
            <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                {/* <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Header>Delete Customer</Popover.Header>
                <Popover.Body>
                    This will remove all data relating to Alex. This action cannot be
                    reversed. Deleted data can not be recovered.
                </Popover.Body>
                <Popover.Footer justifyContent="flex-end">
                    <Button.Group space={2}>
                        <Button colorScheme="coolGray" variant="ghost">
                            Cancel
                        </Button>
                        <Button colorScheme="danger">Delete</Button>
                    </Button.Group>
                </Popover.Footer> */}
                <Popover.Arrow />
                <Popover.Body>
                    <Button
                        size="xs"
                        colorScheme="danger"
                        onPress={() => {
                            //@ts-ignore
                            Firebase.auth().signOut().then(() => navigate.navigate("Home"))
                        }}
                    >Sign Out</Button>
                </Popover.Body>

            </Popover.Content>
        </Popover>
    </Box>;
}