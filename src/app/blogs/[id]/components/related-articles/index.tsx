import { FC } from "react";

type ArticleItemProps = {
  title: string;
  description: string;
  imageUrl: string;
  readTime: string;
};

const ArticleItem: FC<ArticleItemProps> = ({
  title,
  description,
  imageUrl,
  readTime,
}) => {
  return (
    <article className="max-w-xs transition-transform transform duration-500 hover:scale-105 hover:border-dashed hover:border-2 hover:border-gray-300 p-3 hover:rounded-2xl cursor-pointer">
      <a href="#">
        <img src={imageUrl} className="mb-5 rounded-lg" alt="Image 1" />
      </a>
      <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 ">
        <a href="#">{title}</a>
      </h2>
      <p className="mb-4 text-gray-500">{description}</p>
      <a
        href="#"
        className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 hover:no-underline"
      >
        {`Read in ${readTime} minutes`}
      </a>
    </article>
  );
};

const ArticleItems = [
  {
    title: "Our first office",
    description:
      "Over the past year, Volosoft has undergone many changes! After months of preparation.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png",
    readTime: "2 minutes",
  },
  {
    title: "Our first office",
    description:
      "Over the past year, Volosoft has undergone many changes! After months of preparation.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png",
    readTime: "2 minutes",
  },
  {
    title: "Our first office",
    description:
      "Over the past year, Volosoft has undergone many changes! After months of preparation.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png",
    readTime: "2 minutes",
  },
  {
    title: "Our first office",
    description:
      "Over the past year, Volosoft has undergone many changes! After months of preparation.",
    imageUrl:
      "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png",
    readTime: "2 minutes",
  },
];

const RelatedArticles: FC = () => {
  return (
    <aside aria-label="Related articles" className="py-8 lg:py-24 bg-gray-50">
      <div className="px-4 mx-auto max-w-screen-xl">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 ">
          Related articles
        </h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {ArticleItems?.map((item, index) => (
            <ArticleItem
              key={index}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              readTime={item.readTime}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RelatedArticles;
