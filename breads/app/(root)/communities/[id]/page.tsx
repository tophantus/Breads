import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs, profileTabs } from "@/constants";
import Image from "next/image";
import BreadTab from "@/components/shared/BreadTab";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";

const Page = async ({params}: {params: Promise<{id: string}>}) => {
    const id = (await params).id
    if (!id) return null
    const user = await currentUser();
    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(id);


    
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />

            <div className="mt-9">
                <Tabs defaultValue="breads" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">
                                    {tab.label}
                                </p>
                                {tab.label === 'Breads' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {communityDetails?.breads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                        <TabsContent
                            value={'breads'}
                            className="w-full text-light-1"
                        >
                            <BreadTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                        </TabsContent>

                        <TabsContent
                            value={'members'}
                            className="w-full text-light-1"
                        >
                            <section className="mt-9 flex flex-col gap-10">
                                {communityDetails?.members.map((member: any) => (
                                    <UserCard
                                        key={member.id}
                                        id={member.id}
                                        name={member.name}
                                        username={member.username}
                                        imgUrl={member.image}
                                        userType='User'
                                    />
                                ))}
                            </section>
                        </TabsContent>

                        <TabsContent
                            value={'thread'}
                            className="w-full text-light-1"
                        >
                            <BreadTab
                                currentUserId={user.id}
                                accountId={communityDetails._id}
                                accountType="Community"
                            />
                        </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default Page;