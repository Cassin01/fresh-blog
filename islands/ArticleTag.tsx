/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { tw } from "@twind";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
    initialValue?: string;
}

export default function articleTag({ initialValue = "" }: Props) {
    const [tag, setTag] = useState(initialValue);

    const CleanData = (lst: Array<string>) => {
        const hash: {[name: string]: string} = {}
        lst.forEach((t: string) => {
            if (!(t in hash)) {
                hash[t] = "val";
            }
        });

        // TODO: Check if there is each element in `hash` key in the global tag list.
        // if the key is not exist, ignore this key.

        const new_lst: string[] = []
        Object.keys(hash).forEach((k: string) => {
            new_lst.push(k);
        });

        return new_lst;
    };

    const handleChange = (e: Event) => {
        const target = e.target as HTMLTextAreaElement;
        const new_tag = CleanData(target.value.split(" ")).join(" ");
        setTag(new_tag);
    };

    return (
        <div>
            <label class={tw("text-gray-500 text-sm")} htmlFor="tag">
                Tag
            </label>
            <input
                id="tag"
                class={tw("w-full p-2 border border-gray-300 rounded-md")}
                type="text"
                name="tag"
                // list="article-tags"
                value={tag}
                onChange={handleChange}
            />
            {/* <datalist id="article-tags"> */}
            {/*     <option value="html"/> */}
            {/*     <option value="css"/> */}
            {/* </datalist> */}
        </div>
    )
}
