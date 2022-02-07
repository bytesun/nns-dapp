describe("landing page", () => {
  it("loads", async () => {
    await browser.url("/v2/");

    await browser.$("h1").waitForExist();

    // Wait for all images to be "complete", i.e. loaded
    browser.waitUntil(
      function () {
        return this.execute(function () {
          const imgs: HTMLCollectionOf<HTMLImageElement> =
            document.getElementsByTagName("img");
          if (imgs.length <= 0) {
            return true;
          }

          return (
            Array.prototype.every.call(imgs, (img) => {
              return img.complete;
            }) && document.readyState === "complete"
          );
        });
      },
      { timeoutMsg: `image wasn't loaded` }
    );

    await browser["screenshot"]("landing-page");
  });
});