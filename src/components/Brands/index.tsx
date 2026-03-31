import { Brand } from "@/types/brand";
import Image from "next/image";
import brandsData from "./brandsData";

const Brands = () => {
  return (
    <section className="w-full pt-16">
      <div className="brands-marquee bg-gray-light">
        <div className="brands-marquee__fade-left" />
        <div className="brands-marquee__fade-right" />
        <div className="brands-marquee__track">
          <div className="brands-marquee__group">
            {brandsData.map((brand) => (
              <SingleBrand key={`primary-${brand.id}`} brand={brand} />
            ))}
          </div>
          <div className="brands-marquee__group" aria-hidden="true">
            {brandsData.map((brand) => (
              <SingleBrand key={`duplicate-${brand.id}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: Brand }) => {
  const { href, image, name } = brand;

  return (
    <div className="brands-marquee__item w-[132px] sm:w-[148px] md:w-[164px]">
      <a
        href={href}
        target="_blank"
        rel="nofollow noreferrer"
        className="relative block h-10 w-full opacity-70 transition hover:opacity-100"
      >
        <Image src={image} alt={name} fill className="object-contain" />
      </a>
    </div>
  );
};
