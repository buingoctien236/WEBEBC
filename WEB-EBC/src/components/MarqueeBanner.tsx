// components/MarqueeBanner.tsx
import { ArrowRight } from 'lucide-react';

interface MarqueeBannerProps {
    text?: string;
    buttonText?: string;
    link?: string;
}

export default function MarqueeBanner({
    text = "Mua ngay kẻo lỡ!",
    buttonText = "Tới cửa hàng",
    link = "#products"
}: MarqueeBannerProps) {

    const items = [
        { text, buttonText, link },
        { text, buttonText, link },
        { text, buttonText, link },
        { text, buttonText, link },
        { text, buttonText, link }
    ];

    return (
        <div className="relative py-4 bg-gradient-to-r from-green-50 to-cyan-50 rounded-xl overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="inline-flex items-center mx-8 flex-shrink-0"
                        aria-hidden={index > 0}
                    >
                        <span className="text-2xl lg:text-3xl font-bold text-green-800 pr-4">
                            <a
                                href={item.link}
                                className="hover:text-green-600 transition-colors"
                                tabIndex={index === 0 ? 0 : -1}
                            >
                                {item.text}
                            </a>
                        </span>

                        <span className="inline-block flex-shrink-0">
                            <a
                                href={item.link}
                                className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                                tabIndex={index === 0 ? 0 : -1}
                            >
                                {item.buttonText}
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </span>
                    </div>
                ))}
            </div>

            {/* Gradient overlay */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-green-50 to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-cyan-50 to-transparent z-10"></div>
        </div>
    );
}