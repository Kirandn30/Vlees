import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'

export default function HeaderLayout({ children }: { children: ReactNode }) {
    return (
        <View
            className='min-h-[60px] bg-slate-100'
            style={styles.shadowProp}
        >
            {children}
        </View >
    )
}

const styles = StyleSheet.create({
    shadowProp: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
});