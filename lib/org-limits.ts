import { MAX_FREE_BOARDS } from "@/constants/boards";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const incrementAvailableCount = async () => {
    
        const { orgId } = await auth();
        if(!orgId){
            throw new Error("Unauthorized");
        }
        const orgLimit=await db.orgLimit.findUnique({
            where:{orgId}
        })
        if(orgLimit){
            await db.orgLimit.update({
                where:{orgId},
                data:{ count: { increment: 1 } }, 
            })
        }else{
            await db.orgLimit.create({
                data: {orgId,count:1}
            })
        }      
    
};


// Function to decrement the available count
export const decreaseAvailableCount = async () => {
    const authData = await auth();
    if (!authData || !authData.orgId) {
        throw new Error("Unauthorized");
    }

    const { orgId } = authData;

    try {
        const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

        console.log("🔍 Before Decrement - OrgLimit:", orgLimit);
        if (orgLimit && orgLimit.count > 0) {
            const updatedLimit = await db.orgLimit.update({
                where: { orgId },
                data: { count: { decrement: 1 } },
            });
            console.log("✅ Updated OrgLimit:", updatedLimit);
            return updatedLimit.count;
        } else {
            console.warn("⚠️ Decrement skipped: count already 0 or orgLimit missing.");
            return 0;
        }
    } catch (error) {
        console.error("❌ Error updating orgLimit count:", error);
        throw new Error("Error decrementing orgLimit count.");
    }
};

// Function to get the available count
export const getAvailableCount = async () => {
    const authData = await auth();
    if (!authData || !authData.orgId) {
        console.log("❌ No Org ID found");
        return 0;
    }

    const { orgId } = authData;

    try {
        const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

        if (!orgLimit) {
            console.log("❌ OrgLimit does not exist, returning 0.");
            return 0;
        }

        console.log("✅ Available Count:", orgLimit.count);
        return orgLimit.count;
    } catch (error) {
        console.error("❌ Error retrieving org limit:", error);
        return 0;
    }
};

// Function to check if more boards can be added
export const hasAvailableCount = async () => {
    const authData = await auth();
    if (!authData || !authData.orgId) {
        throw new Error("Unauthorized");
    }

    const { orgId } = authData;

    try {
        const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

        const canAddMore = !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
        console.log(`✅ Has Available Count: ${canAddMore}`);
        return canAddMore;
    } catch (error) {
        console.error("❌ Error checking org limit:", error);
        throw new Error("Error checking available count.");
    }
};
