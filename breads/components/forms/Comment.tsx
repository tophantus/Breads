"use client"

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Button} from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/bread";
import { usePathname, useRouter } from "next/navigation";
import * as z from "zod"
import { Input} from "@/components/ui/input"
import Image from "next/image";
import { addCommentToBread } from "@/lib/actions/bread.actions";

interface Props {
    breadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({
    breadId,
    currentUserImg,
    currentUserId
}: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            bread: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToBread(
            breadId,
            values.bread,
            JSON.parse(currentUserId),
            pathname
        )
        form.reset()
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                control={form.control}
                name="bread"
                render={({ field }) => (
                    <FormItem className="flex items-center w-full gap-3">
                    <FormLabel>
                        <Image
                            src={currentUserImg}
                            alt="Profile image"
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                        />
                    </FormLabel>
                    <FormControl className="border-none bg-transparent">
                        <Input
                            type="text"
                            placeholder="Comment..."
                            className="no-focus text-light-1 outline-none"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>

            </form>
        </Form>
    )
}

export default Comment;