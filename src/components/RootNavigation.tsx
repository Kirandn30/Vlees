import React, { RefObject } from 'react';

export const navigationRef: RefObject<any> = React.createRef();

export function navigate(name: string, params?: object): void {
    navigationRef.current?.navigate(name, params);
}
