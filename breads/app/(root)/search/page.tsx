import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
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
    

    const result = await fetchUsers({
        userId: user.id,
        searchString: params.q,
        pageNumber: params?.page ? +params.page : 1,
        pageSize: 20,

    })
    return (
        <section>
            <h1 className="head-text text-light-1 mb-10">Search</h1>
            <SearchBar routeType="search"/>
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 
                    ? (
                        <p className="no-result">No Users</p>
                    ) : (
                        <>
                        {result.users.map((user) => (
                            <UserCard 
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                userType='User'
                            />
                        ))}
                        </>
                    )
                }
            </div>

            <Pagination
                path="search"
                pageNumber={params?.page ? +params.page : 1}
                isNext={result.isNext}
            />
        </section>
    )
}

export default Page;