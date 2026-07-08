const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  const replacements = [
    // App.jsx
    ['bg-black text-white dark:bg-black dark:text-white bg-white text-black light:bg-white light:text-black', 'bg-white text-black dark:bg-black dark:text-white'],
    // Solutions.jsx
    ['border-neutral-800 dark:border-neutral-800 light:border-neutral-200', 'border-neutral-200 dark:border-neutral-800'],
    ['text-neutral-400 dark:text-neutral-400 light:text-neutral-600', 'text-neutral-600 dark:text-neutral-400'],
    ['bg-white dark:bg-white light:bg-black', 'bg-black dark:bg-white'],
    ['grayscale dark:grayscale light:grayscale-0', 'grayscale-0 dark:grayscale'],
    // Portfolio.jsx
    ['bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white', 'bg-black text-white dark:bg-white dark:text-black'],
    ['border border-neutral-800 text-neutral-400 hover:text-white dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white light:border-neutral-200 light:text-neutral-500 light:hover:text-black', 'border border-neutral-200 text-neutral-500 hover:text-black dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white'],
    ['bg-neutral-900 border border-neutral-800 dark:border-neutral-800 light:border-neutral-200', 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'],
    ['invert brightness-0 dark:invert dark:brightness-0 light:invert-0', 'invert-0 dark:invert dark:brightness-0'],
    // Home.jsx
    ['border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-2xl bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-neutral-50/50', 'border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50'],
    ['border border-neutral-800 dark:border-neutral-800 light:border-neutral-200 rounded-3xl relative overflow-hidden bg-gradient-to-br from-black to-neutral-900 dark:from-black dark:to-neutral-900 light:from-white light:to-neutral-100', 'border border-neutral-200 dark:border-neutral-800 rounded-3xl relative overflow-hidden bg-gradient-to-br from-white to-neutral-100 dark:from-black dark:to-neutral-900'],
    ['hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black light:hover:bg-black light:hover:text-white', 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'],
    // Contact.jsx
    ['text-black dark:text-black light:text-white', 'text-white dark:text-black'],
    ['border-b border-neutral-800 dark:border-neutral-800 light:border-neutral-200 py-3 focus:outline-none focus:border-white dark:focus:border-white light:focus:border-black', 'border-b border-neutral-200 dark:border-neutral-800 py-3 focus:outline-none focus:border-black dark:focus:border-white'],
    // About.jsx
    ['text-neutral-300 dark:text-neutral-300 light:text-neutral-700', 'text-neutral-700 dark:text-neutral-300'],
    ['bg-neutral-800 dark:before:bg-neutral-800 light:before:bg-neutral-200', 'before:bg-neutral-200 dark:before:bg-neutral-800'],
    // Button.jsx
    ['hover:bg-neutral-200 dark:hover:bg-neutral-200 light:hover:bg-neutral-800', 'hover:bg-neutral-800 dark:hover:bg-neutral-200'],
    // Marquee.jsx
    ['grayscale contrast-125 dark:grayscale dark:contrast-125 dark:brightness-200 light:grayscale-0 light:contrast-100', 'grayscale-0 contrast-100 dark:grayscale dark:contrast-125 dark:brightness-200'],
    // Dialog.jsx
    ['bg-neutral-900 dark:bg-neutral-900 light:bg-white', 'bg-white dark:bg-neutral-900'],
    ['text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white light:text-neutral-500 light:hover:text-black', 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'],
    // Navbar.jsx
    ['bg-black/80 dark:bg-black/80 light:bg-white/80', 'bg-white/80 dark:bg-black/80'],
    ['text-white dark:text-white light:text-black', 'text-black dark:text-white'],
    ['text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white light:text-neutral-700 light:hover:text-black', 'text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-white'],
    ['hover:bg-neutral-800 dark:hover:bg-neutral-800 light:hover:bg-neutral-200', 'hover:bg-neutral-200 dark:hover:bg-neutral-800'],
    // Footer.jsx
    ['text-neutral-500 dark:text-neutral-500 light:text-neutral-400', 'text-neutral-500']
  ];

  let original = content;
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
