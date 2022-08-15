/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { tw } from "@twind";
import { Article, findArticleById, deleteArticle } from "@db";
import dayjs from "dayjs";

interface Data {
  /** DB から取得した記事 */
  article: Article;
}

export const handler: Handlers<Data | null> = {
  async GET(_, ctx) {
    // パスパラメータを取得
    const { id } = ctx.params;
    // パスパラメータのIDを引数に記事を取得
    const article = await findArticleById(id);

    // 記事が取得できなかった場合は null を渡す
    if (!article) {
      return ctx.render(null);
    }

    // 記事が取得できた場合は取得した記事を渡す
    return ctx.render({
      article,
    });
  },
  async POST(_, ctx) {
      const res = await deleteArticle(ctx.params.id);
      if (!res.ok) {
        console.log(res.error);
      }
      return new Response("", {
          status: 303,
          headers: {
              Location: "/",
          },
      });
  }
};

export default function ArticlePage({ data }: PageProps<Data | null>) {
  if (!data) {
    return <div>Not Found</div>
  }

  const { article } = data;


  return (
    <div class={tw("min-h-screen bg-gray-200")}>
      <Head>
        <title>{article.title}</title>
        <link rel="stylesheet" href="/article.css" />
      </Head>
    <div
      class={tw(
        "max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col"
      )}
    >
      <div class={tw("flex justify-between items-center")}>
        <h2 class={tw("text-4xl font-bold text-gray-800 py-4")}></h2>
        {/* <DeleteArticle id={article.id} /> */}
        <form method="POST">
          <button
            type='submit'
            name='delete-article'
            class={tw("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md")}>
            delete
          </button>
        </form>
      </div>
      <article class={tw("rounded-xl border p-5 shadow-md bg-white")}>
        <header>
          <h1 class={tw("font-extrabold text-5xl text-gray-800")}>
            {article.title}
          </h1>
          <time class={tw("text-gray-500 text-sm")} dateTime={article.created_at}>
            {dayjs(article.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </time>
        </header>
      </article>
      </div>
    </div>
  )
}


