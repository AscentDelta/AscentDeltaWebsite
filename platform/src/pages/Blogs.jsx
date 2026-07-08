import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogs } from '../data/blogs';
import ArrowIcon from '../components/ui/ArrowIcon';

export default function Blogs() {
  const renderCards = () => {
    const cards = [];
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      cards.push(
        <motion.div
          key={blog.slug}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="h-full"
        >
          <Link
            to={`/blogs/${blog.slug}`}
            className="group h-full flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-900">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-sm">
                {blog.category}
              </span>
            </div>

            <div className="flex flex-col flex-grow p-7">
              <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium mb-4">
                <span>{blog.date}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                <span>{blog.readTime}</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-neutral-100 leading-snug mb-3 group-hover:text-white transition-colors duration-300 line-clamp-2">
                {blog.title}
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed font-light flex-grow line-clamp-3">
                {blog.excerpt}
              </p>

              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mt-6 text-white">
                Read Article{' '}
                <ArrowIcon size={13} />
              </span>
            </div>
          </Link>
        </motion.div>
      );
    }
    return cards;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-white mb-4">
          Blogs
        </h1>
        <p className="text-xl md:text-2xl text-neutral-300 font-light leading-relaxed mb-16 max-w-xl">
          Perspectives on D2C growth, profitability, and commerce strategy from the AscentDelta team.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {renderCards()}
      </div>
    </div>
  );
}
