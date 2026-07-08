import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogs } from '../data/blogs';
import ArrowIcon from '../components/ui/ArrowIcon';

function renderBlock(block, index) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          key={index}
          className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 mt-12 mb-4 leading-tight"
        >
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3
          key={index}
          className="text-xl md:text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 mt-10 mb-3 leading-tight"
        >
          {block.text}
        </h3>
      );
    case 'h4':
      return (
        <h4
          key={index}
          className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-8 mb-2"
        >
          {block.text}
        </h4>
      );
    case 'p':
      return (
        <p
          key={index}
          className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4"
        >
          {block.text}
        </p>
      );
    case 'callout':
      return (
        <div
          key={index}
          className="my-6 border-l-4 border-[#14b5bc] bg-neutral-50 dark:bg-neutral-900 rounded-r-xl px-6 py-4"
        >
          <p className="text-base font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
            {block.text}
          </p>
        </div>
      );
    case 'list':
      return (
        <ul key={index} className="my-4 space-y-2 ml-2">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-3 text-base text-neutral-600 dark:text-neutral-400"
            >
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#14b5bc] flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-24 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black mb-4">Blog Not Found</h1>
        <p className="text-neutral-500 mb-8">This post doesn't exist or may have been moved.</p>
        <Link
          to="/blogs"
          className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-sm"
        >
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  const currentIndex = blogs.findIndex((b) => b.slug === slug);
  const nextBlog = blogs[currentIndex + 1] || null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate('/blogs')}
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors mb-12 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
        All Articles
      </motion.button>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {blog.category}
            </span>
            <span className="text-xs text-neutral-400">{blog.date}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-400">{blog.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-neutral-900 dark:text-neutral-100 mb-8">
            {blog.title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-12 bg-neutral-100 dark:bg-neutral-900"
        >
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {blog.content.map((block, i) => renderBlock(block, i))}
        </motion.article>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 p-8 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center"
        >
          <p className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-3">
            Ready to Apply This?
          </p>
          <h3 className="text-2xl font-black tracking-tight mb-4">
            Build Your <span style={{color: '#14b5bc'}}>AscentDelta</span> Plan
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6 max-w-md mx-auto">
            Let's audit your D2C business and engineer a path to profitability — in 100 days.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black shadow-lg transition-colors group"
          >
            Let's Talk
            <ArrowIcon size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {nextBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
              Next Article
            </p>
            <Link
              to={`/blogs/${nextBlog.slug}`}
              className="group flex items-center justify-between gap-6 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <div>
                <span className="text-xs text-neutral-400 font-medium">{nextBlog.category}</span>
                <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mt-1 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
                  {nextBlog.title}
                </h4>
              </div>
              <ArrowIcon size={20} className="flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
