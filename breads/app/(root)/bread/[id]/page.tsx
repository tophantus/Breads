import BreadCard from "@/components/cards/BreadCard";
import Comment from "@/components/forms/Comment";
import { fetchBreadById } from "@/lib/actions/bread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const Page = async ({params} : {params: Promise<{id: string}>}) => {

    const id = (await params)?.id;

    if (!id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo.onboarded) redirect("/onboarding")

    const bread = await fetchBreadById(id)

    return (
        <section className="relative">
            <div>
                <BreadCard
                    key={bread._id}
                    id={bread._id}
                    currentUserId={user.id}
                    parentId={bread.parentId}
                    content={bread.text}
                    author={bread.author}
                    community={bread.community}
                    createdAt={bread.createdAt}
                    comments={bread.children}
                />
            </div>

            <div className="mt-7 ">
                <Comment
                    breadId={bread._id.toString()}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}

                />
            </div>

            <div className="mt-10 ">
                {bread.children.map((childItem: any) => (
                    <BreadCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user.id}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default Page;