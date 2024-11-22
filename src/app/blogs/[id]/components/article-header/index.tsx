import React from "react";

interface ArticleHeaderProps {
  role: string;
  author: string;
  date: string;
  avatar: string;
  title: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  author,
  date,
  avatar,
  role,
  title,
}) => {
  return (
    <header className="mb-4 lg:mb-6 not-format">
      <address className="flex items-center mb-6 not-italic">
        <div className="inline-flex items-center mr-3 text-sm text-gray-900 ">
          <img
            className="mr-4 w-16 h-16 rounded-full"
            src={avatar}
            alt="avatar-image"
          />
          <div>
            <a href="#" rel="author" className="text-xl font-bold  ">
              {author}
            </a>
            <p className="text-base text-gray-500">{role}</p>
            <p className="text-base text-gray-500">
              <time dateTime="2022-02-08" title="February 8th, 2022">
                {date}
              </time>
            </p>
          </div>
        </div>
      </address>
      <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl ">
        {title}
      </h1>
    </header>
  );
};

export default ArticleHeader;
