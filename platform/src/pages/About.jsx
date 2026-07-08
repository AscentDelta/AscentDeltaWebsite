import { motion } from 'framer-motion';

export default function About() {
  const timeline = [
    {
      heading: "How We Started",
      text: "Founded by the team behind Bombay Shaving Company and Bombae, 100Days was incepted to help investor brands accelerate online revenue with precision. With over 50 years of combined experience, we manage 10+ DTC stores across diverse sectors with powerful in-house digital tools and content.",
      img: "1.png",
      span: "md:col-span-2",
      layout: "flex-col lg:flex-row"
    },
    {
      heading: "Our Mission Today",
      text: "We believe in cutting straight to the point, so in simple terms - our mission is to help and enable modern-day brands build digital commerce excellence. Scaling with success and without excuses is our bottom line.",
      img: "2.png",
      span: "col-span-1",
      layout: "flex-col"
    },
    {
      heading: "Quietly Building Giants",
      text: "The team behind 100Days has been quietly has been helping us cumulatively generate colossal numbers.",
      img: "3.png",
      span: "col-span-1",
      layout: "flex-col-reverse"
    },
  ];

  const renderTimeline = () => {
    const items = [];
    for (let i = 0; i < timeline.length; i++) {
      items.push(
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className={`group relative overflow-hidden rounded-[2.5rem] bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-500 flex ${timeline[i].layout} ${timeline[i].span} gap-8 p-10 md:p-14`}
        >
          <div className="flex-1 flex flex-col justify-center">
            {timeline[i].heading && (
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{color: '#14b5bc'}}>{timeline[i].heading}</p>
            )}
            <p className="text-xl md:text-2xl leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
              {timeline[i].text}
            </p>
          </div>
          <div className="flex-1 flex justify-center items-center min-h-[250px] lg:min-h-[350px]">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              src={timeline[i].img.startsWith('/') ? timeline[i].img : `/From 0 to 100 days/${timeline[i].img}`}
              alt="Narrative Illustration" 
              className="w-full h-full object-contain max-h-[300px] opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </motion.div>
      );
    }
    return items;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[1.05] text-black dark:text-white mb-6">About Us</h1>
        <p className="text-xl md:text-2xl text-black dark:text-neutral-300 font-light leading-relaxed max-w-2xl">
          The core team, the journey, and the execution engine behind India's fastest-growing digital brands.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden mb-16">
        {[
          { value: '2021', label: 'Founded' },
          { value: '14+', label: 'Brands Scaled' },
          { value: '5+', label: 'Years of Expertise' },
          { value: '100%', label: 'Execution Focus' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-black px-8 py-8 flex flex-col gap-1">
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white">{stat.value}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
        {renderTimeline()}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden mt-16">
        {[
          { value: '₹1000 Cr', label: 'GMV on QComm' },
          { value: '12 Cr', label: 'Annual D2C Visitors' },
          { value: '50 Cr', label: 'Annual Reach' },
          { value: '60L', label: 'Annual Shipments' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-black px-8 py-8 flex flex-col gap-1">
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white">{stat.value}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="px-8 py-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Why choose us?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800">
          {[
            {
              title: 'One Unified Team',
              desc: 'No demarcation, only ownership. The CEO never knows who the client is, and who is from 100Days.',
            },
            {
              title: 'Entire P&L Ownership',
              desc: 'We measure our success basis the overall P&L delivery, not just performance metrics.',
            },
            {
              title: 'Accountability = Growth',
              desc: "We give our clients total and constant access to business because we know real growth doesn't start in silos.",
            },
          ].map((item) => (
            <div key={item.title} className="px-8 py-8 flex flex-col gap-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
