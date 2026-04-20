const fs = require('fs');

const files = [
    'f:/Smit/Calculator/Forex/src/components/SwapCalculator.jsx',
    'f:/Smit/Calculator/Forex/src/components/MarginCalculator.jsx',
    'f:/Smit/Calculator/Forex/src/components/LotSizeCalculator.jsx',
    'f:/Smit/Calculator/Forex/src/components/Calculator.jsx'
];

for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Update labels
    content = content.replace(/text-\[10px\] sm:text-\[11px\]/g, 'text-[11px] sm:text-xs');
    
    // 2. Update inputs - replace 'text-sm' with 'text-[15px]'
    content = content.replace(/font-semibold text-sm/g, 'font-semibold text-[15px]');
    content = content.replace(/text-sm font-medium/g, 'text-[15px] font-medium');
    content = content.replace(/text-sm text-slate-200 outline-none/g, 'text-[15px] text-slate-200 outline-none');
    
    // Calendar in SwapCalculator
    content = content.replace(/text-xs sm:text-sm font-semibold/g, 'text-sm sm:text-[15px] font-semibold');
    
    // 3. Update right side layout so it aligns to top instead of center
    content = content.replace(/overflow-hidden h-full flex flex-col justify-center"/g, 'overflow-hidden h-full flex flex-col pt-12"');
    
    // Just in case any are left with items-center
    content = content.replace(/overflow-hidden h-full flex flex-col justify-center items-center"/g, 'overflow-hidden h-full flex flex-col pt-12"'); 

    fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Script completed successfully');
