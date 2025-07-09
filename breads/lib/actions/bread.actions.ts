"use server"
import { connectToDb } from "../mongoose"
import Bread from "../models/bread.model";
import User from "../models/user.model";
import { model } from "mongoose";
import path from "path";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createBread({text, author, communityId, path}: Params) {
    try {
        connectToDb();
    
        const createdBread = await Bread.create({
            text,
            author,
            community: null
        });

        await User.findByIdAndUpdate(author, {
            $push: {breads: createdBread._id}
        })
    } catch (error: any) {
        throw new Error(`Failed to create Bread: ${error.message}`)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        connectToDb();

        const skipAmount = (pageNumber - 1) * pageSize;

        //Fetch post have no parent ( toplevel Breads ...)
        const postsQuery = Bread.find({parentId: { $in: [null, undefined]}})
            .sort({createdAt : 'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({path: 'author', model: User})
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            })  

        const totalPostsCount = await Bread.countDocuments({parentId: { $in: [null, undefined]}});

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext}

    } catch (error: any) {
        throw new Error(`Failed to fetch posts: ${error.message}`)
    }
}

export async function fetchBreadById(id: string) {
    try {
        connectToDb();

        const bread = await Bread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name image"
                    },
                    {
                        path: 'children',
                        model: Bread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

        return bread;
    } catch (error: any) {
        throw new Error(`Failed to fetch Bread: ${error.message}`)
    }
}

export async function addCommentToBread(
    breadId: string, 
    commentText: string,
    userId: string,
    path: string
) {
    try {
        connectToDb();
        const originalBread = await Bread.findById(breadId);
        if (!originalBread) throw new Error("Bread not found")
        
        const commentBread = new Bread({
            text: commentText,
            author: userId,
            parentId: breadId
        })

        const savedCommentBread = await commentBread.save();

        originalBread.children.push(savedCommentBread._id);

        await originalBread.save();

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Failed to add comment: ${error.message}`)
    }
}