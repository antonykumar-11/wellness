import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const LeftBanner = () => {
  const [text] = useTypewriter({
    words: [
      "ആനന്ദം വിരൽ തുമ്പിൽ",
      "മനസിനും ശരീരത്തിനും ഒരുപോലെ ",
      "ഓരോ തലോടലും സുഖം",
      "ആനന്ദം ആശ്വാസം ആസ്വദിക്കുവിൻ ",
    ],
    loop: true,
    typeSpeed: 20,
    deleteSpeed: 10,
    delaySpeed: 2000,
  });

  return (
    <div className="w-full lgl:w-1/2 flex flex-col gap-20">
      <div className="flex flex-col gap-5">
        <h4
          className="text-lg font-normal"
          style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}
        >
          ഒരു അടി പൊളി മസ്സാജ് ആയാലോ ?
        </h4>
        <h1 className="text-5xl font-bold text-white">
          Hi, I'm{" "}
          <span className="text-designColor capitalize">VEDA WELLNESS</span>
        </h1>
        <h2
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}
        >
          <span>{text}</span>
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
            cursorColor="#ff014f"
          />
        </h2>
        <p
          className="text-base font-bodyFont leading-6 tracking-wide"
          style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}
        >
          തിരുവനന്തപുരത്തെ veda wellness സെൻററിൽ ഓരോ വ്യക്തികൾക്കും അവരുടെ
          ആവശ്യത്തിന് അനുയോജ്യമായ രീതിയിൽ മസ്സാജ് ചികിത്സകൾ പ്രദാനം ചെയ്യുന്നു
          ജീവിതത്തിന്റ തിരക്ക് പിടിച്ച സമയത്തിനിടയിൽ മനസ്സും ശരീരവും
          പൂർണ്ണതൃപ്തപിയും തിരക്കുകളിൽ നിന്നും ഒരു മോചനം ലഭിക്കാൻ ഇവിടെ വരൂ.
          നിങ്ങളുടെ സമാധാനത്തിനായുള്ള സ്വർഗ്ഗമായ veda wellness ൽ തികഞ്ഞ
          സമാധാനവും നിങ്ങളുടെ ദിവസേനയുടെ പിരിമുറുക്കം അലിഞ്ഞുപോകുകയും ആശ്വാസം
          പ്രധാനം ചെയ്യുകയും ചെയ്യും. നിങ്ങളുടെ ശരീരത്തിനും മനസ്സിനും പുതു ജീവന്
          നൽകുന്നതിനായി ഞങ്ങളുടെ സേവനങ്ങൾ ശ്രദ്ധാപൂർവ്വം തയ്യാറാക്കിയതാണ്,
          നിങ്ങളുടെ ജീവിതത്തിന് ഇടയിൽ സമാധാനത്തിന്റെ ഒരു തിരുശ്ശീല ഒരുക്കുകയാണ്
          ഞങ്ങൾ. ആകെ ആശ്വാസത്തിനായി വിശാലമായ, സൗമ്യമായ massage മുഖേന ആശ്വാസവും
          പിരിമുറുക്കമോചനവും പ്രദാനം ചെയ്യുന്നു.
        </p>
      </div>
      {/* Media */}
      {/* <Media /> */}
    </div>
  );
};

export default LeftBanner;
