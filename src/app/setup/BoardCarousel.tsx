"use client";

export type Board = {
    id: string;
    name: string;
    pin_count: number;
    media: {
        image_cover_url: string;
        pin_thumbnail_urls: string[];
    };
};

type Props = {
    boards: Board[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export default function BoardCarousel({ boards, selectedIndex, onSelect }: Props) {

    const getIndex = (offset: number) => (selectedIndex + offset + boards.length) % boards.length;

    const visibleBoards = [
        { board: boards[getIndex(-1)], offset: -1 },
        { board: boards[getIndex(0)],  offset: 0  },
        { board: boards[getIndex(1)],  offset: 1  },
    ];

    return (
        <>
            <section className="flex flex-col xl:flex-row justify-center items-center gap-[3vh] xl:gap-[10vw]">
                {visibleBoards.map(({ board, offset }) => (
                    <div
                        key={board.id}
                        onClick={() => onSelect(getIndex(offset))}
                        className={`cursor-pointer transition-opacity ${offset === 0 ? "opacity-100" : "opacity-40"}`}
                    >
                        <div className="w-[21vh] xl:w-full flex gap-[2px]">
                            <img src={board.media.image_cover_url} alt="pinterest_board_thumbnail_1"
                                 className={`w-[12vh] h-[12vh] object-cover rounded-l-2xl
                                    ${offset === 0 ? "xl:w-[14vw] xl:h-[14vw]" : "xl:w-[12vw] xl:h-[12vw]"}`}/>
                            <div className="flex flex-col gap-[2px]">
                                <img src={board.media.pin_thumbnail_urls[0]} alt="pinterest_board_thumbnail_2"
                                     className={`w-[6vh] h-[6vh] min-w-[7vh] object-cover rounded-tr-2xl
                                        ${offset === 0 ? "xl:w-[7vw] xl:h-[7vw]" : "xl:w-[6vw] xl:h-[6vw]"}`}/>
                                <img src={board.media.pin_thumbnail_urls[1]} alt="pinterest_board_thumbnail_3"
                                     className={`w-[6vh] h-[6vh] min-w-[7vh] object-cover rounded-br-2xl
                                        ${offset === 0 ? "xl:w-[7vw] xl:h-[7vw]" : "xl:w-[6vw] xl:h-[6vw]"}`}/>
                            </div>
                        </div>
                        <div className="mt-[0.5vw] font-neue-haas flex flex-col items-center gap-[0.2vw]">
                            <p className={`font-bold text-[1.5vh] xl:text-[1.25vw]`}>{board.name}</p>
                            <p className={`font-medium text-[1.25vh] xl:text-[1vw]`}>{board.pin_count} Pins</p>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}