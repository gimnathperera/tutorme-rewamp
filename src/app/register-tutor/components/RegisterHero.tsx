"use client";

const RegisterHero = () => {
  return (
    <div className="mx-auto max-w-7xl my-10 sm:py-10 px-6 lg:px-8">
      <div className="bg-digital rounded-3xl bg-primary-700 py-16  ">
        <div className="text-center">
          <div className="py-3">
            <button className="text-white bg-white/20 hover:shadow-xl text-sm md:text-lg font-bold px-6 py-2 rounded-3xl tracking-wider hover:bg-white/70 hover:text-[#B01D4C] transition-all">
              Join Our Tutor Network
            </button>
          </div>
          <div className="py-3">
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              Register As A <br />
              Tutor
            </h1>
          </div>
          <div className="my-7">
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Fill up this following form for EASY candidate assignments directly via SMS!
              <br />
              <span className="font-semibold">100% Available Assignments Weekly! 😊</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterHero;