import { Runtime } from "@src/enum/runtime.enum";

export const RuntimeExtensions: { [key in Runtime]: string } = {
    [Runtime.python]: 'py',
    [Runtime.node]: 'js',
    [Runtime.blank]: ''
};