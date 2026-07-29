const fs = require('fs');

let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import React, { useState, useEffect, useRef } from 'react';",
  "import React, { useState, useEffect, useRef } from 'react';\nimport { createPortal } from 'react-dom';\nimport { motion, AnimatePresence } from 'motion/react';"
);

// 2. Add isScrolled state
code = code.replace(
  "const containerRef = useRef<HTMLDivElement>(null);",
  "const containerRef = useRef<HTMLDivElement>(null);\n  const [isScrolled, setIsScrolled] = useState(false);\n\n  useEffect(() => {\n    const handleScroll = () => setIsScrolled(window.scrollY > 30);\n    window.addEventListener('scroll', handleScroll, { passive: true });\n    return () => window.removeEventListener('scroll', handleScroll);\n  }, []);"
);

// 3. Extract the dropdown block precisely!
const startMarker = "{/* INSTAGRAM-STYLE LIVE MATCHING PROFILES DROPDOWN */}";
const endMarker = "{/* Listening / Audio Feedback Overlay Modal */}";

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

let dropdownBlock = code.substring(startIdx, endIdx);

const conditionStart = dropdownBlock.indexOf('{isDropdownOpen && q.length > 0 && (');
const lastClosingBrace = dropdownBlock.lastIndexOf(')}');

let cleanDropdown = dropdownBlock.substring(conditionStart, lastClosingBrace + 2); // Includes the ')}'

// Now replace the wrapper `div` in cleanDropdown with `motion.div`
cleanDropdown = cleanDropdown.replace(
  '<div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 animate-fade-in max-h-[75vh] overflow-y-auto">',
  '<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100 max-h-[75vh] overflow-y-auto">'
);

// We must also replace the last `</div>` inside the condition with `</motion.div>`
const lastDivIdx = cleanDropdown.lastIndexOf('</div>');
cleanDropdown = cleanDropdown.substring(0, lastDivIdx) + '</motion.div>' + cleanDropdown.substring(lastDivIdx + 6);

// 4. Construct searchContent block
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
        ${cleanDropdown}
      </AnimatePresence>
    </div>
  );

  const portalTarget = document.getElementById('header-search-portal');
`;

// 5. Build the new return block
let returnBlockStr = `  return (
    <div className="w-full bg-[#1A237E] pt-2 pb-5 px-3 sm:px-6 rounded-b-2xl shadow-lg border-b border-indigo-900/40">
      <div className="max-w-4xl mx-auto space-y-3" ref={containerRef}>
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

        {/* Listening / Audio Feedback Overlay Modal */}`;

// Now replace from "return (" down to "{/* Listening / Audio Feedback Overlay Modal */}" with "searchContentStr + returnBlockStr"
const fullReturnStart = code.indexOf('  return (\n    <div className="w-full bg-[#1A237E]');
const fullBlockToRemove = code.substring(fullReturnStart, endIdx + endMarker.length);

code = code.replace(fullBlockToRemove, searchContentStr + returnBlockStr);

fs.writeFileSync('src/components/SearchBar.tsx', code);
console.log('Successfully applied accurate AST-like string transform!');
