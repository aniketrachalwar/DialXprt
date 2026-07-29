const fs = require('fs');

const lines = fs.readFileSync('src/components/SearchBar.tsx', 'utf8').split('\n');

// 0-based indexing. Line 198 is index 197. Line 389 is index 388.
const startIndex = 197; 
const endIndex = 388; 

// We want the inner contents of `<div className="relative">` to be duplicated.
// Wait, the extractedBlock WILL include the `<div className="relative">` wrapper.
// So we extract from line 198 to line 389.
const extractedBlock = lines.slice(startIndex, endIndex + 1).join('\n');

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
                 <div className="relative w-full z-50">
${extractedBlock}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
           
           {/* If scrolled, mount to the Header Portal! */}
           {isScrolled && document.getElementById('header-search-portal') && createPortal(
             <div className="relative w-full z-50">
${extractedBlock}
             </div>,
             document.getElementById('header-search-portal')
           )}
        </div>`;

// Replace lines 197 to 389 (indexes 196 to 388)
const newLines = [
    ...lines.slice(0, 196),
    newReturnBlock,
    ...lines.slice(389)
];

fs.writeFileSync('src/components/SearchBar.tsx', newLines.join('\n'));
console.log("Success by lines!");
