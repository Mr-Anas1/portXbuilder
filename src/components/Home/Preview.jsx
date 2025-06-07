import React from "react";

const Preview = () => {
  return (
    <section className="flex flex-col justify-center items-center relative">
      <div
        style={{
          position: "relative",
          boxSizing: "content-box",
          maxHeight: "80vh",
          width: "100%",
          aspectRatio: "1.7777777777777777",
          padding: "40px 0 40px 0",
        }}
      >
        <iframe
          src="https://app.supademo.com/embed/cmbltuiuu00fsyw0i1dfperla?embed_v=2"
          loading="lazy"
          title="www.portxbuilder.com"
          allow="clipboard-write"
          frameBorder="0"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </div>
    </section>
  );
};

export default Preview;
