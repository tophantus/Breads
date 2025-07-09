import { fetchUser, getActivities } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo) return null;

    if (!userInfo.onboarded) redirect("/onboarding")

    const activities = await getActivities(userInfo._id);

    return (
        <section>
            <h1 className="head-text text-light-1 mt-10">Activity</h1>

            <section className="mt-10 flex flex-col gap-5">
                {activities.length > 0 ? (
                    <>
                        {activities.map((activity) => (
                            <Link key={activity._id} href={`/bread/${activity.parentId}`}>
                                <article className="activity-card">
                                    <Image
                                        src={activity.author.image}
                                        alt="Profile image"
                                        width={20}
                                        height={20}
                                        className="rounded-full object-cover"
                                    />
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your bread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : <p className="no-result">No Activity</p>}
            </section>
        </section>
    )
}

export default Page;