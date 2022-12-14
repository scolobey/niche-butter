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
            <a href="cluster-generator">Cluster Generator</a>
            <p>Assemble a list of article topics culstered around 3 subtopics in a given niche.</p>
          </li>
          <li>
            <a href="post-generator">Post Generator</a>
            <p>Turn an outline into a comprehensive article.</p>
          </li>
          <li>
            <a href="outline-generator">Outline Generator</a>
            <p>Generate an outline for a chosen article topic.</p>
          </li>
          <li>
            <a href="outline-generator">Blog Post from an Outline</a>
            <p>Generate an articel from an outline.</p>
          </li>
          <li>
            <a href="competition-analyzer">Competition Analyzer</a>
            <p>Output a list of competitors in a chosen niche.</p>
          </li>
        </ul>
      </div>
    </div>

  );
};

export default Tools;
