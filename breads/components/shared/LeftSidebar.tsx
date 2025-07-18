"use client"

import {sidebarLinks} from "@/constants/index"
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

function LeftSidebar() {
    const pathname = usePathname()
    const { userId } = useAuth();

    if (!userId) return null;
    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

                    const route = link.route === '/profile' && userId
                        ? `${link.route}/${userId}`
                        : link.route;

                    return (
                        <Link
                            href={route}
                            key={link.label}
                            className={`leftsidebar_link ${isActive && 'bg-primary-500' }`}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                height={24}
                                width={24}
                            />
                            <p className="text-light-1 max-lg:hidden">{link.label}</p>
                        </Link>
                    )
                })}
            </div>

            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutOptions={{redirectUrl: "/sign-in"}}>
                        <div className="flex cursor-pointer p-4 gap-4">
                            <Image
                                src={"assets/logout.svg"}
                                alt="logout"
                                width={24}
                                height={24}
                            />
                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar