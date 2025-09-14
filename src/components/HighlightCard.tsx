import Image from "next/image";

const HighlightCard = ({ title, value, icon, description }: { title: string; value: string; icon: string; description: string }) => {
    return (
        <div className="bg-[#29295a] w-full rounded-lg p-3 sm:p-4 flex gap-4 sm:gap-6">
            <div className="flex flex-col gap-6 sm:gap-10 min-w-20 sm:min-w-24">
                <p className="text-sm sm:text-md text-gray-400">{title}</p>
                <div className="text-lg sm:text-2xl text-white">{value}</div>
            </div>
            <div className="self-end flex items-center flex-col gap-1">
                <Image
                    src={icon}
                    alt={title}
                    width={24}
                    height={24}
                    className="self-start"
                />
                <p className="text-xs sm:text-sm text-gray-400">{description}</p>
            </div>
        </div>
    );
}

export default HighlightCard
