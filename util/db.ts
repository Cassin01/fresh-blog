import { Client } from "postgress";
import "dotenv/load.ts";

/**
 * articles テーブルの型
 */
export interface Article {
    id: string;
    title: string;
    content: string;
    created_at: string;
}

// DB クライアントを作成する
const client = new Client({
    user: Deno.env.get("DB_USER"),
    database: Deno.env.get("POSTGRES_DB"),
    hostname: Deno.env.get('DB_HOST'),
    password: Deno.env.get('DB_PASSWORD'),
    port: Deno.env.get('DB_PORT'),
});

// データベースに接続
await client.connect();

/**
 * すべての記事を取得する
 */
export const findAllArticles = async() => {
    try {
        const result = await client.queryObject<Article>(
            "SELECT * FROM articles ORDER BY created_at DESC"
        );
        return result.rows;
    } catch (e) {
        console.error(e);
        return [];
    }
}

/**
 * IDを指定して記事を取得する
 */
export const findArticleById = async(id: string) => {
    try {
        const result = await client.queryObject<Article>(
            "SELECT * FROM articles WHERE id = $1",
            [id]
        );
        if (result.rowCount === 0) {
            return null
        }
        return result.rows[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * 記事を新規作成する
 */
export const createArticle = async (article: Pick<Article, 'title' | 'content'>) => {
    try {
        const result = await client.queryObject<Article>(
            "INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *",
            [article.title, article.content]
        );
        return result.rows[0];
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * 記事を削除する
 */
export type Result<E = Error> =
    | { ok: true }
    | { ok: false; error: E };
export const deleteArticle = async (id: string): Promise<Result> => {
    try {
        const result = await client.queryObject<Article>(
            "DELETE FROM articles WHERE id = $1",
            [id]
        );
        if (result.rowCount === 0) {
            // id not found
            return { ok: false, error: Error("id not found")}
        }
        return { ok: true }
    } catch (e) {
        // console.error(e);
        return { ok: false, error: e }
    }
}
