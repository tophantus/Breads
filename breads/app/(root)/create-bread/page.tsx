import PostBread from "@/components/forms/PostBread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";


async function Page() {
    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect("/onboarding")
    return (
        <>
            <h1 className="head-text text-light-1">Create bread</h1>
            <PostBread userId={userInfo._id.toString()} />
        </>
    )
}

export default Page