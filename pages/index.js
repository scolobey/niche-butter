import Head from 'next/head';

const Home = () => {

  return (
    <div>
      <Head>
        <title>NicheButter | A Niche Blogging Toolset</title>
      </Head>

      <div className="text-content">
        <div className="header-grow">
          <h2>Tap into a deluge of niche building lubricant.</h2>
        </div>
        <div className="prompt-buttons">
          <a
            className='generate-button'
            href="topic-selector"
          >
            <div className="generate">
              <p>What!?</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
