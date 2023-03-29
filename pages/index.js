import Head from 'next/head';
import { useState, useEffect } from 'react';

const Home = () => {
  const [topic, setTopic] = useState('');

  const onUserChangedText = (event) => {
    setTopic(event.target.value);
  };

  const sendTopic = (event) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("topic", topic)
    }
  };

  return (
    <div className="content">
      <Head>
        <title>NicheButter | A Niche Blogging Toolset</title>
      </Head>

      <div className="text-content">
        <div className="header-grow">
          <h2>What do you want to write about?</h2>
        </div>
      </div>

      <div className="prompt-container">
        <textarea
          className="prompt-box"
          placeholder="ex: horology, mountain biking, ecotourism"
          value={topic}
          onChange={onUserChangedText}
        />

        <div className="prompt-buttons">
          <a
            className='generate-button'
            onClick={sendTopic}
            href="keyword-cluster-generator"
          >
            <div className="generate">
              <p>Submit</p>
            </div>
          </a>
          <a
            className='confusion-button'
            href="topic-selector"
          >
            <div className="generate">
              <p>¯\_(ツ)_/¯</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
