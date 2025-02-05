import { MAX_FREE_BOARDS } from "@/constants/boards";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const incrementAvailableCount = async () => {
    const { orgId } = await auth();
    if (!orgId) {
        throw new Error("Unauthorized");
    }
    const orgLimit = await db.orgLimit.findUnique({
        where: { orgId }
    });

    if (orgLimit) {
        const updatedLimit = await db.orgLimit.update({
            where: { orgId },
            data: { count: orgLimit.count ++}
        });
        console.log("Updated OrgLimit:", updatedLimit); // Debugging here
    } else {
        const newLimit = await db.orgLimit.create({
            data: { orgId, count: 1 }
        });
        console.log("Created OrgLimit:", newLimit); // Debugging here
    }
};


export const decreaseAvailableCount = async () => {
    const { orgId } = await auth();
    if (!orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

        console.log("Before Decrement - OrgLimit:", orgLimit);

        if (orgLimit && orgLimit.count > 0) {
            await db.$transaction([
                db.orgLimit.update({
                    where: { orgId },
                    data: { count: { decrement: 1 } }
                })
            ]);

            const newCount = await db.orgLimit.findUnique({
                where: { orgId },
                select: { count: true },
            });

            console.log("Updated Available Count After Decrement:", newCount);
        }
    } catch (error) {
        console.error("Error updating org limit:", error);
    }
};


export const hasAvailableCount = async () => {
    const { orgId } = await auth();
    if (!orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

        console.log("OrgLimit Check:", orgLimit);

        return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
    } catch (error) {
        console.error("Error checking org limit:", error);
        return false;
    }
};

export const getAvailableCount = async () => {
    const { orgId } = await auth();
    if (!orgId) {
        return 0;
    }

    try {
        let orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

        console.log("Retrieved OrgLimit:", orgLimit);

        if (!orgLimit) {
            orgLimit = await db.orgLimit.create({
                data: { orgId, count: 0 }
            });
            console.log("Created OrgLimit:", orgLimit);
        }

        return orgLimit.count;
    } catch (error) {
        console.error("Error retrieving org limit:", error);
        return 0;
    }
};
