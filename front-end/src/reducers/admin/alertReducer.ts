/* eslint-disable indent */
import type { AlertAction, AlertState } from '~/types'

export const initialState: AlertState = {
    open: false,
    message: '',
    severity: 'success'
}
export function alertReducer(state: AlertState, action: AlertAction): AlertState {
    switch (action.type) {
        case 'SHOW_ALERT':
            return { open: true, message: action.payload.message, severity: action.payload.severity }
        case 'HIDE_ALERT':
            return { ...state, open: false }
        default:
            return state
    }
}