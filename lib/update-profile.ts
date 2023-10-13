import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";

interface ProfileUpdateInput {
    name?: string;
    imageUrl?: string;
    email?: string;
    graduationYear?: number;
    grade?: number;
    phoneNumber?: string;
}

export const updateProfile = async (data: ProfileUpdateInput) => {
    const user = await currentUser();
    if (!user) {
        return redirectToSignIn();
    }

    const profile = await db.profile.update({
        where: {
            userId: user.id,
        },
        data,
    });

    return profile;
}