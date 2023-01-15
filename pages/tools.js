import Head from 'next/head';

const Tools = () => {
  return (
    <div>
      <Head>
        <title>NicheButter | Tools</title>
        <meta name="description" content="An epic collection of AI Blogging tools to generate content at lightspeed."/>
      </Head>
      <div className="tools-list">
        <ul>
          <li>
            <a href="topic-selector">Topic Selector - 100 Credits</a>
            <p>Need help chosing what niche to target? Input all of the topics you're thinking of, and we'll pick the most valuable one.</p>
          </li>
          <li>
            <a href="cluster-generator">Cluster Generator - 100 Credits</a>
            <p>Assemble a list of article topics culstered around 3 subtopics in a given niche.</p>
          </li>
          <li>
            <a href="post-generator">Post Generator - 200 Credits</a>
            <p>Create a comprehensive article on any topic.</p>
          </li>
          <li>
            <a href="outline-generator">Outline Generator - 100 Credits</a>
            <p>Generate an outline for a chosen article topic.</p>
          </li>
          <li>
            <a href="intro-generator">Intro Generator - 100 Credits</a>
            <p>Need help getting started? Knock out an introduction crafted to convert, so you can move on with the meat of your article.</p>
          </li>
          <li>
            <a href="blog-title-generator">Title Generator - 100 Credits</a>
            <p>Generate some titles for an article covering your given keywords.</p>
          </li>
          <li>
            <a href="outline-generator">Blog Post from an Outline - 100 Credits</a>
            <p>Turn an outline into a comprehensive article.</p>
          </li>
          <li>
            <a href="conclusion-generator">Conclusion Generator - 100 Credits</a>
            <p>Generate a blog post conclusion for a given topic.</p>
          </li>
          <li>
            <a href="listicle-generator">Listicle Generator - 300 Credits</a>
            <p>Input your topic. Get back a list of items with descriptions and commentary.</p>
          </li>
          <li>
            <a href="competition-analyzer">Competition Analyzer - 100 Credits</a>
            <p>Output a list of competitors in a chosen niche.</p>
          </li>
          <li>
            <a href="https://app.contentcurator.com/tools/niche-discovery/">Niche Analyzer</a>
            <p>This is a tool from Content Curator that will give you a great overview of the industry you're looking to get into.</p>
            <p>Find your niche in the selector and get a sense of the amount of traffic that hits this niche.</p>
            <p>You also get a strong start on the list of competitors in your niche which is crucial for a number of reasons.</p>
          </li>
        </ul>
      </div>
    </div>

  );
};

export default Tools;
