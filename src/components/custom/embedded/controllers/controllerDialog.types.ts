
// ENUM ControllerDialogKind

import type {ControllerProperties} from "@/types/apiTypes.ts";

const Kind = {
    CREATE: 0,
    MODIFY: 1,
} as const;
type Kind = (
    typeof Kind[keyof typeof Kind]
    )
/**
 * Enum type for specializing the kind of the dialog
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @type
 *
 * @member CREATE a dialog for creating a new controller
 * @member MODIFY a dialog for modifying an existing controller
 */
export type ControllerDialogKind = Kind
export const ControllerDialogKind = Kind

// ENUM ControllerDialogSubmitResult
const Result = {
    CLOSE: 0,
    SUBMIT: 1,
    DELETE: 2,
} as const;
type Result = (
    typeof Result[keyof typeof Result]
    )
/**
 * Enum type for the modal result of the dialog
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @type
 *
 * @member CLOSE The dialog was neutrally close
 * @member SUBMIT The dialog was requesting a submission
 * @member DELETE The dialog was requesting a deletion
 */
export type ControllerDialogSubmitResult = Result
export const ControllerDialogSubmitResult = Result

/**
 * Callback function type in case the dialog was closed
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @member result The result after the dialog was closed
 * @member properties New controller properties (only if result is SUBMIT)
 *
 * @see ControllerDialogSubmitResult
 * @see ControllerProperties
 */
export type ControllerDialogCallback = (
    result: ControllerDialogSubmitResult,
    properties: ControllerProperties
) => void;