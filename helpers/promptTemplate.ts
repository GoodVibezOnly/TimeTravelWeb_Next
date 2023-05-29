const colors: string[] = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "black",
  "color",
  "colorized",
];

function filterPrompt(prompt: string) {
  for (let i = 0; i < colors.length; i++) {
    const regex = new RegExp(colors[i] + "\\s*", "gi");
    prompt = prompt.replace(regex, "");
  }
  return prompt;
}

export function getPrompt(year: string | number, prompt: string) {
  const clipPrompt = year <= "1950" ? filterPrompt(prompt) : prompt;
  if (year >= "1900" && year < "1910") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1900s photograph, Lumière Autochrome plates, old, black and white photography, analogue photography, film grain,"
    );
  } else if (year >= "1910" && year < "1920") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1910s photograph, Kodak No. 1 Autographic Special, black and white photography, film grain,"
    );
  } else if (year >= "1920" && year < "1930") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1920s photograph, Kodak Autographic, black and white photography, film grain,"
    );
  } else if (year >= "1930" && year < "1940") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1930s photograph, Kodak Kodachrome film, sepia photography, analogue photography, film grain, "
    );
  } else if (year >= "1940" && year < "1950") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1940s photograph, Kodak Tri-X, analogue photography, film grain,"
    );
  } else if (year >= "1950" && year < "1960") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1950s photograph, Kodak Ektachrome film, analogue photography, film grain,"
    );
  } else if (year >= "1960" && year < "1970") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1960s photograph, Kodak Kodachrome film, analogue photography, film grain,"
    );
  } else if (year >= "1970" && year < "1980") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1970s photograph, Fujifilm Velvia film, analogue photography, film grain,"
    );
  } else if (year >= "1980" && year < "1990") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1980s photograph, Kodak Ektachrome film, analogue photography, film grain,"
    );
  } else if (year >= "1990" && year < "2000") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", 1990s photograph, Fujifilm Superia film, analogue photography, film grain,"
    );
  } else if (year >= "2000" && year < "2005") {
    return (
      year.toString() +
      " photograph, " +
      clipPrompt +
      ", early 2000s photograph, color photograph, Kodak Portra film, analogue photography, film grain,"
    );
  } else if (year >= "2005" && year < "2010") {
    return (
      "Photograph taken in " +
      year.toString() +
      " modern color photograph,  " +
      clipPrompt +
      ", mid 2000s photograph, color photograph, Canon EOS 40D, Nikon digital photography,"
    );
  } else if (year >= "2010" && year < "2020") {
    return (
      "Photograph taken in " +
      year.toString() +
      ", color photograph,  " +
      clipPrompt +
      ", 2010s photograph, DSLR, Canon EOS, beautiful, Flickr,"
    );
  } else if (year >= "2020") {
    return (
      year.toString() +
      "modern photograph,  " +
      clipPrompt +
      " 2020s photograph, smartphone, iPhone, Samsung Galaxy, Google Pixel, computational photography, AI, 4K,"
    );
  } else {
    return (
      year.toString() +
      " photograph,  " +
      clipPrompt +
      ", photograph, professional, art"
    );
  }
}
