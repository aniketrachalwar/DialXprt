const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

// Find the start of searchContent
const searchContentStartIdx = code.indexOf('const searchContent = (');

// Find the start of Listening
const listeningStartIdx = code.indexOf('{/* Listening / Audio Feedback Overlay Modal */}');

// Extract the content we want to replace
const blockToReplace = code.substring(searchContentStartIdx, listeningStartIdx);

let newBlock = `  const searchContent = (
    <div className="relative w-full z-50">
      <motion.div
        layout
        layoutId="searchBarInputBox"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
        {isDropdownOpen && q.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 max-h-[75vh] overflow-y-auto"
          >` +

          // the dropdown inner content (from the old block)
          blockToReplace.substring(
            blockToReplace.indexOf('{/* Section Header: Matching Profiles */}'),
            blockToReplace.indexOf('</button>\n                      </div>\n                    </div>\n                  ))}\n                </div>\n              </div>') + 180
          ) + `
            ) : (
              <div className="p-4 text-center text-xs text-gray-500">
                No matching experts or stores found for "{searchQuery}". Try searching "Auto", "Plumber", "Syed", "Ramesh", or "Kirana".
              </div>
            )}

            {/* Section: Matching Category Quick Filters */}
            {matchingCategories.length > 0 && (
              <div className="p-3 bg-white">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-2 pb-1.5">
                  Matching Categories
                </div>
                <div className="flex flex-wrap gap-1.5 px-2">
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setIsDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-[#2B3990] text-[#2B3990] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>{cat.name}</span>
                      <span className="bg-indigo-200/60 text-current text-[10px] px-1.5 rounded-full">
                        {cat.activeProvidersCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer: Trigger full grid view search */}
            <div
              onClick={() => setIsDropdownOpen(false)}
              className="p-2.5 bg-indigo-900 text-white text-center text-xs font-extrabold cursor-pointer hover:bg-indigo-800 transition-colors flex items-center justify-center gap-2"
            >
              <span>Show all matching results in list for "{searchQuery}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const portalTarget = document.getElementById('header-search-portal');

  return (
    <div className="w-full bg-[#1A237E] pt-2 pb-5 px-3 sm:px-6 rounded-b-2xl shadow-lg border-b border-indigo-900/40">
      <div className="max-w-4xl mx-auto space-y-3" ref={containerRef}>
        {/* Main Search Input Container */}
        <div className="relative z-50 flex justify-center w-full h-[44px] sm:h-[48px]">
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

fs.writeFileSync('src/components/SearchBar.tsx', code.replace(blockToReplace, newBlock));
console.log('Successfully updated SearchBar');
