"use client";

import Button from "@/app/components/Button";
import React from "react";

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
    maxRounds: number;
    onSelect: (index: number) => void;
}

export default function BoardCarousel({ boards, selectedIndex, maxRounds, onSelect }: Props) {
    const getIndex = (offset: number) => (selectedIndex + offset + boards.length) % boards.length;

    const offsets = boards.length === 1 ? [0] : boards.length === 2 ? [-1, 0] : [-1, 0, 1];

    const visibleBoards = offsets.map(offset => ({ board: boards[getIndex(offset)], offset }));

    return (
        <>
            <section className="flex flex-col xl:flex-row justify-center items-center gap-[3vh] xl:gap-[10vw]">
                {visibleBoards.map(({ board, offset }) => (
                    <div
                        key={board.id}
                        onClick={() => {
                            onSelect(getIndex(offset))
                        }}
                        className={`${offset === 0 ? "opacity-100" : "opacity-40"}`}
                        data-clickable={`${offset === 0 ? "false" : "true"}`}
                    >
                        <div className="w-full flex justify-center gap-[2px]">
                            {board.media.image_cover_url ?
                                <img src={board.media.image_cover_url} alt="pinterest_board_thumbnail_1"
                                     className={`w-[12vh] h-[12vh] object-cover rounded-l-2xl ${!board.media.pin_thumbnail_urls[1] ? "rounded-r-2xl" : ""}
                                        ${offset === 0 ? "xl:w-[13vw] xl:h-[13vw]" : "xl:w-[11vw] xl:h-[11vw]"}`}/>
                                :
                                <div>
                                    Add pins to your board first!
                                </div>
                            }
                            {board.media.pin_thumbnail_urls[1] &&
                                <div className="flex flex-col gap-[2px]">
                                    <img src={board.media.pin_thumbnail_urls[0]} alt="pinterest_board_thumbnail_2"
                                         className={`w-[6vh] h-[6vh] min-w-[7vh] object-cover rounded-tr-2xl
                                            ${offset === 0 ? "xl:w-[6.5vw] xl:h-[6.5vw]" : "xl:w-[5.5vw] xl:h-[5.5vw]"}`}/>
                                    <img src={board.media.pin_thumbnail_urls[1]} alt="pinterest_board_thumbnail_3"
                                         className={`w-[6vh] h-[6vh] min-w-[7vh] object-cover rounded-br-2xl
                                            ${offset === 0 ? "xl:w-[6.5vw] xl:h-[6.5vw]" : "xl:w-[5.5vw] xl:h-[5.5vw]"}`}/>
                                </div>
                            }
                        </div>
                        <div className="flex mt-[1vh] xl:mt-[0.6vw] xl:pl-[0.5vw]">
                            <div className="flex flex-col">
                                <div className="flex gap-[1.5vh] xl:gap-[1vw]">
                                    <p className={`font-bold text-[2.3vh] xl:text-[1.5vw] leading-snug`}>{board.name}</p>
                                    {offset === 0 &&
                                        <a
                                            href={`/filter?boardId=${boards[selectedIndex].id}&name=${boards[selectedIndex].name}`}
                                            className="w-[2.3vh] xl:w-[1.5vw] h-[2.3vh] xl:h-[1.5vw] pt-[0.4vh] xl:pt-[0.3vw]"
                                        >
                                            <svg viewBox="0 0 30 30" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd"
                                                      d="M0 30H30V27.0161H0V30ZM14.763 21.0483H9V14.9254L23.7585 0L30 6.17365L14.763 21.0483Z"
                                                      fill="black"/>
                                            </svg>
                                        </a>
                                    }
                                </div>
                                <p className={`font-medium text-[1.4vh] xl:text-[0.85vw] text-gray-dark`}>
                                    {offset === 0 && board.pin_count !== maxRounds
                                        ? `${maxRounds}/${board.pin_count} Pins selected`
                                        : `${board.pin_count} Pins`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}