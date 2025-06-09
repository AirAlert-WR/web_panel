import * as React from "react";
import * as Icons from "@tabler/icons-react";

import {
    Button
} from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger
} from "@/components/ui/dialog";

import {
    ControllerDialog
} from "./controllerDialog";

import {
    ControllerDialogKind,
    type ControllerDialogCallback
} from "./controllerDialog.types";

/**
 * Method for creating a button
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param onDialogSubmit The callback function if the nested dialog was closed
 * @see ControllerDialogCallback
 * @param props Other properties for REACT
 *
 * @constructor
 */
export function ControllerAddButton(
    {onDialogSubmit, ...props}: {
        onDialogSubmit: ControllerDialogCallback,
    } & React.ComponentProps<typeof Button>
) {
    return (
        <Dialog>
            <DialogTrigger asChild>

                {/* Drawing the ADD button */}
                <Button className="@container/card h-full flex flex-col items-center
            justify-center gap-1 px-2 py-3 text-center" {...props}>
                    <Icons.IconLayoutGridAdd size={48} className="shrink-0" />
                    Add controller
                </Button>
            </DialogTrigger>

            {/* Dialog implementation */}
            <ControllerDialog
                kind={ControllerDialogKind.CREATE}
                onDialogSubmit={onDialogSubmit}
            />
        </Dialog>
    )
}