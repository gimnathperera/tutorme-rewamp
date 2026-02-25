"use client";
import { FC } from "react";
import Slider from "react-slick";
import { StarIcon } from "@heroicons/react/24/solid";
import { useFetchTestimonialsQuery } from "@/store/api/splits/testimonials";

const settings = {
  dots: false,
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 2,
  arrows: false,
  autoplay: true,
  speed: 700,
  autoplaySpeed: 5000,
  cssEase: "linear",
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
      },
    },
  ],
};

const TESTIMONIAL_LIMIT = 10;

const Testimonials: FC = () => {
  const { data, isLoading } = useFetchTestimonialsQuery({
    page: 1,
    limit: TESTIMONIAL_LIMIT,
    ...({ sortBy: "createdAt:desc" } as any),
  });

  const postData = data?.results ?? [];

  return (
    <div className="bg-testimonial pt-32 pb-12 lg:py-28">
      <div className="mx-auto max-w-7xl sm:py-4 lg:px-8">
        {/* Stacked marquee headings */}
        <div className="text-center overflow-hidden animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black my-2">
            See what others are saying.
          </h2>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black opacity-40 lg:mr-48 my-2 hidden sm:block">
            See what others are saying.
          </h2>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black opacity-20 lg:-mr-32 my-2 hidden sm:block">
            See what others are saying.
          </h2>
        </div>

        {!isLoading && (
          <Slider {...settings}>
            {postData.map(({ owner, content, rating }, i) => (
              <div key={i} className="relative">
                <div className="bg-white test-sha m-3 p-8 my-20 rounded-3xl">
                  <img
                    src={owner?.avatar ?? ""}
                    alt="testimonial-avatar-image"
                    className="inline-block m-auto absolute test-pos object-cover rounded-full border-4 border-white w-[70px] h-[70px]"
                  />
                  <p className="text-sm font-medium text-testColor my-4 leading-relaxed">
                    {content ?? "-"}
                  </p>
                  <hr style={{ color: "lightgrey" }} />
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <h4 className="text-sm font-semibold pt-3 pb-1">
                        {owner?.name}
                      </h4>
                      <h5 className="text-xs font-medium pb-2 opacity-50">
                        {owner?.role}
                      </h5>
                    </div>
                    <div className="flex gap-0.5">
                      {rating &&
                        [...Array(rating)].map((_, i) => (
                          <StarIcon key={i} width={16} className="star" />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
