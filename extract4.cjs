const fs = require('fs');

const lines = fs.readFileSync('src/components/SearchBar.tsx', 'utf8').split('\n');

const startIndex = 197; 
const endIndex = 388; 
let extractedBlock = lines.slice(startIndex, endIndex + 1).join('\n');

extractedBlock = extractedBlock.replace(
  '<div className="relative flex items-center bg-white rounded-2xl shadow-md border-2 border-orange-400/80 focus-within:border-[#F36F21] transition-all overflow-hidden">',
  '<motion.div layout layoutId="searchBarInputBox" transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`relative flex items-center bg-white rounded-full shadow-md border-2 border-orange-400/80 focus-within:border-[#F36F21] overflow-hidden w-full ${isScrolled ? \\\'h-[36px] sm:h-[40px]\\\' : \\\'h-[44px] sm:h-[48px]\\\'}`}>'
);

extractedBlock = extractedBlock.replace(
  '          </div>\n\n          {/* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN */}',
  '          </motion.div>\n\n          {/* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN */}'
);

extractedBlock = extractedBlock.replace(
  '<div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 animate-fade-in max-h-[75vh] overflow-y-auto">',
  '<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 max-h-[75vh] overflow-y-auto">'
);

extractedBlock = extractedBlock.replace(
  '            </div>\n          )}',
  '            </motion.div>\n          )}'
);

const newReturnBlock = `        {/* Main Search Input Container */}
        <div className="relative z-50 flex justify-center w-full min-h-[44px] sm:min-h-[48px]">
           <AnimatePresence>
             {!isScrolled && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full absolute inset-0"
               >
${extractedBlock}
               </motion.div>
             )}
           </AnimatePresence>
           
           {/* If scrolled, mount to the Header Portal! */}
           {isScrolled && document.getElementById('header-search-portal') && createPortal(
${extractedBlock},
             document.getElementById('header-search-portal')!
           )}
        </div>`;

const newLines = [
    ...lines.slice(0, 196),
    newReturnBlock,
    ...lines.slice(389)
];

fs.writeFileSync('src/components/SearchBar.tsx', newLines.join('\n'));
console.log("Success by lines!");
