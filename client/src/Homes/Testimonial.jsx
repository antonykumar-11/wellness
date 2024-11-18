import React, { useState } from "react";
import Slider from "react-slick";
import { RiStarFill } from "react-icons/ri";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import Title from "./Title";
import testimonialOne from "../assets/icons/sun.svg";
import testimonialTwo from "../assets/icons/moon.svg";
import quote from "../assets/images/sun.svg";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="w-14 h-12 bg-[#0c1821] hover:bg-black duration-300 rounded-md text-2xl text-gray-400 flex justify-center items-center absolute top-0 right-0 shadow-shadowOne cursor-pointer z-10"
      onClick={onClick}
    >
      <HiArrowRight />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="w-14 h-12 bg-[#0c1821] hover:bg-black duration-300 rounded-md text-2xl text-gray-400 flex justify-center items-center absolute top-0 right-20 shadow-shadowOne cursor-pointer z-10"
      onClick={onClick}
    >
      <HiArrowLeft />
    </div>
  );
}

const Testimonial = () => {
  const [dotActive, setDocActive] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (prev, next) => {
      setDocActive(next);
    },
    appendDots: (dots) => (
      <div
        style={{
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <ul
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={
          i === dotActive
            ? {
                width: "12px",
                height: "12px",
                color: "blue",
                background: "#ff014f",
                borderRadius: "50%",
                cursor: "pointer",
              }
            : {
                width: "12px",
                height: "12px",
                color: "blue",
                background: "gray",
                borderRadius: "50%",
                cursor: "pointer",
              }
        }
      ></div>
    ),
  };
  return (
    <section
      id="testimonial"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <div className="flex justify-center items-center text-center">
        <Title title="WHAT CLIENTS SAY" des="Testimonial" />
      </div>
      <div className="max-w-6xl mx-auto">
        {/* ================ Slider One ================== */}
        <Slider {...settings}>
          <div className="w-full">
            <div className="w-full h-auto flex flex-col lgl:flex-row justify-between">
              <div className="w-full lgl:w-[35%] h-full bg-gradient-to-r from-[#1e2024] to-[#23272b] p-8 rounded-lg shadow-shadowOne flex flex-col md:flex-row lgl:flex-col gap-8 justify-center md:justify-start lgl:justify-center">
                <img
                  className="h-72 md:h-32 lgl:h-72 rounded-lg object-cover"
                  src={testimonialOne}
                  alt="testimonialOne"
                />
                <div className="w-full flex flex-col justify-end">
                  <h3 className="text-2xl font-bold">Vinu Mohanan</h3>
                  <p className="text-base tracking-wide text-gray-500">
                    Accountant
                  </p>
                </div>
              </div>
              <div className="w-full lgl:w-[60%] h-full flex flex-col justify-between">
                <img className="w-20 lgl:w-32" src={quote} alt="quote" />
                <div className="w-full h-[70%] py-10 bg-gradient-to-r from-[#1e2024] to-[#23272b] rounded-lg shadow-shadowOne p-4 lgl:p-8 flex flex-col justify-center gap-4 lgl:gap-8">
                  <div className="flex flex-col justify-between lgl:items-center py-6 border-b-2 border-b-gray-900"></div>
                  <p className="text-base font-titleFont text-gray-400 font-medium tracking-wide leading-6">
                    Veda Wellness center ൽ എനിക്ക് ഇത്രയും മികവുറ്റ വിശ്രമവും
                    മനസ്സിന് സുഖം കണ്ടെത്താനും പൂർണ്ണമായി അനുയോജ്യമായ
                    സ്ഥലമായിരുന്നു . ഇവിടെ എത്തുന്ന എല്ലാപേർക്കും അനുയോജ്യമായ
                    ചികിത്സ കണ്ടെത്താൻ ഇവിടെയുള്ള സ്റ്റാഫ് എല്ലായിപ്പോഴും
                    തയ്യാറായിരിക്കുകയാണ് . ഞാൻ മുഴുവൻതോതിലും പുതിയൊരു
                    വ്യക്തിയായി തിരിച്ചുപോയി.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ================ Slider Two ================== */}

          <div className="w-full">
            <div className="w-full h-auto flex flex-col lgl:flex-row justify-between">
              <div className="w-full lgl:w-[35%] h-full bg-gradient-to-r from-[#1e2024] to-[#23272b] p-8 rounded-lg shadow-shadowOne flex flex-col md:flex-row lgl:flex-col gap-8 justify-center md:justify-start lgl:justify-center">
                <img
                  className="h-72 md:h-32 lgl:h-72 rounded-lg object-cover"
                  src={testimonialTwo}
                  alt="testimonialTwo"
                />
                <div className="w-full flex flex-col justify-end">
                  <h3 className="text-2xl font-bold">Baskaran</h3>
                  <p className="text-base tracking-wide text-gray-500">
                    sales Officer
                  </p>
                </div>
              </div>
              <div className="w-full lgl:w-[60%] h-full flex flex-col justify-between">
                <img className="w-20 lgl:w-32" src={quote} alt="quote" />
                <div className="w-full h-[70%] py-10 bg-gradient-to-r from-[#1e2024] to-[#23272b] rounded-lg shadow-shadowOne p-4 lgl:p-8 flex flex-col justify-center gap-4 lgl:gap-8">
                  <div className="flex flex-col justify-between lgl:items-center py-6 border-b-2 border-b-gray-900"></div>
                  <p className="text-base font-titleFont text-gray-400 font-medium tracking-wide leading-6">
                    Veda Wellness Center ൽ എനിക്ക് അത്ഭുതകരമായ ഒരു അനുഭവം
                    ലഭിച്ചു! അവിടെ ഉള്ള അന്തരീക്ഷം അത്യന്തം ശാന്തവും
                    ആശ്വാസകരവുമാണ്, സർവീസ് പരിപൂർണതയോടെ നടത്തപ്പെടുന്നു. ഞാൻ
                    തീർച്ചയായും വീണ്ടും പോകും !
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ================ Slider Three ================== */}

          <div className="w-full">
            <div className="w-full h-auto flex flex-col lgl:flex-row justify-between">
              <div className="w-full lgl:w-[35%] h-full bg-gradient-to-r from-[#1e2024] to-[#23272b] p-8 rounded-lg shadow-shadowOne flex flex-col md:flex-row lgl:flex-col gap-8 justify-center md:justify-start lgl:justify-center">
                <img
                  className="h-72 md:h-32 lgl:h-72 rounded-lg object-cover"
                  src={testimonialOne}
                  alt="testimonialOne"
                />
                <div className="w-full flex flex-col justify-end">
                  <h3 className="text-2xl font-bold">Santosh</h3>
                  <p className="text-base tracking-wide text-gray-500">
                    Driver
                  </p>
                </div>
              </div>
              <div className="w-full lgl:w-[60%] h-full flex flex-col justify-between">
                <img className="w-20 lgl:w-32" src={quote} alt="quote" />
                <div className="w-full h-[70%] py-10 bg-gradient-to-r from-[#1e2024] to-[#23272b] rounded-lg shadow-shadowOne p-4 lgl:p-8 flex flex-col justify-center gap-4 lgl:gap-8">
                  <div className="flex flex-col justify-between lgl:items-center py-6 border-b-2 border-b-gray-900"></div>
                  <p className="text-base font-titleFont text-gray-400 font-medium tracking-wide leading-6">
                    Veda Wellness Center എന്നത് തിരക്കുപിടിച്ച നഗരത്തിലെ ഒരു
                    യഥാർത്ഥ ആശ്വാസ കേന്ദ്രമായിരുന്നു. ഇവിടെയുള്ള സ്റ്റാഫ് അതീവ
                    സൗഹൃദപരവും പ്രൊഫഷണലും ആയിരുന്നു, ട്രീറ്റ്‌മെന്റുകൾ അത്യന്തം
                    ആശ്വാസകരമായിരുന്നു! ഇത് എന്റെ മനസിനും ശരീരത്തിനും ഒരു ചെറിയ
                    അവധിയായെന്ന് തോന്നി. കൂടുതൽ ട്രീറ്റ്‌മെന്റിനായി ഞാൻ
                    തീർച്ചയായും വീണ്ടും പോകും !
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default Testimonial;
