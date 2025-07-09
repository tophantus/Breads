import * as z from 'zod';

export const BreadValidation = z.object({
    bread: z.string().nonempty().min(3),
    accountId: z.string()
})


export const CommentValidation = z.object({
    bread: z.string().nonempty().min(3)
})
