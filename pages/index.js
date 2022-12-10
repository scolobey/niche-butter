import Head from 'next/head';

const Home = () => {
  return (
    <div>
      <Head>
        <title>NicheButter | A Niche Blogging Toolset</title>
      </Head>
      <div className="text-content">
        <div className="header-subtitle">
          <h2>Are you ready to tap into a buttery deluge of niche building lubricant?</h2>
        </div>
        <div className="prompt-buttons">
          <a
            className='generate-button'
            href="topic-selector"
          >
            <div className="generate">
              <p>Yes!</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
