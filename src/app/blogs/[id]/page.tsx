import ArticleContent from "./components/article-content";
import ArticleHeader from "./components/article-header";
import Discussion from "./components/discussion";
import RelatedArticles from "./components/related-articles";

const BlogDetailedPage = () => {
  return (
    <>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 antialiased">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue">
            <ArticleHeader
              avatar="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
              author="Jese Leos"
              role="Graphic Designer, educator & CEO Flowbite"
              date="Feb. 8, 2022"
              title="How to get started with Flowbite"
            />
            <ArticleContent />

            <Discussion />
          </article>
        </div>
      </main>

      <RelatedArticles />
    </>
  );
};

export default BlogDetailedPage;
