import { NextRequest, NextResponse } from "next/server";

const colors: string[] = [
  "multi-colored",
  "colorful",
  "color",
  "colored",
  "coloured",
  "colorized",
  "colour",
  "colourized",
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
  "rainbow",
];

function filterPrompt(prompt: string) {
  const regex = new RegExp("\\b(" + colors.join("|") + ")\\b", "gi");
  prompt = prompt.replace(regex, "");
  return prompt;
}

function getPrompt(year: string, clipPrompt: string, location: string) {
  if (year >= "1880" && year < "1890") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1880s photograph, Eastman Dry Plate, early black and white photography, silver gelatin process, film grain"
    );
  } else if (year >= "1890" && year < "1900") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1890s photograph, Kodak Box Camera, black and white photography, film grain,"
    );
  } else if (year >= "1900" && year < "1910") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1900s photograph, , early black and white photography, gelatin silver print, film grain"
    );
  } else if (year >= "1910" && year < "1920") {
    return (
      year.toString() +
      " black and white photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1910s photograph, Kodak No. 1 Autographic Special, black and white photography, film grain,"
    );
  } else if (year >= "1920" && year < "1930") {
    return (
      year.toString() +
      " photograph, black and white photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1920s photograph, Kodak Autographic, black and white photography, film grain,"
    );
  } else if (year >= "1930" && year < "1940") {
    return (
      year.toString() +
      " photograph, black and white photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1930s photograph, Kodak Kodachrome film, sepia photography, analogue photography, film grain, "
    );
  } else if (year >= "1940" && year < "1950") {
    return (
      year.toString() +
      " photograph, black and white photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1940s photograph, Kodak Tri-X, analogue photography, film grain,"
    );
  } else if (year >= "1950" && year < "1960") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1950s photograph, Kodak Ektachrome film, analogue photography, film grain,"
    );
  } else if (year >= "1960" && year < "1970") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1960s photograph, Kodak Kodachrome film, analogue photography, film grain, "
    );
  } else if (year >= "1970" && year < "1980") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1970s photograph, Kodak Ektachrome film, analogue photography, film grain,"
    );
  } else if (year >= "1980" && year < "1990") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1980s photograph, Kodak Ektachrome film, analogue photography, film grain,"
    );
  } else if (year >= "1990" && year < "2000") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", 1990s photograph, Fujifilm Superia film, analogue photography, film grain,"
    );
  } else if (year >= "2000" && year < "2005") {
    return (
      year.toString() +
      " photograph, " +
      location +
      ", " +
      clipPrompt +
      ", early 2000s photograph, color photograph, Kodak Portra film, analogue photography, film grain,"
    );
  } else if (year >= "2005" && year < "2010") {
    return (
      "Photograph taken in " +
      year.toString() +
      " modern color photograph,  " +
      location +
      ", " +
      clipPrompt +
      ", mid 2000s photograph, color photograph, Canon EOS 40D, Nikon digital photography,"
    );
  } else if (year >= "2010" && year < "2020") {
    return (
      "Photograph taken in " +
      year.toString() +
      ", color photograph,  " +
      location +
      ", " +
      clipPrompt +
      ", 2010s photograph, DSLR, Canon EOS, beautiful, Flickr,"
    );
  } else if (year >= "2020") {
    return (
      year.toString() +
      "modern photograph,  " +
      location +
      ", " +
      clipPrompt +
      " 2020s photograph, DSLR, mirrorless cameras, smartphone photography, high-resolution images, AI, 4K, Wallpaper, Flickr, Professional, beautiful,"
    );
  } else {
    return (
      year.toString() +
      " photograph,  " +
      location +
      ", " +
      clipPrompt +
      ", photograph, professional, art"
    );
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const year = data.year;
  const clipPrompt = data.clipPrompt;

  const prompt = year <= "1950" ? filterPrompt(clipPrompt) : clipPrompt;

  const promptText = getPrompt(year, prompt, data.location);

  return NextResponse.json({ promptText });
}
