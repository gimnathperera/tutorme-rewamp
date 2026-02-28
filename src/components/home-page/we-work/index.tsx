"use client";
import Slider from "react-slick";
import React, { Component } from "react";
import Image from "next/image";
import LinkedInSvg from "../../../../public/images/wework/linkedin.svg";

// CAROUSEL DATA
interface DataType {
  profession: string;
  name: string;
  imgSrc: string;
}

const postData: DataType[] = [
  {
    profession: "Co-founder",
    name: "John Doe",
    imgSrc: "/images/wework/avatar.svg",
  },
  {
    profession: "Co-founder",
    name: "John Doe",
    imgSrc: "/images/wework/avatar3.svg",
  },
  {
    profession: "Co-founder",
    name: "John Doe",
    imgSrc: "/images/wework/avatar4.svg",
  },
  {
    profession: "Co-founder",
    name: "John Doe",
    imgSrc: "/images/wework/avatar.svg",
  },
  {
    profession: "Co-founder",
    name: "John Doe",
    imgSrc: "/images/wework/avatar3.svg",
  },
  {
    profession: "Co-founder",
    name: "John Doe",
    imgSrc: "/images/wework/avatar4.svg",
  },
];

export default class WeWork extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      speed: 4000,
      autoplaySpeed: 2000,
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

    return (
      <div className="bg-wework py-28">
        <div className="mx-auto max-w-2xl lg:max-w-7xl sm:py-4 lg:px-8">
          {/* Stacked marquee headings */}
          <div className="text-center overflow-hidden animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black my-2">
              We work in several verticals.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black opacity-40 lg:mr-48 my-2 hidden sm:block">
              We work in several verticals.
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black opacity-20 lg:-mr-32 my-2 hidden sm:block">
              We work in several verticals.
            </h2>
          </div>
        </div>

        <Slider {...settings}>
          {postData.map((items, i) => (
            <div key={i}>
              <div className="bg-white m-3 py-12 my-10 text-center shadow-xl rounded-3xl hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  <Image
                    src={items.imgSrc}
                    alt="team-member"
                    width={140}
                    height={140}
                    className="inline-block m-auto"
                  />
                  <Image
                    src={LinkedInSvg}
                    alt="linkedin"
                    width={100}
                    height={100}
                    className="absolute inline-block position-linkedin"
                  />
                </div>
                <h4 className="text-xl md:text-2xl font-bold pt-12">
                  {items.name}
                </h4>
                <h5 className="text-sm md:text-base font-normal pt-2 pb-2 opacity-50">
                  {items.profession}
                </h5>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
