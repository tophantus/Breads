import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import BreadTab from "@/components/shared/BreadTab";

const Page = async ({params}: {params: Promise<{id: string}>}) => {
    const id = (await params).id
    if (!id) return null
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(id);

    if (!userInfo) return null;
    
    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="breads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab) => (
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
                                        {userInfo.breads.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent
                            key={`content-${tab.label}`}
                            value={tab.value}
                            className="w-full text-light-1"
                        >
                            <BreadTab
                                currentUserId={user.id}
                                accountId={userInfo.id}
                                accountType="User"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}

export default Page;