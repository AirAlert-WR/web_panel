import { create } from "zustand"
import React from "react"
import * as Icons from "@tabler/icons-react";

import * as PageAnalytics from "@/pages/pageAnalytics";
import * as PageControllers from "@/pages/pageControllers";
import * as PageAbout from "@/pages/pageAbout";

type PageId = string

// Type of sub-page
export type Page = {
    id: PageId,
    title: string,
    icon: Icons.Icon,
    component: React.ComponentType,
    enabled: boolean,
}

// Constant definition of an empty page
const EmptyPage: Page = {
    id: "unknown",
    title: "Unknown page",
    icon: Icons.IconFileUnknown,
    component: () => {
        return "This page doesn't exist!!!"
    },
    enabled: true
}

// Type of page storage
type PageStore = {
    pages: Page[]
    currentPageId: PageId
    setCurrentPage: (id: PageId) => void
}

// Collection of all available pages
const RegisteredPages: Page[] = [
    PageAnalytics.DATA,
    PageControllers.DATA,
    PageAbout.DATA,
]

// Constant definition of the default page's id
export const DefaultPageID: PageId = PageAnalytics.DATA.id

// Global state store for site-wide page navigation
export const usePageStore = create<PageStore>((set) => ({
    pages: RegisteredPages,
    currentPageId: DefaultPageID,
    setCurrentPage: (id) => set({ currentPageId: id }),
}))
export const useCurrentPage = () => {
    const { currentPageId, pages } = usePageStore()
    return pages.find((p) => p.id === currentPageId) ?? EmptyPage
}

