"use server"

import { connectToDb } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { ca } from "zod/v4/locales";
import Bread from "../models/bread.model";
import { FilterQuery, SortOrder } from "mongoose";


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

interface FetchUsersProps {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy= "desc"
}: FetchUsersProps) {
    try {
        connectToDb();
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex}},
                { name: { $regex: regex}},
            ]
        }

        const sortOption = {createdAt: sortBy};

        const userQuery = User.find(query)
            .sort(sortOption)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUserCount = await User.countDocuments(query);

        const users = await userQuery.exec();

        const isNext = totalUserCount > skipAmount + users.length

        return { users, isNext}
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

export async function getActivities(userId: string) {
    try {
        connectToDb();

        const userBreads = await Bread.find({author: userId});

        const childBreadIds = userBreads.reduce((acc, userBread) => {
            return acc.concat(userBread.children)
        }, [])

        const replies = await Bread.find({
            _id: {$in: childBreadIds},
            author: {$ne: userId}
        }).populate({
            path: 'author',
            model: User,
            select: "name image _id"
        })

        return replies
    } catch (error: any) {
        throw new Error(`Failed to get activities: ${error.message}`)
    }
}