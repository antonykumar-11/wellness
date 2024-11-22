import React from "react";
import bannerImg2 from "../assets/images/massage2.png";

const Features = () => {
  return (
    <section
      id="features"
      className="w-full pt-10 pb-20 flex flex-col gap-10 lg:flex-row items-center border-b-[1px] font-titleFont border-b-black px-6"
    >
      {/* Right Side: Image */}
      <div className="lg:w-1/2 flex justify-center">
        <img
          src={bannerImg2} // Replace with your image URL
          alt="Relaxation and Wellness"
          className="w-full h-auto max-w-md rounded-lg shadow-lg"
        />
      </div>
      {/* Left Side: Text Content */}
      <div className="lg:w-1/2 text-gray-800 text-lg leading-relaxed">
        <p
          className="text-white"
          style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}
        >
          Veda Wellness ൽ, ഞങ്ങൾ വിശ്വസിക്കുന്നത് ശരിയായ ആരോഗ്യപരിപാലനം
          ശരീരത്തിലേക്കുമാത്രമല്ല, അത് മനസ്സിന്റെയും ആത്മാവിന്റെയും
          പോഷണത്തിലേക്കുള്ള ഒരു യാത്രയാണ്. ആരോഗ്യo ഒറ്റപ്പെട്ട ഒരു ആശയമല്ലെന്ന്
          നാം അംഗീകരിക്കുന്നു; അത് മാംസപേശി , ദൈനംദിന മാനസിക സമ്മർദ്ദം മുതൽ
          ആത്മീയ സമാധാനം വരെ എല്ലാം ഉൾക്കൊള്ളുന്നു. ഈ മുഴുവൻ വശങ്ങളും
          പരിഗണിക്കുന്നതും സമഗ്രമായ സുഖാനുഭവം വളർത്തുന്നതുമായ ഒരു സ്ഥലം
          നല്കുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം. ദിവസേന ചെയ്തു കൊണ്ടിരിക്കുന്ന കാര്യങ്ങളിൽ
          നിന്ന് ഒരു മാറ്റം വരാനും ആത്മശാന്തി സന്തോഷം കണ്ടെത്താനും നിങ്ങളെ
          സഹായിക്കുന്ന ഒരു 'റിലാക്സ് & റീചാർജ്' നു വേണ്ടിയുള്ള സ്ഥലം ഞങ്ങൾ
          നിങ്ങൾക്കായി ഒരുക്കിയിരിക്കുന്നു.
        </p>
      </div>
    </section>
  );
};

export default Features;
