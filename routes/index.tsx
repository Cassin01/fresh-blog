/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps, HandlerContext } from "$fresh/server.ts";
import { Head } from "$fresh/src/runtime/head.ts";
// import { Handlers } from "$fresh/server.ts";
import { Article, findAllArticles } from "@db";
import { gitHubApi } from "@/communication/github.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

// dayjs で相対日付を表示するために import
// import dayjs from "https://deno.land/x/dayjs@v1.11.3/src/index.js";
import dayjs from "https://cdn.skypack.dev/dayjs"
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
dayjs.extend(relativeTime); dayjs.locale("ja");

export async function handler(req: Request, ctx: HandlerContext): Promise<Response> {
    // Get cookie from request header and parse it
    const maybeAccessToken = getCookies(req.headers)["deploy_chat_token"];

    // TODO: Here get user data from database.

    // Get all articles
    const articles = await findAllArticles();

    if (maybeAccessToken) {
      return ctx.render(articles);
    }

    // This is an oauth callback request.
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      // return ctx.render(articles);
        return ctx.render(false);
    }

    // return ctx.render(articles)

    // FIXME: there are some `not work well`s bellow.

    const accessToken = await gitHubApi.getAccessToken(code);
    // const userData = await gitHubApi.getUserData(accessToken);


    // TODO: Here set new user to database.

    const response  = await ctx.render(articles);
    setCookie(response.headers, {
      name: "deploy_chat_token",
      value: accessToken,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    return response;
    // return ctx.render(articles);
  };

export default function Home({ data }: PageProps<Article[]>) {
  return (
    <div class={tw("min-h-screen bg-gray-200")}>
      <Head>
        <title>Fresh Blog</title>
      </Head>
      {data ? (
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
      ) : (
        <div class={tw`flex justify-center items-center flex-col`}>
          <a
            href="/api/login"
            class={tw `bg-gray-900 text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer mt-2`}
          >
          </a>
          <span>Sign up with Github</span>
        </div>
      )}
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
// - [/] タブ
