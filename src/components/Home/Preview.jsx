import React from "react";

const Preview = () => {
  return (
    <section className="flex flex-col justify-center items-center px-4 sm:px-8 py-8 bg-background">
      {/* Outer box with slight background contrast and responsive max width */}
      <div className="rounded-xl shadow-md p-4 md:p-6 w-full max-w-full lg:max-w-6xl bg-gradient-to-br from-primary-100 to-secondary-100">
        {/* Iframe wrapper with 16:9 aspect ratio */}
        <div className="relative w-full aspect-[1.6666]">
          <iframe
            src="https://app.supademo.com/embed/cmbltuiuu00fsyw0i1dfperla?embed_v=2"
            loading="lazy"
            title="www.portxbuilder.com"
            allow="clipboard-write"
            frameBorder="0"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Preview;
