const fs = require('fs');
const path = require('path');

const replacements = [
  { from: '#2B3990', to: '#1A9E9E' },
  { from: '#0057b7', to: '#1A9E9E' },
  { from: 'bg-blue-800', to: 'bg-teal-700' },
  { from: 'hover:bg-blue-800', to: 'hover:bg-teal-700' },
  { from: 'bg-indigo-900', to: 'bg-teal-700' },
  { from: '#1A237E', to: '#0F5C5C' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  replacements.forEach(r => {
    if (content.includes(r.from)) {
      content = content.split(r.from).join(r.to);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
