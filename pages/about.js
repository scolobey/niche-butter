import Head from 'next/head';

const About = () => {
  return (
    <div>
      <Head>
        <title>NicheButter | About</title>
      </Head>
      <div className="header-title">
        <h1>About</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          <p>This thing was built by me, Ryan Goodwin.</p>
          <p>It was pretty heavily influenced by a build on <a href="https://buildspace.so/p/build-ai-writing-assistant-gpt3">BuildSpace</a>.</p>
          <p>I'm a cook. I learned to build software to make <a href="https://www.funkyradish.com/">FunkyRadish</a>, a recipe app that sucks less.</p>
          <p>I also build top secret blogs like <a href="https://www.peakrover.com/">PeakRover</a></p>
          <p>Feel free to email me at minedied@gmail.com if you want.</p>
          <p>Or follow me on twitter @hunter_niche</p>

          <p>Privacy Policy? <a href="/privacy">Click Here</a></p>

        </h2>
      </div>
    </div>
  );
};

export default About;
