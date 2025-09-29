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
  });

  const postData = data?.results ?? [];

  return (
    <div className="bg-testimonial pt-40 pb-16 lg:py-32">
      <div className="mx-auto max-w-7xl sm:py-4 lg:px-8 ">
        <div className="text-center">
          <h3 className="text-4xl sm:text-6xl font-bold text-black my-3">
            See what others are saying.
          </h3>
          <h3 className="text-4xl sm:text-6xl font-bold text-black text-opacity-50 lg:mr-48 my-4">
            See what others are saying.
          </h3>
          <h3 className="text-4xl sm:text-6xl font-bold text-black text-opacity-25 lg:-mr-32 my-4">
            See what others are saying.
          </h3>
        </div>
        {!isLoading && (
          <Slider {...settings}>
            {postData.map(({ owner, content, rating }, i) => (
              <div key={i} className="relative">
                <div className="bg-white test-sha m-3 p-10 my-20 rounded-3xl">
                  <img
                    src={owner?.avatar ?? ""}
                    alt="testimonial-avatar-image"
                    className="inline-block m-auto absolute test-pos object-cover rounded-full border-4 border-white w-[80px] h-[80px]"
                  />

                  <h4 className="text-base font-medium text-testColor my-4">
                    {content ?? "-"}
                  </h4>
                  <hr style={{ color: "lightgrey" }} />
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium pt-4 pb-2">
                        {owner?.name}
                      </h3>
                      <h3 className="text-xs font-medium pb-2 opacity-50">
                        {owner?.role}
                      </h3>
                    </div>
                    <div className="flex">
                      {rating &&
                        [...Array(rating)].map((_, i) => (
                          <StarIcon key={i} width={20} className="star" />
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
