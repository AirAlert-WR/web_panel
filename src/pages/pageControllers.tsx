import * as Icons from "@tabler/icons-react";
import {type Page} from "@/pages/index.ts";

import {
    ControllerCard,
    ControllerAddButton,

    //ControllerDialogSubmitResult,
    //type ControllerDialogCallback,
    type ControllerProperties
} from "@/components/custom/embedded/controllers";

/**
 * Method for drawing the page content
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @constructor
 */
function Content() {

    /*TODO code update/fetch from RestAPI (perhaps state)*/

    // Temporary definition (sample controllers)
    const controllers: ControllerProperties[] = [
        {
            name: "Controller1",
            interval: 15
        },
        {
            name: "Controller2",
            interval: 20,
        },
        {
            name: "Controller3",
            interval: 30,
        },
        {
            name: "Controller4",
            interval: 40,
        },
    ]

    // Returning the page
    return (

        /* Flex container wrapper */
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

                    {/* First element: Button for adding a new controller */}
                    <ControllerAddButton onDialogSubmit={() => {

                        //TODO Change state or similar

                    }}/>

                    {/* Other elements: fetched controllers */}
                    {controllers.map((controller) => (
                        <ControllerCard controller={controller} onDialogSubmit={(result, properties) => {

                            //TODO Change state or similar
                            console.log(properties)
                            console.log(result)

                        }} />
                    ))}

                </div>

            </div>
        </div>

    )
}

/**
 * Exporting data for the page navigation
 *
 * @author Danilo Bleul
 * @since 1.0
 */
export const DATA: Page = {
    id: "controllers",
    title: "Controllers",
    icon: Icons.IconDeviceRemote,
    component: Content,
    enabled: true,
}