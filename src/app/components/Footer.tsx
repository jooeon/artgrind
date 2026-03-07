import Link from "next/link";

export default function Footer() {

    return (
        <footer className="relative flex justify-center w-full pt-[3vh] xl:pt-[1vw]">
            <p className="absolute bottom-0 left-[0.5vw] font-fornire lowercase text-[1.5vh] xl:text-[1vw] leading-none">
                Created by <a href="https://jooeonpark.com" target="_blank" className="underline mr-[2vw]">Joo Eon Park</a>
                <span className="hidden xl:inline">&copy;{new Date().getFullYear()}</span>
            </p>
            <p className="text-[0.8vh] xl:text-[0.75vw] text-gray-light text-center">For personal use only. Pinterest
                    terms and content policies apply. <Link href="/privacy-policy" className="underline">Privacy Policy</Link></p>
        </footer>
);

}