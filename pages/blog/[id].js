import { getAllPostIds, getPostData } from '../../lib/posts';
import Head from 'next/head';

export default function Blog({ postData }) {
  return (
    <div className="blog-post-container">
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description}/>
      </Head>
      <h2>{postData.title}</h2>
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
}

export async function getStaticPaths() {
  // Return a list of possible value for id
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
