import React from 'react';

export interface ImageCategoryCardProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
}

export const ImageCategorySection = ({
  title,
  cards
}: {
  title: string;
  cards: ImageCategoryCardProps[];
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={card.onClick}
            className="flex flex-col items-center gap-2 min-w-[100px] shrink-0 group cursor-pointer text-center"
          >
            <div className="w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border border-gray-100 relative group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-800 leading-tight px-1">
              {card.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

