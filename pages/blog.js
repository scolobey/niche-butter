import Head from 'next/head';
import Link from 'next/link';

import { useState } from 'react';

import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const Blog = ({ allPostsData }) => {
  const [blogData, setBlogData] = useState('');

  return (
    <div className="blog-container">
      <Head>
        <title>NicheButter | Blog</title>
      </Head>

      {allPostsData.map(({ id, date, title }) => (
        <Link href={`/blog/${id}`}>
          <div className="blog-grid-item" key={id}>
            <div className="blog-title">{title}</div>
          </div>
        </Link>

      ))}
    </div>

  );
};

export default Blog;
