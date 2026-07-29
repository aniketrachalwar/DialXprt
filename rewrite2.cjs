const fs = require('fs');

let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const mainInputStartStr = '        {/* Main Search Input Container */}\n        <div className="relative">';
const listeningStartStr = '        {/* Listening / Audio Feedback Overlay Modal */}';

const startIdx = code.indexOf(mainInputStartStr);
const endIdx = code.indexOf(listeningStartStr);

if (startIdx === -1 || endIdx === -1) {
    console.log("Could not find boundaries!", startIdx, endIdx);
    process.exit(1);
}

const blockToReplace = code.substring(startIdx, endIdx);

// Extract the original dropdown to preserve it
const conditionStartStr = '{isDropdownOpen && q.length > 0 && (';
const conditionEndStr = '          )}\n        </div>\n'; // end of the dropdown wrapper and the main relative wrapper
const condStartIdx = blockToReplace.indexOf(conditionStartStr);
const condEndIdx = blockToReplace.lastIndexOf(conditionEndStr);

let cleanDropdown = blockToReplace.substring(condStartIdx, condEndIdx);
cleanDropdown = cleanDropdown.replace(
  '<div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 animate-fade-in max-h-[75vh] overflow-y-auto">',
  '<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 max-h-[75vh] overflow-y-auto">'
);

// We need to change the final `</div>` to `</motion.div>` for the dropdown
const lastDivIdx = cleanDropdown.lastIndexOf('</div>\n          )');
if (lastDivIdx !== -1) {
  cleanDropdown = cleanDropdown.substring(0, lastDivIdx) + '</motion.div>\n          )';
} else {
  // alternative matching just in case
  const fallbackIdx = cleanDropdown.lastIndexOf('</div>');
  if (fallbackIdx !== -1) {
      cleanDropdown = cleanDropdown.substring(0, fallbackIdx) + '</motion.div>' + cleanDropdown.substring(fallbackIdx + 6);
  }
}

let newBlock = `        {/* Main Search Input Container */}
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
                   <motion.div
                     layout
                     layoutId="searchBarInputBox"
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     className={\`relative flex items-center bg-white rounded-full shadow-md border-2 border-orange-400/80 focus-within:border-[#F36F21] overflow-hidden w-full \${
                       isScrolled ? 'h-[36px] sm:h-[40px]' : 'h-[44px] sm:h-[48px]'
                     }\`}
                   >
                     <div className="pl-3 pr-1.5 text-indigo-900 shrink-0">
                       <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B3990]" />
                     </div>

                     <input
                       id="main-search-input"
                       type="text"
                       value={searchQuery}
                       onFocus={() => setIsDropdownOpen(true)}
                       onChange={(e) => {
                         onSearchChange(e.target.value);
                         setIsDropdownOpen(true);
                       }}
                       placeholder={t('searchPlaceholder')}
                       className="w-full py-2.5 sm:py-3 px-1 text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none h-full bg-transparent"
                     />

                     {/* Clear Button */}
                     {searchQuery && (
                       <button
                         onClick={() => {
                           onSearchChange('');
                           setIsDropdownOpen(false);
                         }}
                         className="p-1.5 text-gray-400 hover:text-gray-600 min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                         title="Clear search"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     )}

                     {/* Voice Search Mic Button */}
                     <button
                       id="voice-search-btn"
                       onClick={handleVoiceSearch}
                       className={\`mx-1 p-1.5 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center transition-all shrink-0 \${
                         isListening
                           ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300'
                           : 'bg-indigo-50 text-[#2B3990] hover:bg-indigo-100'
                       }\`}
                       title="Speak into microphone to search"
                     >
                       {isListening ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                     </button>
                   </motion.div>

                   <AnimatePresence>
                     ${cleanDropdown}
                   </AnimatePresence>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
           
           {/* If scrolled, mount to the Header Portal! */}
           {isScrolled && document.getElementById('header-search-portal') && createPortal(
             <div className="relative w-full z-50">
               <motion.div
                 layout
                 layoutId="searchBarInputBox"
                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 className={\`relative flex items-center bg-white rounded-full shadow-md border-2 border-orange-400/80 focus-within:border-[#F36F21] overflow-hidden w-full \${
                   isScrolled ? 'h-[36px] sm:h-[40px]' : 'h-[44px] sm:h-[48px]'
                 }\`}
               >
                 <div className="pl-3 pr-1.5 text-indigo-900 shrink-0">
                   <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B3990]" />
                 </div>
                 <input
                   id="main-search-input"
                   type="text"
                   value={searchQuery}
                   onFocus={() => setIsDropdownOpen(true)}
                   onChange={(e) => {
                     onSearchChange(e.target.value);
                     setIsDropdownOpen(true);
                   }}
                   placeholder={t('searchPlaceholder')}
                   className="w-full py-2.5 sm:py-3 px-1 text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none h-full bg-transparent"
                 />
                 {searchQuery && (
                   <button onClick={() => { onSearchChange(''); setIsDropdownOpen(false); }} className="p-1.5 text-gray-400 hover:text-gray-600 min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0" title="Clear search">
                     <X className="w-4 h-4" />
                   </button>
                 )}
                 <button id="voice-search-btn" onClick={handleVoiceSearch} className={\`mx-1 p-1.5 rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center transition-all shrink-0 \${isListening ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-300' : 'bg-indigo-50 text-[#2B3990] hover:bg-indigo-100'}\`} title="Speak into microphone to search">
                   {isListening ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                 </button>
               </motion.div>
               <AnimatePresence>
                 ${cleanDropdown}
               </AnimatePresence>
             </div>,
             document.getElementById('header-search-portal')!
           )}
        </div>
`;

code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
fs.writeFileSync('src/components/SearchBar.tsx', code);
console.log('Success!');
