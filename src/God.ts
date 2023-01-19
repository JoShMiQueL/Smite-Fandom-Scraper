import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";
import { normalize } from "./utils.ts";
import * as fs from "https://deno.land/std@0.173.0/fs/mod.ts";
import { FsAccessFileNotExists } from "./FsAccessFileNotExists.ts";
/**
 * God object
 */
interface God {
  name: string;
  link: string;
  prev_god?: string | null;
  next_god?: string | null;
  god_icon: string;
  god_card: string;
  summary: {
    title: string;
    pantheon: string;
    type: string;
    class: string;
    pros: string;
    difficulty: string;
    release_date: string;
    favor: number;
    gems: number;
    voicelines: string;
    voice_actor: string;
  };
  stats: {
    health: string;
    mana: string;
    speed: string;
    range: string;
    attack_speed: string;
    basic_attack: {
      damage: string;
      progression: string;
    };
    protecion: {
      physical: string;
      magical: string;
    };
    regen: {
      hp5: string;
      mp5: string;
    };
  };
}

/**
 * Base URL from the Smite Fandom website
 */
const baseUrl = "https://smite.fandom.com";

/**
 *  Get the list of all url's from the gods.
 * @returns {Promise<string[]>} The list of all url's from the gods.
 */
async function getListOfGodsUrl(): Promise<string[]> {
  const url = `${baseUrl}/wiki/List_of_gods`;
  const response = await fetch(url);
  const $ = load(await response.text());
  const arrayGods = $(".blue-window > tbody > tr:not(:nth-child(1))")
    .map(
      (i, el) => `${baseUrl}${$(el).find("td:nth-child(2) > a").attr("href")}`
    )
    .toArray();
  return arrayGods;
}

/**
 * Get the json from the god.
 * @param url The url of the god.
 * @returns {Promise<God>} The json from the god.
 */
async function getGod(url: string): Promise<God> {
  try {
    const response = await fetch(url);
    const $ = load(await response.text());
    const godObject = {
      name: normalize($(".title").text()),
      link: url,
      prev_god: null,
      next_god: null,
      god_icon: "",
      god_card: $(
        ".infobox > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > a:nth-child(1) > img:nth-child(1)"
      )
        .attr("data-src")!
        .replace(/\/revision.+/g, ""),
      summary: {
        title: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > b:nth-child(1)"
          ).text()
        ),
        pantheon: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)"
          ).text()
        ),
        type: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)"
          ).text()
        ),
        class: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(7) > td:nth-child(2)"
          ).text()
        ),
        pros: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2)"
          ).text()
        ),
        difficulty: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(2)"
          ).text()
        ),
        release_date: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)"
          ).text()
        ),
        favor: Number(
          normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(11) > td:nth-child(2)"
            )
              .text()
              .replace(",", "")
          )
        ),
        gems: Number(
          normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(2)"
            ).text()
          )
        ),
        voicelines:
          baseUrl +
          normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(13) > td:nth-child(2) > a"
            ).attr("href")!
          ),
        voice_actor: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(14) > td:nth-child(2)"
          ).text()
        ),
      },
      stats: {
        health: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(16) > td:nth-child(2) > font:nth-child(1)"
          ).text()
        ),
        mana: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(17) > td:nth-child(2) > font:nth-child(1)"
          ).text()
        ),
        speed: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(18) > td:nth-child(2)"
          ).text()
        ),
        range: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(19) > td:nth-child(2)"
          ).text()
        ),
        attack_speed: normalize(
          $(
            ".infobox > tbody:nth-child(1) > tr:nth-child(20) > td:nth-child(2)"
          ).text()
        ),
        basic_attack: {
          damage: normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(22) > td:nth-child(2)"
            ).text()
          ),
          progression: normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(23) > td:nth-child(2)"
            ).text()
          ),
        },
        protecion: {
          physical: normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(25) > td:nth-child(2)"
            ).text()
          ),
          magical: normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(26) > td:nth-child(2)"
            ).text()
          ),
        },
        regen: {
          hp5: normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(28) > td:nth-child(2)"
            ).text()
          ),
          mp5: normalize(
            $(
              ".infobox > tbody:nth-child(1) > tr:nth-child(29) > td:nth-child(2)"
            ).text()
          ),
        },
      },
    };
    return godObject;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to get god ${url}`);
  }
}

interface Erl {
  code: string;
  path: string;
}

/**
 * Get the json array from the gods.
 * @returns {Promise<God[]>} The json array from the gods.
 */
export async function _getListOfGods(): Promise<God[]> {
  const listOfGodsUrl = await getListOfGodsUrl();
  return Promise.all(listOfGodsUrl.map((url) => getGod(url)));
}

export async function getListOfGods() {
  try {
    console.log("Getting list of gods...");
    const gods = await _getListOfGods();
    console.log("God list retrieved.");
    const godsWithImages: Promise<God[]> = Promise.all(
      gods.map(async (god, i) => {
        let request = await fetch(god.link);
        let $ = load(await request.text());
        if (i === 0) {
          const obj = {
            ...god,
            next_god:
              baseUrl +
              $(
                ".blue-window > p:nth-child(1) > span:nth-child(2) > a:nth-child(1)"
              ).attr("href"),
          };
          // obj.god_icon = $(".blue-window > p:nth-child(1) > span:nth-child(2) > span > a > img").attr("src");
          request = await fetch(obj.next_god);
          $ = load(await request.text());
          obj.god_icon = $(
            ".blue-window > p:nth-child(1) > span:nth-child(1) > span:nth-child(2) > a:nth-child(1) > img:nth-child(1)"
          )
            .attr("data-src")!
            .replace(/\/revision.+/g, "");
          return obj;
        }
        if (i === gods.length - 1) {
          const obj = {
            ...god,
            prev_god:
              baseUrl +
              $(
                ".blue-window > p:nth-child(1) > span:nth-child(1) > a:nth-child(1)"
              ).attr("href"),
          };
          request = await fetch(obj.prev_god);
          $ = load(await request.text());
          obj.god_icon = $(
            ".blue-window > p:nth-child(1) > span:nth-child(2) > span:nth-child(2) > a:nth-child(1) > img:nth-child(1)"
          )
            .attr("data-src")!
            .replace(/\/revision.+/g, "");
          return obj;
        }
        const obj = {
          ...god,
          next_god:
            baseUrl +
            $(
              ".blue-window > p:nth-child(1) > span:nth-child(2) > a:nth-child(1)"
            ).attr("href"),
          prev_god:
            baseUrl +
            $(
              ".blue-window > p:nth-child(1) > span:nth-child(1) > a:nth-child(1)"
            ).attr("href"),
        };
        request = await fetch(obj.prev_god);
        $ = load(await request.text());
        obj.god_icon = $(
          ".blue-window > p:nth-child(1) > span:nth-child(2) > span:nth-child(2) > a:nth-child(1) > img:nth-child(1)"
        )
          .attr("data-src")!
          .replace(/\/revision.+/g, "");
        return obj;
      })
    );
    Deno.writeFileSync(
      "./gods.json",
      new TextEncoder().encode(JSON.stringify(await godsWithImages, null, 2))
    );
  } catch (error) {
    // AccessSync Error
    if (
      error !== null &&
      typeof error === "object" &&
      Object.hasOwn(error, "code")
    ) {
      const e = <Erl>error;
      if (typeof e.code === "string" && e.code === "ENOENT") {
        throw new FsAccessFileNotExists(e.path);
      }
    }
  }
}
