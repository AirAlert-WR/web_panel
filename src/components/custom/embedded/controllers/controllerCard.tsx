import * as React from "react";
import * as Icons from "@tabler/icons-react";

import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardContent,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Button
} from "@/components/ui/button";

import {
    ControllerDialog
} from "./controllerDialog"

import {
    ControllerDialogKind,
    type ControllerDialogCallback
} from "./controllerDialog.types"
import type {FullControllerProperties} from "@/types/apiTypes.ts";

/**
 * Method for creating a grid card representing a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param controller
 * @param onDialogSubmit
 * @param props
 *
 * @constructor
 */
export function ControllerCard(
    {controller, onDialogSubmit, ...props}: {
        controller: FullControllerProperties,
        onDialogSubmit: ControllerDialogCallback,
    } & React.ComponentProps<typeof Card>
) {
    return (
        <Card className="@container/card" {...props}>

            {/* Header with description and id */}
            <CardHeader>
                <CardDescription>{controller.id}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                    {controller.settings.name}
                </CardTitle>
                <CardAction>
                    <Icons.IconCpu className="size-16"/>
                </CardAction>
            </CardHeader>

            {/* Content with link */}
            <CardContent>
                <a href={controller.configURL}> 🔗 Download config HERE </a>
            </CardContent>

            {/* Footer with nested dialog*/}
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <Dialog>

                    {/*Dialog trigger button*/}
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Modify</Button>
                    </DialogTrigger>

                    {/*Dialog implementation itself*/}
                    <ControllerDialog
                        kind={ControllerDialogKind.MODIFY}
                        controller={controller}
                        onDialogSubmit={onDialogSubmit}
                    />

                </Dialog>
            </CardFooter>
        </Card>
    )
}