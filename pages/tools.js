import Head from 'next/head';

const Tools = () => {
  return (
    <div>
      <Head>
        <title>NicheButter | Tools</title>
      </Head>
      <div className="tools-list">
        <ul>
          <li>
            <a href="topic-selector">Topic Selector</a>
            <p>Need help chosing what niche to target? Input all of the topics you're thinking of, and we'll pick the most valuable one.</p>
          </li>
          <li>
            <a href="keyword-generator">Cluster Generator</a>
            <p>Assemble a list of article topics culstered around 3 subtopics in a given niche.</p>
          </li>
          <li>
            <a href="outline-generator">Outline Generator</a>
            <p>Write an outline for a blog post on a given topic.</p>
          </li>
          <li>
            <a href="post-generator">Post Generator</a>
            <p>Turn an outline into a comprehensive article.</p>
          </li>
          <li>
            <a href="competition-analyzer">Competition Analyzer</a>
            <p>Output a list of competitors in a chosen niche.</p>
          </li>
          <li>
            <a href="/">Master Tool</a>
            <p>Enter a niche topic and get back an entire set of 30 blog posts clustered around 3 topic clusters. This doesn't work yet. But if it sounds good, send me an email and tell me to hurry up</p>
          </li>
        </ul>
      </div>
    </div>

  );
};

export default Tools;
