import {ComponentType} from "react";

import * as DataTab from "./Data"
import * as ControllerTab from "./Controller"
import * as AboutTab from "./About"

export interface TabDefinition {
    id: string;
    caption: string;
    displayContent: ComponentType;
}

const TABS: Map<string, TabDefinition> = new Map<string, TabDefinition>([

    [DataTab.ID,{

        id:             DataTab.ID,
        caption:        DataTab.CAPTION,
        displayContent: DataTab.Content

    }],
    [ControllerTab.ID,{

        id:             ControllerTab.ID,
        caption:        ControllerTab.CAPTION,
        displayContent: ControllerTab.Content

    }],
    [AboutTab.ID,{

        id:             AboutTab.ID,
        caption:        AboutTab.CAPTION,
        displayContent: AboutTab.Content

    }]

]);

export const TAB_IDS: string[] = Array.from( TABS.keys() );

export function GetTab(id: string): TabDefinition {
    try {
        return TABS.get(id)!;
    } catch (error) {
        return {
            id: "unknown",
            caption: "Unknown",
            displayContent: () => "Tab not found !!!",
        }
    }
}

export const DEFAULT_TAB_ID: string = DataTab.ID;