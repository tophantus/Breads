import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | undefined}>
}) => {
    let user: any;
    try {
        user = await currentUser();
        if (!user) return null;
    } catch (error: any) {
        throw new Error(`Auth error: ${error.message}`)
    }
    let userInfo: any;

    try {
        userInfo = await fetchUser(user.id)
        if (!userInfo) return null;
    
        if (!userInfo.onboarded) redirect("/onboarding")
    } catch (error: any) {
        throw new Error(`Auth error: ${error.message}`)
    }

    const params = await searchParams

    const result = await fetchCommunities({
        searchString: params.q,
        pageNumber: params?.page ? +params.page : 1,
        pageSize: 20,
    })
    return (
        <section>
            <h1 className="head-text text-light-1 mb-10">Community</h1>

            <SearchBar routeType="communities"/>

            <div className="mt-14 flex flex-col gap-9">
                {result.communities.length === 0 
                    ? (
                        <p className="no-result">No Community</p>
                    ) : (
                        <>
                        {result.communities.map((community) => (
                            <CommunityCard 
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                bio={community.bio}
                                members={community.members}
                            />
                        ))}
                        </>
                    )
                }
            </div>

            <Pagination
                path='communities'
                pageNumber={params?.page ? +params.page : 1}
                isNext={result.isNext}
            />
        </section>
    )
}

export default Page;