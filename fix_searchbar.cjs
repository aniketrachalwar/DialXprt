const fs = require('fs');

let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const mainContainerStartIdx = code.indexOf('{/* Main Search Input Container */}');
const listeningStartIdx = code.indexOf('{/* Listening / Audio Feedback Overlay Modal */}');

if (mainContainerStartIdx === -1 || listeningStartIdx === -1) {
  console.error("Could not find targets");
  process.exit(1);
}

const originalDropdownStart = code.indexOf('{/* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN */}');
if (originalDropdownStart === -1) {
  console.error("Could not find dropdown");
  process.exit(1);
}

// Extract the raw dropdown code from original
let rawDropdown = code.substring(originalDropdownStart, listeningStartIdx);

// Modify the dropdown to use motion.div and AnimatePresence
rawDropdown = rawDropdown.replace(
  '<div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 animate-fade-in max-h-[75vh] overflow-y-auto">',
  '<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 max-h-[75vh] overflow-y-auto">'
);
rawDropdown = rawDropdown.replace(
  '          </div>\n        )}',
  '          </motion.div>\n        )}'
);

let searchContentStr = `
  const searchContent = (
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
${rawDropdown}
      </AnimatePresence>
    </div>
  );

  const portalTarget = document.getElementById('header-search-portal');
`;

let returnBlockStr = `
        {/* Main Search Input Container */}
        <div className="relative z-50 flex justify-center w-full min-h-[44px] sm:min-h-[48px]">
           <AnimatePresence>
             {!isScrolled && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full absolute inset-0"
               >
                 {searchContent}
               </motion.div>
             )}
           </AnimatePresence>
           
           {/* If scrolled, mount to the Header Portal! */}
           {isScrolled && portalTarget && createPortal(searchContent, portalTarget)}
        </div>

        `;

const returnMatchStr = '  return (\n    <div className="w-full bg-[#1A237E] pt-2 pb-5 px-3 sm:px-6 rounded-b-2xl shadow-lg border-b border-indigo-900/40">\n      <div className="max-w-4xl mx-auto space-y-3" ref={containerRef}>\n';

let finalReplacement = searchContentStr + returnMatchStr + returnBlockStr;

// Find the start of the return statement
const returnStartIdx = code.indexOf(returnMatchStr);

// The block to remove is from the return statement start to listening start
const oldBlockToRemove = code.substring(returnStartIdx, listeningStartIdx);

code = code.replace(oldBlockToRemove, finalReplacement);

fs.writeFileSync('src/components/SearchBar.tsx', code);
console.log('Successfully updated SearchBar');
