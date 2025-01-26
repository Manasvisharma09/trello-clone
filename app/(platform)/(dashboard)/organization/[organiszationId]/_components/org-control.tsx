"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export const OrgControl = () => {
    const params = useParams();
    console.log("Params from useParams:", params);

    const { isLoaded, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    // Use a ref to track the last active organization and avoid redundant calls
    const lastSetOrganization = useRef<string | null>(null);

    useEffect(() => {
        // Ensure the organization list is loaded before proceeding
        if (!isLoaded) {
            console.log("Organization list is not yet loaded");
            return;
        }

        if (!setActive) {
            console.warn("setActive is undefined");
            return;
        }

        // Check if `organiszationId` exists in params (corrected the typo)
        const organizationId = params?.organiszationId as string; // Use the correct key
        if (!organizationId) {
            console.warn("organizationId is missing in params");
            return;
        }

        // Prevent redundant calls if the same organization is already active
        if (lastSetOrganization.current === organizationId) {
            console.log(`Organization already set to: ${organizationId}`);
            return;
        }

        try {
            setActive({ organization: organizationId });
            lastSetOrganization.current = organizationId; // Update the ref
            console.log(`Active organization set to: ${organizationId}`);
        } catch (error) {
            console.error("Error setting active organization:", error);
        }
    }, [isLoaded, setActive, params?.organiszationId]); // Track the correct key

    return null;
};
