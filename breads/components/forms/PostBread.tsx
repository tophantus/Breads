"use client"

import { BreadValidation } from "@/lib/validations/bread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import { createBread } from "@/lib/actions/bread.actions";
import z from "zod";
import Bread from "@/lib/models/bread.model";
import { useOrganization } from "@clerk/nextjs";

interface Props {
  userId: string;
}

function PostBread({userId}: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const { organization } = useOrganization();

    const form = useForm({
        resolver: zodResolver(BreadValidation),
        defaultValues: {
            bread: '',
            accountId: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof BreadValidation>) => {
        await createBread({
            text: values.bread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname
        })

        router.push("/")
    }
    
    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10"
            >
                <FormField
                control={form.control}
                name="bread"
                render={({ field }) => (
                    <FormItem className="flex flex-col w-full gap-3">
                    <FormLabel className="text-base-semibold text-light-2">
                        Content
                    </FormLabel>
                    <FormControl className="no-focus border border-dark-4 text-light-1 bg-dark-3">
                        <Textarea
                            rows={15}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="bg-primary-500">
                    Post Bread
                </Button>

            </form>
        </Form>
    )
}

export default PostBread