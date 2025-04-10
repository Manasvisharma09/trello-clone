import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { orgId } = await auth();
    if (!orgId) {
        return false;
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where: { orgId },
        select: {
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!orgSubscription || !orgSubscription.stripePriceId || !orgSubscription.stripeCurrentPeriodEnd) {
        return false;
    }

    const isValid =
        orgSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return isValid;
};
