import Link from "next/link";
import Image from "next/image";
import { FaTiktok } from "react-icons/fa";

interface ProductType {
  id: number;
  section: string;
  link: { label: string; url: string }[];
}

const products: ProductType[] = [
  {
    id: 1,
    section: "Menu",
    link: [
      { label: "Home", url: "/" },
      { label: "Request for Tutor", url: "/request-for-tutors" },
      { label: "Register as a Tutor", url: "/register-tutor" },
      { label: "Contact Us", url: "/#keep-in-touch-section" },
    ],
  },
  {
    id: 2,
    section: "Resources",
    link: [
      { label: "Blog", url: "/blogs" },
      { label: "Testimonials", url: "/#testimonials-section" },
      { label: "FAQs", url: "/#faq-section" },
      { label: "About Us", url: "/#aboutus-section" },
    ],
  },
  {
    id: 3,
    section: "Academics",
    link: [
      { label: "Grades and Subjects", url: "/grades-and-subjects" },
      { label: "Test Papers", url: "/test-papers" },
    ],
  },
  {
    id: 4,
    section: "Tuition",
    link: [{ label: "Tuition Rates", url: "/tuition-rates" }],
  },
];

const footer = () => {
  return (
    <div className="bg-black" id="first-section">
      <div className="mx-auto max-w-2xl pt-4 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-4 grid grid-cols-1 gap-y-5 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">
          {/* COLUMN-1 */}
          <div className="col-span-4">
            <h3 className="text-white text-2xl font-bold leading-snug mb-4 lg:mb-10">
              Tuition Lanka
            </h3>

            <div className="flex gap-4">
              <div className="footer-icons">
                <a
                  href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={"/images/footer/vec.svg"}
                    alt="facebook"
                    width={15}
                    height={20}
                  />
                </a>
              </div>

              <div className="footer-icons">
                <a
                  href={process.env.NEXT_PUBLIC_TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok className="text-white" size={20} />
                </a>
              </div>

              <div className="footer-icons">
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={"/images/footer/instagram.svg"}
                    alt="instagram"
                    width={20}
                    height={20}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN-2/3 */}

          {products.map((product) => (
            <div key={product.id} className="group relative col-span-2">
              <p className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                {product.section}
              </p>
              <ul>
                {product.link.map((linkObj, index) => (
                  <li key={index} className="mb-3">
                    <Link
                      href={linkObj.url}
                      className="text-white text-sm font-normal mb-4 hover:text-gray-300 transition"
                    >
                      {linkObj.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        <div className="pb-5 px-4 sm:px-6 lg:px-4 border-solid border-t border-footer">
          <div className="mt-4 grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 xl:gap-x-8">
            <div>
              <p className="text-center md:text-start text-offwhite text-sm">
                @2026 - All Rights Reserved by tuitionlanka.com
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link href="/">
                <p className="text-offwhite text-sm pr-6">Privacy policy</p>
              </Link>
              <Link href="/">
                <p className="text-offwhite text-sm pl-6 border-solid border-l border-footer">
                  Terms &amp; conditions
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default footer;
