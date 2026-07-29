const fs = require('fs');

let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

// Using regex with /g to replace all occurrences globally regardless of duplication
code = code.replace(
  /\{isListening \? <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" \/> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" \/>\}\s*<\/button>\s*<\/div>\s*\{\/\* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN \*\/\}/g,
  '{isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}\n            </button>\n          </motion.div>\n\n          {/* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN */}'
);

code = code.replace(
  /<ArrowRight className="w-3\.5 h-3\.5 text-amber-300" \/>\s*<\/div>\s*<\/div>\s*\)\}/g,
  '<ArrowRight className="w-3.5 h-3.5 text-amber-300" />\n              </div>\n            </motion.div>\n          )}'
);

fs.writeFileSync('src/components/SearchBar.tsx', code);
console.log("Success replacing closures!");
