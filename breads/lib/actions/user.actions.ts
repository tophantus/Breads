"use server"

import { connectToDb } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { ca } from "zod/v4/locales";
import Bread from "../models/bread.model";


interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
    connectToDb();

    try {
        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            {
                upsert: true
            }
        );

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}


export async function fetchUser(userId: string) {
    try {
        connectToDb();

        return await User
            .findOne({id: userId})
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error: any) {
        throw new Error(`Failed to fetchUser: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDb();

        const breads = await User.findOne({id: userId})
            .populate({
                path: 'breads',
                model: Bread,
                populate: {
                    path: 'children',
                    model: Bread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "name image id"
                    }
                }
            })
        
        return breads;
    } catch (error: any) {
        throw new Error (`Failed to fetch user posts: ${error.message}`)
    }
}