import * as React from "react";

import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Label
} from "@/components/ui/label";
import {
    Input
} from "@/components/ui/input";
import {
    Button
} from "@/components/ui/button";

import {
    ControllerDialogKind,
    ControllerDialogSubmitResult,
    type ControllerDialogCallback,
} from "./controllerDialog.types"

import {FullControllerProperties, ControllerProperties, ControllerPropertiesSchema} from "@/types/apiTypes.ts";
import {useState} from "react";
import {ZodNumber} from "zod";

/**
 * Method for creating the button footer of the dialog
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param kind The kind of the current dialog
 * @see ControllerDialogKind
 * @param onButtonClick The callback function if one button was pressed
 * @see ControllerDialogSubmitResult
 *
 * @constructor
 */
function ControllerDialogButtons(
    {kind, onButtonClick}: {
        kind: ControllerDialogKind,
        onButtonClick: (result: ControllerDialogSubmitResult) => void,
}) {

    // Saving result according to the dialog kind
    const result = () => {
        switch (kind) {
            case ControllerDialogKind.MODIFY: {
                return (
                    <DialogFooter className="grid grid-cols-2 items-center gap-4">

                        {/*Button SAVE -> Submitting the changes*/}
                        <DialogClose asChild>
                            <Button onClick={() => {
                                onButtonClick(ControllerDialogSubmitResult.SUBMIT)
                            }}>Save changes</Button>
                        </DialogClose>

                        {/*Button DELETE -> Removing the entity*/}
                        <DialogClose asChild>
                            <Button variant="destructive" onClick={() => {
                                onButtonClick(ControllerDialogSubmitResult.DELETE)
                            }}>Delete controller</Button>
                        </DialogClose>

                    </DialogFooter>
                )
            }
            case ControllerDialogKind.CREATE: {
                return (
                    <DialogFooter className="grid grid-cols-1 items-center gap-4">

                        {/*Button CREATE -> Creating the entity*/}
                        <DialogClose asChild>
                            <Button onClick={() => {

                                onButtonClick(ControllerDialogSubmitResult.SUBMIT)

                            }}>Create controller</Button>
                        </DialogClose>

                    </DialogFooter>
                )
            }
        }
    }

    // Return the generated result
    return result()
}

function ControllerDialogInputs({data, onValueChange}: {
    data: ControllerProperties,
    onValueChange: (data: ControllerProperties) => void,
}) {
    // Saving Shape
    const shape = ControllerPropertiesSchema.shape

    // Saving entries for returning in result
    const entries = Object.entries(shape).map(([key, fieldSchema]) => {
        const val = data[key as keyof typeof data];

        // Getting input type
        let inputType = "text";
        if (fieldSchema._def.typeName === "ZodNumber") inputType = "number";

        // Min and Max values for numbers
        let min = undefined
        let max = undefined
        if (fieldSchema instanceof ZodNumber) {
            const minCheck = fieldSchema._def.checks.find(c => c.kind === "min");
            const maxCheck = fieldSchema._def.checks.find(c => c.kind === "max");

            min = minCheck?.value;
            max = maxCheck?.value;
        }

        return (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right capitalize" htmlFor={key}>
                    {key}
                </Label>

                <Input
                    id={key}
                    type={inputType}
                    className="col-span-3"
                    value={val}
                    min={min}
                    max={max}
                    onChange={(e) => {
                        const newValue =
                            inputType === "number"
                                ? parseInt(e.target.value)
                                : e.target.value;

                        onValueChange({ ...data, [key]: newValue });
                    }}
                />
            </div>
        );
    })

    return (
        <div className="grid gap-4 py-4">

            {entries.map((entry) => entry)}

        </div>
    );
}

/**
 * Method for creating a dialog for managing a controller
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param kind The kind of the dialog to create
 * @see ControllerDialogKind
 * @param controller The properties of the corresponding controller
 * @see FullControllerProperties
 * @param onDialogSubmit The callback function if a dialog was closed
 * @see ControllerDialogCallback
 * @param props Other properties for REACT
 *
 * @constructor
 */
export function ControllerDialog(
    {kind, controller, onDialogSubmit, ...props}: {
        kind: ControllerDialogKind,
        controller?: FullControllerProperties,
        onDialogSubmit: ControllerDialogCallback,
    } & React.ComponentProps<typeof DialogContent>,
) {

    const initialProperties = controller ? controller.settings: ControllerProperties

    // Setting state attribute for rendering changed values
    const [controllerProperties, setControllerProperties] = useState<ControllerProperties>(
        ControllerPropertiesSchema.parse(initialProperties)
    )

    // Defining a dialog header
    const controllerName = (kind == ControllerDialogKind.CREATE)
        ? "a new controller"
        : controller!.id
    const dialogHeader = {
        caption: `Settings of ${controllerName}`,
        description: `Edit the properties of ${controllerName}`
    }

    // Lambda for determining the property output at a special modal result
    const getProperties = (number: ControllerDialogSubmitResult) => {
        switch (number) {
            case ControllerDialogSubmitResult.SUBMIT : return controllerProperties
            default: return initialProperties
        }
    }

    return(
        <DialogContent {...props}>

            {/* Header with caption */}
            <DialogHeader>
                <DialogTitle>{dialogHeader.caption}</DialogTitle>
                <DialogDescription>{dialogHeader.description}</DialogDescription>
            </DialogHeader>

            {/* Inputs */}
            <ControllerDialogInputs data={controllerProperties} onValueChange={setControllerProperties} />

            {/* Button footer (with callback) */}
            <ControllerDialogButtons kind={kind} onButtonClick={(result) => {
                onDialogSubmit(result,getProperties(result))
            }}/>

        </DialogContent>

    )
}