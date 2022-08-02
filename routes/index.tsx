/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { Handlers } from "$fresh/server.ts";
import { Article, findAllArticles } from "@db";

// dayjs で相対日付を表示するために import
// import dayjs from "https://deno.land/x/dayjs@v1.11.3/src/index.js";
import dayjs from "https://cdn.skypack.dev/dayjs"
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
dayjs.extend(relativeTime); dayjs.locale("ja");



// interface Article {
//   id: string;
//   title: string;
//   created_at: string;
// }

// export const handler: Handlers<Article[]> = { // ②
//   async GET(_, ctx) {
//     const articles: Article[] = [
//       {
//         id: "1",
//         title: "Article 1",
//         created_at: "2022-06-17T00:00:00.000Z",
//       },
//       {
//         id: "2",
//         title: "Article 2",
//         created_at: "2022-06-10T00:00:00.000Z",
//       },
//     ];
//     return ctx.render(articles);
//   },
// };
export const handler: Handlers<Article[]> = {
  async GET(_, ctx) {
    const articles = await findAllArticles();
    return ctx.render(articles);
  },
};


// export default function Home() {
//   return (
//     <div class={tw`p-4 mx-auto max-w-screen-md`}>
//       <img
//         src="/logo.svg"
//         height="100px"
//         alt="the fresh logo: a sliced lemon dripping with juice"
//       />
//       <p class={tw`my-6`}>
//         Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
//         file, and refresh.
//       </p>
//       <Counter start={3} />
//     </div>
//   );
// }
//
// referene: https://zenn.dev/azukiazusa/articles/fresh-tutorial
// export default function Home({data}: PageProps<Article[]>) {
//   return (
//     <div>
//       <Head>
//         <title>Fresh Blog</title>
//       </Head>
//       <div>
//         <h1 class={tw("text-red-500")}>Fresh Blog</h1>
//         <section>
//           <h2>Posts</h2>
//           <ul>
//             {data.map((article) => (
//               <li key={article.id}>
//                 <a href={`articles/${article.id}`}>
//                   <h3>{article.title}</h3>
//                   <time dateTime={article.created_at}>{article.created_at}</time>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </section>
//       </div>
//     </div>
//   );
// }

export default function Home({ data }: PageProps<Article[]>) {
  return (
    <div class={tw("h-screen bg-gray-200")}>
      <Head>
        <title>Fresh Blog</title>
      </Head>
      <div
        class={tw(
          "max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-20 flex flex-col"
        )}
      >
        <h1 class={tw("font-extrabold text-5xl text-gray-800")}>Fresh Blog</h1>
        <section class={tw("mt-8")}>
          <div class={tw("flex justify-between items-center")}>
            <h2 class={tw("text-4xl font-bold text-gray-800 py-4")}>Posts</h2>
            <a
              href="/articles/create"
              class={tw(
                "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              )}
            >
              Create Post
            </a>
          </div>
          {/* <h2 class={tw("text-4xl font-bold text-gray-800 py-4")}>Posts</h2> */}
          <ul>
            {data.map((article) => (
              <li
                class={tw("bg-white p-6 rounded-lg shadow-lg mb-4")}
                key={article.id}
              >
                <a href={`articles/${article.id}`}>
                  <h3
                    class={tw(
                      "text-2xl font-bold mb-2 text-gray-800 hover:text-gray-600 hover:text-underline"
                    )}
                  >
                    {article.title}
                  </h3>
                </a>
                <time
                  class={tw("text-gray-500 text-sm")}
                  dateTime={article.created_at}
                >
                  {dayjs(article.created_at).fromNow()}
                </time>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

// Ref
// https://zenn.dev/azukiazusa/articles/fresh-tutorial
// Log
// supbase: までやった．
// submitの外回りだけやった
// TODO
// - [ ] パスワード
// - [ ] タブ
