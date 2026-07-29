const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const startStr = '        {/* Main Search Input Container */}\n        <div className="relative">\n';
const endStr = '            </motion.div>\n          )}\n        </div>\n';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);
if (startIdx === -1 || endIdx === -1) {
    console.error("Not found!", startIdx, endIdx);
    process.exit(1);
}

let searchContentRaw = code.substring(startIdx + startStr.length, endIdx + '            </motion.div>\n          )}\n'.length);

let newReturnBlock = `        {/* Main Search Input Container */}
        <div className="relative z-50 flex justify-center w-full min-h-[44px] sm:min-h-[48px]">
           <AnimatePresence>
             {!isScrolled && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full absolute inset-0"
               >
                 <div className="relative w-full z-50">
${searchContentRaw}                 </div>
               </motion.div>
             )}
           </AnimatePresence>
           
           {/* If scrolled, mount to the Header Portal! */}
           {isScrolled && document.getElementById('header-search-portal') && createPortal(
             <div className="relative w-full z-50">
${searchContentRaw}             </div>,
             document.getElementById('header-search-portal')!
           )}
        </div>
`;

code = code.substring(0, startIdx) + newReturnBlock + code.substring(endIdx + endStr.length);
fs.writeFileSync('src/components/SearchBar.tsx', code);
console.log("Extraction success!");
