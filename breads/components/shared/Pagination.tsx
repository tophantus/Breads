"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
    pageNumber: number,
    isNext: boolean,
    path: string
}

const Pagination = ({
    pageNumber,
    isNext,
    path
}: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleNavigation = (type: string) => {
        let nextPageNumber = pageNumber;

        if (type === 'prev') {
            nextPageNumber = Math.max(1, pageNumber - 1)
        } else if (type === 'next') {
            nextPageNumber = pageNumber + 1
        }

        const params = new URLSearchParams(searchParams.toString());



        if (nextPageNumber > 1) {
            params.set("page", nextPageNumber.toString())
        } else {
            params.delete("page")
        }

        router.push(`/${path}?${params.toString()}`)
    }

    if (!isNext && pageNumber === 1) return null

    return (
        <div className='pagination'>
        <Button
            onClick={() => handleNavigation("prev")}
            disabled={pageNumber === 1}
            className='!text-small-regular text-light-2'
        >
            Prev
        </Button>
        <p className='text-small-semibold text-light-1'>{pageNumber}</p>
        <Button
            onClick={() => handleNavigation("next")}
            disabled={!isNext}
            className='!text-small-regular text-light-2'
        >
            Next
        </Button>
        </div>
    )
}

export default Pagination;