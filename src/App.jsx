import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Trophy, ArrowRight, RotateCcw, Brain, Shapes, Calculator, Sigma, 
  CheckCircle, XCircle, ChevronRight, User, X, Pencil, Eraser, 
  Circle, BarChart, Crown, Smile, Gem, Ruler, TrendingUp, Axis3d, 
  Dna, Swords, Grid
} from 'lucide-react';

// --- CURRICULUM CONFIGURATION ---
const CURRICULUM = {
  'Number': { min: 1, max: 12, icon: <Calculator />, color: 'from-emerald-400 to-teal-500' },
  'Algebra': { min: 6, max: 12, icon: <Sigma />, color: 'from-rose-400 to-pink-500' },
  'Geometry': { min: 1, max: 12, icon: <Shapes />, color: 'from-blue-400 to-indigo-500' },
  'Mensuration': { min: 5, max: 12, icon: <Ruler />, color: 'from-orange-400 to-red-500' }, 
  'Coord Geometry': { min: 7, max: 12, icon: <Axis3d />, color: 'from-cyan-400 to-sky-500' },
  'Trigonometry': { min: 9, max: 12, icon: <TrendingUp />, color: 'from-violet-400 to-purple-500' },
  'Vectors': { min: 9, max: 12, icon: <ArrowRight />, color: 'from-fuchsia-400 to-pink-600' },
  'Probability': { min: 7, max: 12, icon: <Dna />, color: 'from-lime-400 to-green-600' },
  'Data': { min: 2, max: 12, icon: <BarChart />, color: 'from-yellow-400 to-amber-500' },
};

// --- HELPER FUNCTIONS ---
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const gcd = (a, b) => b ? gcd(b, a % b) : a; 

// Robust option generator
const generateOptions = (correctVal, type = 'number', format = null) => {
  let opts = new Set([correctVal]);
  let maxAttempts = 50;
  while (opts.size < 4 && maxAttempts > 0) {
    maxAttempts--;
    let val;
    if (type === 'text') {
      const vocab = format || ['A', 'B', 'C', 'D'];
      val = vocab[getRandomInt(0, vocab.length - 1)];
    } else {
       let noiseRange = Math.max(1, Math.floor(Math.abs(correctVal) * 0.2));
       if (correctVal === 0) noiseRange = 5;
       let noise = getRandomInt(1, noiseRange) * (Math.random() > 0.5 ? 1 : -1);
       
       if (type === 'decimal') {
         val = parseFloat((correctVal + (Math.random() * 2 - 1)).toFixed(1));
       } else {
         val = Math.round(correctVal + noise);
       }
       if (type === 'positive' && val < 0) val = Math.abs(val);
    }
    if (val !== correctVal) opts.add(val);
  }
  if (opts.size < 4 && type === 'text' && format) {
     format.forEach(f => opts.add(f));
  } else if (opts.size < 4) {
     while(opts.size < 4) opts.add(getRandomInt(0, 100));
  }
  
  const options = Array.from(opts).slice(0,4).sort(() => Math.random() - 0.5);
  return { options, correctIndex: options.indexOf(correctVal) };
};

// --- VISUAL ASSETS GENERATOR ---
const renderVisual = (type, data) => {
  if (!data) return null;

  switch (type) {
    case 'cube':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
            <path d="M50,50 L130,50 L130,130 L50,130 Z" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
            <path d="M50,50 L80,20 L160,20 L130,50" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="3" />
            <path d="M160,20 L160,100 L130,130" fill="#818cf8" stroke="#4f46e5" strokeWidth="3" />
            <path d="M50,130 L80,100 L160,100" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="4" />
            <path d="M80,20 L80,100" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="4" />
          </svg>
        </div>
      );
    case 'cylinder':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="140" height="180" viewBox="0 0 140 180" className="overflow-visible">
            <ellipse cx="70" cy="30" rx="60" ry="20" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="3" />
            <path d="M10,30 L10,150 A60,20 0 0 0 130,150 L130,30" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
            <ellipse cx="70" cy="150" rx="60" ry="20" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="4" opacity="0.5"/>
            <path d="M10,150 A60,20 0 0 0 130,150" fill="none" stroke="#4f46e5" strokeWidth="3" />
          </svg>
        </div>
      );
    case 'cone':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="140" height="180" viewBox="0 0 140 180" className="overflow-visible">
            <ellipse cx="70" cy="150" rx="60" ry="20" fill="#c7d2fe" stroke="#4f46e5" strokeWidth="3" />
            <path d="M10,150 L70,20 L130,150" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" fillOpacity="0.5" />
            <path d="M10,150 A60,20 0 0 0 130,150" fill="none" stroke="#4f46e5" strokeWidth="3" strokeDasharray="4 4" /> 
          </svg>
        </div>
      );
    case 'sphere':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="160" height="160" viewBox="0 0 160 160" className="overflow-visible">
            <circle cx="80" cy="80" r="70" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="3" />
            <path d="M40,60 Q80,100 120,60" fill="none" stroke="#4f46e5" strokeWidth="2" opacity="0.3" />
            <circle cx="50" cy="50" r="10" fill="white" opacity="0.5" />
          </svg>
        </div>
      );
    case 'rect':
      // DYNAMIC SCALING LOGIC:
      // We want the shape to fill a 200x160 box regardless of whether 'w' is 2 or 10.
      const maxWidth = 180;
      const maxHeight = 140;
      // Calculate aspect ratio
      const ratio = data.w / data.h;
      
      let drawW, drawH;
      if (ratio > 1) { // Wide
         drawW = maxWidth;
         drawH = maxWidth / ratio;
         if (drawH > maxHeight) { // Clamping if still too tall
             drawH = maxHeight;
             drawW = maxHeight * ratio;
         }
      } else { // Tall or Square
         drawH = maxHeight;
         drawW = maxHeight * ratio;
      }
      
      // Center it
      const startX = (240 - drawW) / 2;
      const startY = (200 - drawH) / 2;

      return (
        <div className="flex justify-center items-center my-6 h-56 animate-float">
          <svg width="240" height="200" viewBox="0 0 240 200" className="overflow-visible drop-shadow-xl">
            <rect x={startX} y={startY} width={drawW} height={drawH} fill="#f472b6" stroke="#be185d" strokeWidth="5" rx="4" />
            
            {/* Top Label */}
            <text x={startX + drawW / 2} y={startY - 10} textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="18" fontFamily="sans-serif">
              {data.missing === 'w' ? '?' : `${data.w} cm`}
            </text>
            
            {/* Side Label */}
            <text x={startX - 15} y={startY + drawH / 2} textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="18" fontFamily="sans-serif" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
              {data.missing === 'h' ? '?' : `${data.h} cm`}
            </text>

            {/* Perimeter/Area Label inside if needed, or centered */}
            {data.showArea && (
                <text x={startX + drawW/2} y={startY + drawH/2 + 5} textAnchor="middle" fill="white" fontWeight="bold" fontSize="24" opacity="0.9">Area = ?</text>
            )}
          </svg>
        </div>
      );
    
    case 'grid_shape':
       // For area counting questions
       const size = 30; // cell size
       return (
         <div className="flex justify-center items-center my-6 animate-float">
            <div className="grid border-2 border-indigo-600 bg-white" style={{ 
                gridTemplateColumns: `repeat(${data.w}, ${size}px)`,
                width: data.w * size + 4,
                gap: '1px',
                backgroundColor: '#e0e7ff'
            }}>
                {Array.from({length: data.w * data.h}).map((_, i) => (
                    <div key={i} className="bg-indigo-100 border border-indigo-200" style={{height: size}}></div>
                ))}
            </div>
         </div>
       );

    case 'trig_triangle':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="240" height="200" viewBox="0 0 240 200" className="overflow-visible">
            <path d="M40,160 L200,160 L200,40 Z" fill="none" stroke="#4f46e5" strokeWidth="4" />
            <path d="M40,160 L200,40" fill="none" stroke="#4f46e5" strokeWidth="4" />
            <path d="M180,160 L180,140 L200,140" fill="none" stroke="#818cf8" strokeWidth="2" />
            {data.target === 'hyp' ? <text x="110" y="90" fontSize="16" fontWeight="bold" fill="#dc2626">?</text> : <text x="110" y="90" fontSize="14" fill="#4b5563">{data.hyp}</text>}
            {data.target === 'opp' ? <text x="210" y="100" fontSize="16" fontWeight="bold" fill="#dc2626">?</text> : <text x="210" y="100" fontSize="14" fill="#4b5563">{data.opp}</text>}
            {data.target === 'adj' ? <text x="120" y="180" fontSize="16" fontWeight="bold" fill="#dc2626">?</text> : <text x="120" y="180" fontSize="14" fill="#4b5563">{data.adj}</text>}
            <path d="M60,160 A 40 40 0 0 0 65 145" fill="none" stroke="#ea580c" strokeWidth="2" />
            <text x="75" y="155" fontSize="12" fill="#ea580c">{data.angle}°</text>
          </svg>
        </div>
      );
    case 'coord_grid':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float bg-white rounded-lg border border-slate-200">
          <svg width="200" height="200" viewBox="-10 -10 20 20" className="overflow-visible">
            <defs><pattern id="grid" width="2" height="2" patternUnits="userSpaceOnUse"><path d="M 2 0 L 0 0 0 2" fill="none" stroke="#e2e8f0" strokeWidth="0.1"/></pattern></defs>
            <rect x="-10" y="-10" width="20" height="20" fill="url(#grid)" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="#94a3b8" strokeWidth="0.3" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#94a3b8" strokeWidth="0.3" />
            <circle cx={data.x1} cy={-data.y1} r="0.6" fill="#ef4444" />
            <text x={data.x1 + 1} y={-data.y1 - 1} fontSize="2" fill="#ef4444">A</text>
            {data.x2 !== undefined && (
              <>
                <circle cx={data.x2} cy={-data.y2} r="0.6" fill="#3b82f6" />
                <text x={data.x2 + 1} y={-data.y2 - 1} fontSize="2" fill="#3b82f6">B</text>
                <line x1={data.x1} y1={-data.y1} x2={data.x2} y2={-data.y2} stroke="#cbd5e1" strokeWidth="0.2" strokeDasharray="1,1" />
              </>
            )}
          </svg>
        </div>
      );
    case 'bar_graph':
      const maxVal = Math.max(...data.values);
      return (
        <div className="my-6 w-full max-w-md mx-auto h-64 flex items-end justify-around gap-2 p-4 bg-white rounded-xl border-2 border-slate-100 shadow-inner">
          {data.values.map((val, i) => (
            <div key={i} className="flex flex-col items-center justify-end h-full w-full group">
              <div className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg transition-all duration-1000 ease-out shadow-md group-hover:from-indigo-400 group-hover:to-purple-300 relative" style={{ height: `${(val / maxVal) * 80}%` }}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
              </div>
              <span className="mt-2 text-[10px] md:text-xs font-bold text-slate-500 uppercase truncate w-full text-center">{data.labels[i]}</span>
            </div>
          ))}
        </div>
      );
    case 'marbles':
        return (
            <div className="flex justify-center items-center gap-2 my-6 h-32 animate-float bg-slate-100 rounded-full px-8 border-4 border-slate-200">
                {Array.from({length: data.red}).map((_,i) => <div key={`r${i}`} className="w-8 h-8 rounded-full bg-red-500 shadow-inner border border-red-600"></div>)}
                {Array.from({length: data.blue}).map((_,i) => <div key={`b${i}`} className="w-8 h-8 rounded-full bg-blue-500 shadow-inner border border-blue-600"></div>)}
                {Array.from({length: data.green}).map((_,i) => <div key={`g${i}`} className="w-8 h-8 rounded-full bg-green-500 shadow-inner border border-green-600"></div>)}
            </div>
        );
    case 'coins':
        return (
            <div className="flex justify-center items-center gap-6 my-6 h-32 animate-float">
                {Array.from({length: data.count}).map((_,i) => (
                    <div key={i} className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center font-bold text-3xl text-yellow-800 shadow-xl">
                        $
                    </div>
                ))}
            </div>
        );
    case 'spinner':
        return (
            <div className="flex flex-col items-center justify-center my-6 animate-float">
              <div 
                className="w-40 h-40 rounded-full border-4 border-indigo-600 shadow-xl relative"
                style={{ 
                  background: `conic-gradient(#ef4444 0deg 90deg, #3b82f6 90deg 180deg, #22c55e 180deg 270deg, #eab308 270deg 360deg)` 
                }}
              >
                {/* Pointer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full z-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-16 bg-slate-800 origin-bottom transform rotate-45"></div>
              </div>
            </div>
        );
    case 'polygon': 
      const polyPoints = {
        'Triangle': "100,20 40,140 160,140",
        'Quadrilateral': "40,40 160,20 140,140 20,120", 
        'Pentagon': "100,10 190,70 160,150 40,150 10,70",
        'Hexagon': "50,10 150,10 190,90 150,170 50,170 10,90",
        'Octagon': "60,10 140,10 190,60 190,140 140,190 60,190 10,140 10,60"
      };
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="220" height="220" viewBox="0 0 200 200" className="overflow-visible drop-shadow-xl">
            <polygon points={polyPoints[data.shape]} fill="#818cf8" stroke="#4338ca" strokeWidth="6" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    default: return null;
  }
};

// --- QUESTION ENGINE ---
const generateQuestion = (grade, topic, difficulty) => {
  let q = { question: "", options: [], correct: 0, explanation: "", visualType: null, visualData: null };
  const diffMod = difficulty; // 1-10

  // --- THEME: NUMBER ---
  if (topic === 'Number') {
    if (grade <= 2) {
      const a = getRandomInt(1, 10 + diffMod * 5);
      const b = getRandomInt(1, 10);
      const isAdd = Math.random() > 0.5;
      q.question = isAdd ? `${a} + ${b} = ?` : `${a + b} - ${b} = ?`;
      const ans = isAdd ? a + b : a;
      const gen = generateOptions(ans, 'positive');
      q.options = gen.options; q.correct = gen.correctIndex;
      q.explanation = "Count objects or use a number line.";
    } 
    // --- GRADE 3 SPECIAL LOGIC ---
    else if (grade === 3) {
       const type = getRandomInt(1, 3);
       if (type === 1) { // Boolean Logic
          const a = getRandomInt(10, 30);
          const b = getRandomInt(1, 9);
          const c = getRandomInt(10, 40);
          const val1 = a + b;
          const isGreater = val1 > c;
          // Randomly ask > or <
          const askGreater = Math.random() > 0.5;
          
          if (askGreater) {
             q.question = `True or False: ${a} + ${b} > ${c}?`;
             q.correct = isGreater ? 0 : 1;
             q.explanation = `${a} + ${b} is ${val1}. Is ${val1} > ${c}? ${isGreater ? 'Yes' : 'No'}.`;
          } else {
             q.question = `True or False: ${a} + ${b} < ${c}?`;
             q.correct = !isGreater ? 0 : 1;
             q.explanation = `${a} + ${b} is ${val1}. Is ${val1} < ${c}? ${!isGreater ? 'Yes' : 'No'}.`;
          }
          q.options = ["True", "False"];
       } 
       else if (type === 2) { // Missing Operator
          const ops = [
             {s: '+', fn: (x,y)=>x+y}, 
             {s: '-', fn: (x,y)=>x-y}, 
             {s: '×', fn: (x,y)=>x*y}
          ];
          const targetOp = ops[getRandomInt(0, 2)];
          const a = getRandomInt(2, 9);
          const b = getRandomInt(2, 9);
          const ans = targetOp.fn(a, b);
          q.question = `Choose the missing sign: ${a} ? ${b} = ${ans}`;
          q.options = ['+', '-', '×', '='];
          q.correct = q.options.indexOf(targetOp.s);
          q.explanation = `${a} ${targetOp.s} ${b} equals ${ans}.`;
       }
       else { // Operation Chains
          const a = getRandomInt(10, 20);
          const b = getRandomInt(1, 9);
          const c = getRandomInt(1, 9);
          q.question = `Solve: ${a} + ${b} - ${c} = ?`;
          const ans = a + b - c;
          const gen = generateOptions(ans);
          q.options = gen.options; q.correct = gen.correctIndex;
          q.explanation = `First: ${a} + ${b} = ${a+b}. Then: ${a+b} - ${c} = ${ans}.`;
       }
    }
    // --- END GRADE 3 ---
    else if (grade <= 5) {
      if (diffMod > 5) {
         const a = getRandomInt(4, 12);
         const b = getRandomInt(2, 6);
         q.question = `What is the remainder of ${a*b + 1} ÷ ${a}?`;
         const ans = 1;
         const gen = generateOptions(ans);
         q.options = gen.options; q.correct = gen.correctIndex;
         q.explanation = `${a*b+1} divided by ${a} is ${b} remainder 1.`;
      } else {
         const a = getRandomInt(3, 12);
         q.question = `Which number is a multiple of ${a}?`;
         const ans = a * getRandomInt(2,5);
         q.options = [ans, ans+1, ans-1, ans+2].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(ans);
         q.explanation = `${ans} = ${a} × ${ans/a}.`;
      }
    } else {
      const base = getRandomInt(2, 5);
      const pow1 = getRandomInt(2, 4);
      q.question = `Evaluate: ${base}^${pow1}`;
      const ans = Math.pow(base, pow1);
      const gen = generateOptions(ans);
      q.options = gen.options; q.correct = gen.correctIndex;
      q.explanation = `${base} multiplied by itself ${pow1} times.`;
    }
  }

  // --- THEME: ALGEBRA ---
  else if (topic === 'Algebra') {
    if (grade <= 7 && diffMod < 5) {
      const c = getRandomInt(2, 9);
      q.question = `Simplify: ${c}x + 2x`;
      const ansStr = `${c+2}x`;
      q.options = [ansStr, `${c}x²`, `${c*2}x`, `${c+2}`].sort(()=>Math.random()-0.5);
      q.correct = q.options.indexOf(ansStr);
      q.explanation = "Add the coefficients of like terms.";
    } 
    else if (grade >= 7) {
      const type = getRandomInt(1, 4);
      if (type === 1) { // Expansion
         const a = getRandomInt(2, 5);
         const b = getRandomInt(1, 10);
         q.question = `Expand: ${a}(x + ${b})`;
         const correct = `${a}x + ${a*b}`;
         q.options = [correct, `${a}x + ${b}`, `${a}x - ${a*b}`, `${x} + ${a*b}`].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(correct);
         q.explanation = `Multiply the term outside by each term inside: ${a}·x + ${a}·${b}.`;
      } 
      else if (type === 2) { // Factorisation
         const a = getRandomInt(2, 6);
         const b = getRandomInt(2, 6);
         const term = a*b;
         q.question = `Factorise: ${a}x + ${term}`;
         const correct = `${a}(x + ${b})`;
         q.options = [correct, `${b}(x + ${a})`, `${a}(x - ${b})`, `${a}x(1 + ${b})`].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(correct);
         q.explanation = `Find the highest common factor (${a}).`;
      }
      else if (type === 3) { // Variables on both sides
         const c = getRandomInt(2, 5);
         const a = c + getRandomInt(1, 3);
         const xVal = getRandomInt(2, 8);
         const d = getRandomInt(10, 30);
         const b = (c * xVal + d) - (a * xVal);
         q.question = `Solve: ${a}x ${b>=0?'+':''} ${b} = ${c}x + ${d}`;
         const gen = generateOptions(xVal);
         q.options = gen.options; q.correct = gen.correctIndex;
         q.explanation = `Subtract ${c}x from both sides, then isolate x.`;
      }
      else { // Substitution
         const xVal = getRandomInt(2, 5);
         q.question = `If x = ${xVal}, evaluate 2x² + 3`;
         const ans = 2*(xVal*xVal) + 3;
         const gen = generateOptions(ans);
         q.options = gen.options; q.correct = gen.correctIndex;
         q.explanation = `Square x first (${xVal}²=${xVal*xVal}), multiply by 2 (${2*xVal*xVal}), then add 3.`;
      }
    }
  }

  // --- THEME: GEOMETRY ---
  else if (topic === 'Geometry') {
    if (grade <= 4) {
      // Logic Branches based on Difficulty
      // Level 1-3: Identify 3D, Riddles
      // Level 4-6: Visual Perimeter, Comparisons
      // Level 7+: Missing Sides, Area Counting, Advanced Riddles
      
      const mode = diffMod <= 3 ? getRandomInt(1, 2) : diffMod <= 6 ? getRandomInt(3, 4) : getRandomInt(5, 6);
      
      if (mode === 1) { // 3D Shapes
        const shapes = [
          {id: 'cube', name: 'Cube', faces: 6, edges: 12, vertices: 8},
          {id: 'cylinder', name: 'Cylinder', faces: 3, edges: 2, vertices: 0},
          {id: 'cone', name: 'Cone', faces: 2, edges: 1, vertices: 1}, 
          {id: 'sphere', name: 'Sphere', faces: 1, edges: 0, vertices: 0}
        ];
        const shape = shapes[getRandomInt(0, shapes.length-1)];
        q.visualType = shape.id;
        q.visualData = {};
        
        if (Math.random() > 0.5) {
           q.question = "What is the name of this 3D shape?";
           q.options = ["Cube", "Sphere", "Cylinder", "Cone", "Prism"].sort(()=>Math.random()-0.5).slice(0,4);
           if(!q.options.includes(shape.name)) q.options[0] = shape.name;
           q.options.sort(()=>Math.random()-0.5);
           q.correct = q.options.indexOf(shape.name);
           q.explanation = `This object is a ${shape.name}.`;
        } else {
           const prop = ['faces', 'edges', 'vertices'][getRandomInt(0, 2)];
           q.question = `How many ${prop} does a ${shape.name} have?`;
           const ans = shape[prop];
           q.options = [ans, ans+1, ans+2, Math.max(0, ans-1)];
           q.options = [...new Set(q.options)].sort(()=>Math.random()-0.5);
           while(q.options.length < 4) q.options.push(getRandomInt(0, 10));
           q.correct = q.options.indexOf(ans);
           q.explanation = `A ${shape.name} has ${ans} ${prop}.`;
        }
      } 
      else if (mode === 2) { // 2D Riddles
         const shapes = [
           {name: "Triangle", clue: "I have 3 sides."},
           {name: "Square", clue: "I have 4 equal sides and 4 right angles."},
           {name: "Rectangle", clue: "I have 4 sides, opposite sides are equal, and 4 right angles."},
           {name: "Pentagon", clue: "I have 5 sides."},
           {name: "Hexagon", clue: "I have 6 sides."},
           {name: "Octagon", clue: "I have 8 sides."},
           {name: "Circle", clue: "I have no corners and 1 curved side."}
         ];
         const target = shapes[getRandomInt(0, shapes.length-1)];
         q.question = `Riddle: ${target.clue} What am I?`;
         q.options = shapes.map(s => s.name).sort(() => Math.random() - 0.5).slice(0,4);
         if(!q.options.includes(target.name)) q.options[getRandomInt(0,3)] = target.name;
         q.correct = q.options.indexOf(target.name);
         q.explanation = `${target.name} fits the description.`;
      }
      else if (mode === 3) { // Visual Perimeter
         const w = getRandomInt(2, 9);
         const h = getRandomInt(2, 9);
         q.visualType = 'rect';
         q.visualData = {w, h};
         q.question = `What is the perimeter of this rectangle?`;
         const ans = 2*(w+h);
         q.options = [ans, w*h, ans+2, ans-2].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(ans);
         q.explanation = `Perimeter is distance around: ${w} + ${h} + ${w} + ${h} = ${ans}.`;
      }
      else if (mode === 4) { // Sorting / Logic
         const qSet = [
             {q: "Which shape has 4 right angles?", a: "Rectangle", o: ["Triangle", "Pentagon", "Circle"]},
             {q: "Which shape is NOT a quadrilateral?", a: "Triangle", o: ["Square", "Rectangle", "Rhombus"]},
             {q: "Which shape has exactly 3 vertices?", a: "Triangle", o: ["Square", "Circle", "Cube"]},
             {q: "Which shape has parallel lines?", a: "Rectangle", o: ["Triangle (Isosceles)", "Circle", "Semicircle"]}
         ];
         const target = qSet[getRandomInt(0, qSet.length-1)];
         q.question = target.q;
         q.options = [target.a, ...target.o].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(target.a);
         q.explanation = target.a + " fits the rule.";
      }
      else if (mode === 5) { // Missing Side Perimeter
         const w = getRandomInt(3, 9);
         const h = getRandomInt(3, 9);
         const p = 2*(w+h);
         q.visualType = 'rect';
         q.visualData = {w, h, missing: 'h'}; // Hide Height
         q.question = `The Perimeter is ${p}. What is the missing side length?`;
         const ans = h;
         q.options = [h, w, h+2, p-w].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(ans);
         q.explanation = `Perimeter = 2(L+W). ${p} ÷ 2 = ${w+h}. ${w+h} - ${w} = ${h}.`;
      }
      else { // Area Concepts (Counting Squares)
         const w = getRandomInt(3, 6);
         const h = getRandomInt(2, 5);
         q.visualType = 'grid_shape';
         q.visualData = {w, h};
         q.question = "What is the Area (total squares)?";
         const ans = w*h;
         q.options = [ans, 2*(w+h), ans+1, ans-1].sort(()=>Math.random()-0.5);
         q.correct = q.options.indexOf(ans);
         q.explanation = `Count the squares: ${w} rows of ${h} (or multiply ${w}×${h}).`;
      }
    } else {
      const type = Math.random();
      if (type < 0.5) {
        q.question = "Angles on a straight line add up to?";
        q.options = [180, 90, 360, 270];
        q.correct = 0;
        q.explanation = "A straight line is half a full turn (180°).";
      } else {
        const n = getRandomInt(3, 6);
        const name = n===3?"Triangle":n===4?"Quadrilateral":n===5?"Pentagon":"Hexagon";
        const sum = (n-2)*180;
        q.question = `Sum of interior angles in a ${name}?`;
        const gen = generateOptions(sum);
        q.options = gen.options; q.correct = gen.correctIndex;
        q.explanation = `Formula: (${n}-2) × 180°.`;
      }
    }
  }

  // --- THEME: DATA (STATISTICS) ---
  else if (topic === 'Data') {
    const labels = ['Red', 'Blue', 'Green', 'Yellow'];
    const values = labels.map(() => getRandomInt(2, 10));
    q.visualType = 'bar_graph';
    q.visualData = { labels, values };

    if (grade <= 3) {
      const mode = getRandomInt(1, 3);
      if (mode === 1) { // Simple Max
         const maxVal = Math.max(...values);
         const maxLabel = labels[values.indexOf(maxVal)];
         q.question = "Which color has the most votes?";
         q.options = labels;
         q.correct = labels.indexOf(maxLabel);
         q.explanation = "Look for the tallest bar.";
      } else if (mode === 2) { // Summing Data
         // Pick two random bars
         const idx1 = getRandomInt(0, 3);
         let idx2 = getRandomInt(0, 3);
         if(idx1 === idx2) idx2 = (idx1 + 1) % 4;
         
         q.question = `How many people chose ${labels[idx1]} and ${labels[idx2]} combined?`;
         const ans = values[idx1] + values[idx2];
         const gen = generateOptions(ans, 'positive');
         q.options = gen.options; q.correct = gen.correctIndex;
         q.explanation = `Add the values: ${values[idx1]} + ${values[idx2]} = ${ans}.`;
      } else { // Reading Scale
         // If graph units are 2 per step? (Simulated by asking straight value but phrasing it)
         const idx = getRandomInt(0, 3);
         q.question = `How many votes did ${labels[idx]} get?`;
         const ans = values[idx];
         const gen = generateOptions(ans, 'positive');
         q.options = gen.options; q.correct = gen.correctIndex;
         q.explanation = `The top of the ${labels[idx]} bar lines up with ${ans}.`;
      }
    } else {
      const idx1 = getRandomInt(0, 3);
      const idx2 = (idx1 + 1) % 4;
      q.question = `How many more ${labels[idx1]} than ${labels[idx2]}?`;
      const ans = values[idx1] - values[idx2];
      if (ans < 0) q.question = `How many fewer ${labels[idx1]} than ${labels[idx2]}?`;
      const absAns = Math.abs(ans);
      const gen = generateOptions(absAns, 'positive');
      q.options = gen.options; q.correct = gen.correctIndex;
      q.explanation = `Compare the heights: ${values[idx1]} vs ${values[idx2]}.`;
    }
  }

  // --- THEME: PROBABILITY ---
  else if (topic === 'Probability') {
    // 4 Modes: Coin (1/2), Dice (Adv), Marbles, Spinner
    const mode = getRandomInt(1, 4);
    
    if (mode === 1) { // COINS
        const numCoins = (grade >= 7 && difficulty > 3) ? 2 : 1;
        q.visualType = 'coins';
        q.visualData = { count: numCoins };
        
        if (numCoins === 1) {
            q.question = "Probability of flipping Heads?";
            q.options = ["1/2", "1/4", "1/3", "1"];
            q.correct = 0;
            q.explanation = "A coin has 2 sides (Heads/Tails). 1/2 chance.";
        } else {
            // 2 Coins: HH, HT, TH, TT
            const subType = Math.random();
            if (subType < 0.33) {
                q.question = "Probability of getting 2 Heads (HH)?";
                q.options = ["1/4", "1/2", "3/4", "1/8"];
                q.correct = 0;
                q.explanation = "Possibilities: HH, HT, TH, TT. Only 1 is HH.";
            } else if (subType < 0.66) {
                q.question = "Probability of getting at least one Head?";
                q.options = ["3/4", "1/2", "1/4", "1"];
                q.correct = 0;
                q.explanation = "HH, HT, TH are all winners. 3 out of 4.";
            } else {
                q.question = "Probability of getting exactly one Tail?";
                q.options = ["1/2", "1/4", "3/4", "1/3"];
                q.correct = 0;
                q.explanation = "HT and TH both have one tail. 2/4 = 1/2.";
            }
        }
    } 
    else if (mode === 2) { // SPINNER
        q.visualType = 'spinner';
        q.visualData = {};
        q.question = "Probability of spinning Red?";
        q.options = ["1/4", "1/2", "1/3", "1/8"];
        q.correct = 0;
        q.explanation = "There are 4 equal colored sections. Red is 1 of them.";
    }
    else if (mode === 3) { // DICE ADVANCED
        const type = getRandomInt(1, 3);
        if (type === 1) {
            q.question = "Probability of rolling an EVEN number on a die?";
            q.options = ["1/2", "1/3", "1/6", "5/6"];
            q.correct = 0;
            q.explanation = "Even numbers are 2, 4, 6. That's 3 numbers out of 6. 3/6 = 1/2.";
        } else if (type === 2) {
            q.question = "Probability of rolling a number greater than 4?";
            q.options = ["1/3", "1/2", "1/6", "2/3"];
            q.correct = 0;
            q.explanation = "Numbers > 4 are 5 and 6. That's 2 numbers. 2/6 = 1/3.";
        } else {
            q.question = "Probability of rolling a 1 or a 6?";
            q.options = ["1/3", "1/6", "1/2", "1/4"];
            q.correct = 0;
            q.explanation = "There are 2 winning numbers. 2/6 = 1/3.";
        }
    }
    else { // MARBLES (Existing but robust)
        const red = getRandomInt(1, 4);
        const blue = getRandomInt(1, 4);
        const green = getRandomInt(1, 4);
        const total = red + blue + green;
        q.visualType = 'marbles';
        q.visualData = {red, blue, green};
        q.question = "Probability of picking a RED marble?";
        const correctFrac = `${red}/${total}`;
        
        let opts = new Set([correctFrac]);
        const distractors = [`${blue}/${total}`, `${green}/${total}`, `${red}/${total+1}`, `1/${total}`, "1/2"];
        distractors.forEach(d => { if(opts.size<4 && d !== correctFrac) opts.add(d); });
        while(opts.size < 4) { const n=getRandomInt(1,total); const d=getRandomInt(total+1, total+5); opts.add(`${n}/${d}`); }

        q.options = Array.from(opts).sort(() => Math.random() - 0.5);
        q.correct = q.options.indexOf(correctFrac);
        q.explanation = `There are ${red} red marbles out of ${total} total marbles.`;
    }
  }

  // --- THEME: MENSURATION (Area/Vol) ---
  else if (topic === 'Mensuration') {
    if (grade <= 6) {
      const w = getRandomInt(3, 8);
      const h = getRandomInt(3, 8);
      q.question = `Area of a rectangle ${w}cm by ${h}cm?`;
      const ans = w*h;
      const gen = generateOptions(ans);
      q.options = gen.options; q.correct = gen.correctIndex;
      q.explanation = "Area = Width × Height";
    } else {
      const r = getRandomInt(2, 5);
      q.question = `Volume of a cylinder radius ${r}, height 10? (Use π≈3)`;
      const ans = 3 * r * r * 10;
      const gen = generateOptions(ans);
      q.options = gen.options; q.correct = gen.correctIndex;
      q.explanation = `Volume = Area of base × Height = (πr²)h ≈ 3 × ${r}² × 10.`;
    }
  }

  // --- THEME: VECTORS ---
  else if (topic === 'Vectors') {
      const x = getRandomInt(1, 5);
      const y = getRandomInt(1, 5);
      // Magnitude question
      q.question = `Find the magnitude of vector (${x}, ${y}) (approx)`;
      const ans = Math.round(Math.sqrt(x*x + y*y));
      const gen = generateOptions(ans);
      q.options = gen.options; q.correct = gen.correctIndex;
      q.explanation = `Magnitude = √(x² + y²) = √(${x*x} + ${y*y}).`;
  }

  // --- FALLBACKS FOR ADVANCED TOPICS ---
  else if (topic === 'Trigonometry') {
    const knownSide = getRandomInt(10, 20);
    q.visualType = 'trig_triangle';
    q.visualData = { angle: 30, opp: 'x', hyp: knownSide, target: 'opp' };
    q.question = "Find x (sin 30° = 0.5)";
    const ans = knownSide / 2;
    const gen = generateOptions(ans);
    q.options = gen.options; q.correct = gen.correctIndex;
    q.explanation = "Opposite = Hypotenuse × sin(angle).";
  }
  else if (topic === 'Coord Geometry') {
    const x1 = getRandomInt(1,5), y1=getRandomInt(1,5), x2=x1+getRandomInt(2,4), y2=y1+getRandomInt(2,4);
    q.visualType = 'coord_grid';
    q.visualData = {x1,y1,x2,y2};
    q.question = "Midpoint of A and B?";
    const ans = `(${(x1+x2)/2}, ${(y1+y2)/2})`;
    q.options = [ans, `(${x1+x2}, ${y1+y2})`, `(${x2-x1}, ${y2-y1})`, `(${(x1+x2)/2}, ${y1+y2})`].sort(()=>Math.random()-0.5);
    q.correct = q.options.indexOf(ans);
    q.explanation = "Average of x and average of y.";
  }
  else {
    q.question = "10 + 10 = ?";
    q.options = [20, 100, 0, 10];
    q.correct = 0;
    q.explanation = "Addition.";
  }

  return q;
};


// --- APP COMPONENT ---
export default function App() {
  const [gameState, setGameState] = useState('intro');
  const [user, setUser] = useState("");
  const [grade, setGrade] = useState(3);
  const [topic, setTopic] = useState("");
  
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(1); 
  
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);

  const [unlockedAvatars, setUnlockedAvatars] = useState(['default']);
  const [showShop, setShowShop] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const [currentQ, setCurrentQ] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('mathquest_v3.7_save');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user || "");
      setScore(parsed.score || 0);
      setCoins(parsed.coins || 0);
      setUnlockedAvatars(parsed.unlockedAvatars || ['default']);
      setGrade(parsed.grade || 3);
      setDifficulty(parsed.difficulty || 1);
      if(parsed.user) setGameState('grade_select');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mathquest_v3.7_save', JSON.stringify({
        user, score, coins, unlockedAvatars, grade, difficulty
      }));
    }
  }, [user, score, coins, unlockedAvatars, grade, difficulty]);

  const startExercise = (selectedTopic) => {
    setTopic(selectedTopic);
    setIsChallengeMode(false);
    setGameState('playing');
    loadQuestion(grade, selectedTopic, difficulty);
  };

  const startChallenge = () => {
    setIsChallengeMode(true);
    setChallengeProgress(0);
    setChallengeScore(0);
    setGameState('playing');
    loadRandomChallengeQuestion();
  };

  const loadQuestion = (g, t, diff) => {
    setFeedback(null);
    setSelectedOption(null);
    const newQ = generateQuestion(g, t, diff);
    setCurrentQ(newQ);
  };

  const loadRandomChallengeQuestion = () => {
    const availableThemes = Object.keys(CURRICULUM).filter(t => 
      grade >= CURRICULUM[t].min && grade <= CURRICULUM[t].max
    );
    const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    loadQuestion(grade, randomTheme, difficulty + 2);
  };

  const handleAnswer = (index) => {
    if (feedback) return; 
    setSelectedOption(index);
    const isCorrect = index === currentQ.correct;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100 + (streak * 10));
      setCoins(c => c + 10);
      setStreak(s => s + 1);
      if (!isChallengeMode && streak > 0 && streak % 2 === 0) {
        setDifficulty(d => Math.min(d + 1, 10)); 
      }
      if (isChallengeMode) setChallengeScore(s => s + 1);
    } else {
      setFeedback('incorrect');
      setStreak(0);
      if (!isChallengeMode) setDifficulty(d => Math.max(d - 1, 1)); 
    }
  };

  const nextQuestion = () => {
    if (isChallengeMode) {
      const nextProg = challengeProgress + 1;
      if (nextProg >= 5) { 
        setFeedback(null); 
        setGameState('challenge_summary');
      } else {
        setChallengeProgress(nextProg);
        loadRandomChallengeQuestion();
      }
    } else {
      loadQuestion(grade, topic, difficulty);
    }
  };

  const renderPage = (content) => (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {content}
      {showWhiteboard && <Whiteboard onClose={() => setShowWhiteboard(false)} />}
      {showShop && <Shop coins={coins} onClose={() => setShowShop(false)} unlockAvatar={(id, cost) => {
         if (coins >= cost && !unlockedAvatars.includes(id)) {
           setCoins(c => c - cost);
           setUnlockedAvatars([...unlockedAvatars, id]);
         }
      }} unlocked={unlockedAvatars} />}
    </div>
  );

  if (gameState === 'intro') {
    return renderPage(
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="text-indigo-600 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">MathQuest</h1>
          <p className="text-slate-500 mb-8">K-12 Mastery Platform</p>
          <input className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-3 text-lg font-bold mb-4 outline-none transition-colors" placeholder="Enter your name..." value={user} onChange={e => setUser(e.target.value)} />
          <button disabled={!user.trim()} onClick={() => setGameState('grade_select')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Start Learning</button>
        </div>
      </div>
    );
  }

  if (gameState === 'grade_select') {
    return renderPage(
      <div className="p-6 max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div><h1 className="text-3xl font-black text-slate-800">Welcome, {user}</h1><p className="text-slate-500">Select your Grade Level</p></div>
          <div className="flex gap-4"><button onClick={() => setShowShop(true)} className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-200"><Gem size={18}/> {coins}</button><div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Trophy size={18}/> {score}</div></div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
            <button key={g} onClick={() => { setGrade(g); setGameState('topic_select'); }} className={`p-6 rounded-2xl border-b-4 transition-all hover:-translate-y-1 ${grade === g ? 'bg-indigo-600 border-indigo-800 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'}`}>
              <div className="text-3xl font-black mb-1">{g}</div>
              <div className="text-xs font-bold uppercase opacity-80">Grade</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'topic_select') {
    const availableThemes = Object.keys(CURRICULUM).filter(key => {
      const c = CURRICULUM[key];
      return grade >= c.min && grade <= c.max;
    });
    return renderPage(
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8"><button onClick={() => setGameState('grade_select')} className="p-2 bg-white rounded-full shadow hover:bg-slate-50"><ArrowRight className="rotate-180 text-slate-600"/></button><h2 className="text-3xl font-black text-slate-800">Grade {grade} Themes</h2></div>
        <div className="mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={startChallenge}>
          <div className="relative z-10"><div className="flex items-center gap-2 mb-2 text-violet-200 font-bold uppercase tracking-widest text-xs"><Swords size={16} /> Semester Test</div><h3 className="text-3xl font-black mb-2">The Gauntlet Challenge</h3><p className="opacity-90 max-w-md">Test your skills across all topics. Complete 5 random questions to level up your difficulty!</p></div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-10 group-hover:translate-x-5 transition-transform"></div>
          <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableThemes.map(key => {
            const theme = CURRICULUM[key];
            return (
              <button key={key} onClick={() => startExercise(key)} className="bg-white p-6 rounded-2xl border-b-4 border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all text-left flex items-center gap-4 group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${theme.color} text-white shadow-md group-hover:scale-110 transition-transform`}>{React.cloneElement(theme.icon, { size: 28 })}</div>
                <div><h4 className="font-bold text-lg text-slate-700 group-hover:text-indigo-600">{key}</h4><p className="text-xs text-slate-400 font-semibold">Adaptive Exercise</p></div>
              </button>
            )
          })}
        </div>
      </div>
    );
  }

  if (gameState === 'challenge_summary') {
    return renderPage(
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-bounce-in">
          <div className="mb-6 inline-flex p-4 rounded-full bg-yellow-100 text-yellow-600">{challengeScore >= 4 ? <Crown size={48} /> : <Star size={48} />}</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Challenge Complete!</h2>
          <p className="text-slate-500 mb-6 text-lg">You scored <span className="font-bold text-indigo-600">{challengeScore} / 5</span></p>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between p-4 bg-slate-50 rounded-xl"><span className="font-bold text-slate-600">Coins Earned</span><span className="font-bold text-amber-600">+{challengeScore * 20}</span></div>
            {challengeScore >= 4 && (<div className="flex justify-between p-4 bg-green-50 rounded-xl border border-green-100"><span className="font-bold text-green-700">Difficulty Level Up!</span><span className="font-bold text-green-700 flex items-center gap-1"><TrendingUp size={16}/> {difficulty} ➝ {difficulty+1}</span></div>)}
          </div>
          <button onClick={() => setGameState('topic_select')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700">Return to Menu</button>
        </div>
      </div>
    );
  }

  return renderPage(
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col pt-4 md:pt-8">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setGameState('topic_select')} className="p-2 bg-white rounded-xl shadow hover:bg-slate-100 text-slate-500"><X size={20}/></button>
          <div><h2 className="font-bold text-slate-800 flex items-center gap-2">{isChallengeMode ? <><Swords size={18} className="text-violet-500"/> The Gauntlet</> : topic}</h2><div className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="bg-slate-200 px-2 py-0.5 rounded">Grade {grade}</span>{isChallengeMode && <span className="text-violet-500">Q {challengeProgress+1} of 5</span>}{!isChallengeMode && <span>Diff: {difficulty}</span>}</div></div>
        </div>
        <div className="flex gap-3"><button onClick={() => setShowWhiteboard(true)} className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors"><Pencil size={20}/></button></div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 pb-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-100 relative">
          <div className="bg-slate-50 p-8 min-h-[200px] flex flex-col items-center justify-center text-center relative border-b border-slate-100">
            {currentQ && currentQ.visualType ? (
              <div className="z-10"><h3 className="text-xl font-bold text-slate-700 mb-4">{currentQ.question}</h3>{renderVisual(currentQ.visualType, currentQ.visualData)}</div>
            ) : (
              <h3 className="text-3xl md:text-5xl font-black text-slate-800 z-10 leading-tight">{currentQ ? currentQ.question : "Loading..."}</h3>
            )}
          </div>
          <div className="p-6 md:p-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ && currentQ.options.map((opt, idx) => (
                <button key={idx} disabled={feedback !== null} onClick={() => handleAnswer(idx)} className={`py-4 px-6 rounded-xl text-xl font-bold border-b-4 transition-all active:border-b-0 active:translate-y-1 ${feedback === null ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700' : feedback === 'correct' && idx === currentQ.correct ? 'bg-emerald-500 border-emerald-700 text-white shadow-emerald-200' : feedback === 'incorrect' && idx === selectedOption ? 'bg-rose-500 border-rose-700 text-white' : idx === currentQ.correct ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'opacity-50 bg-slate-50'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {feedback && (
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className={`max-w-2xl w-full rounded-2xl p-6 shadow-2xl border-4 flex flex-col md:flex-row items-center gap-6 ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-rose-100'}`}>
             <div className={`p-3 rounded-full ${feedback === 'correct' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{feedback === 'correct' ? <CheckCircle size={32} /> : <XCircle size={32} />}</div>
             <div className="flex-1 text-center md:text-left"><h3 className={`text-xl font-black ${feedback === 'correct' ? 'text-emerald-800' : 'text-rose-800'}`}>{feedback === 'correct' ? "Excellent!" : "Not quite"}</h3><p className="text-slate-600 font-medium text-sm md:text-base">{feedback === 'correct' ? "Great job. Keep building that streak!" : currentQ.explanation}</p></div>
             <button onClick={nextQuestion} className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 ${feedback === 'correct' ? 'bg-emerald-600' : 'bg-rose-600'}`}>Next <ArrowRight className="inline ml-1" size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

const Whiteboard = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    context.scale(1, 1);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    contextRef.current = context;
  }, []);
  const startDrawing = ({ nativeEvent }) => { const { offsetX, offsetY } = nativeEvent; contextRef.current.beginPath(); contextRef.current.moveTo(offsetX, offsetY); setIsDrawing(true); };
  const finishDrawing = () => { contextRef.current.closePath(); setIsDrawing(false); };
  const draw = ({ nativeEvent }) => { if (!isDrawing) return; const { offsetX, offsetY } = nativeEvent; contextRef.current.lineTo(offsetX, offsetY); contextRef.current.stroke(); };
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm cursor-crosshair">
       <canvas onMouseDown={startDrawing} onMouseUp={finishDrawing} onMouseMove={draw} ref={canvasRef} />
       <div className="absolute top-4 right-4 flex gap-2"><button onClick={() => {const ctx = canvasRef.current.getContext("2d"); ctx.clearRect(0,0,window.innerWidth,window.innerHeight)}} className="bg-white p-3 rounded-xl shadow border text-slate-600 hover:text-red-500"><Eraser size={24}/></button><button onClick={onClose} className="bg-indigo-600 p-3 rounded-xl shadow text-white hover:bg-indigo-700"><X size={24}/></button></div>
    </div>
  );
};

const Shop = ({ coins, onClose, unlockAvatar, unlocked }) => {
  const avatars = [{ id: 'default', icon: <User />, name: 'Student', cost: 0 }, { id: 'fast', icon: <Zap />, name: 'Speedy', cost: 100 }, { id: 'royal', icon: <Crown />, name: 'Royal', cost: 500 }, { id: 'happy', icon: <Smile />, name: 'Happy', cost: 50 }, { id: 'star', icon: <Star />, name: 'Star', cost: 250 }, { id: 'rich', icon: <Gem />, name: 'Rich', cost: 1000 }];
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative animate-bounce-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
        <div className="text-center mb-8"><h2 className="text-3xl font-black text-slate-800 mb-2">Avatar Shop</h2><div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full text-amber-800 font-bold"><Gem size={20} /> {coins} Coins</div></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {avatars.map((av) => {
            const isOwned = unlocked.includes(av.id);
            const canAfford = coins >= av.cost;
            return (
              <button key={av.id} disabled={isOwned ? false : !canAfford} onClick={() => !isOwned && canAfford && unlockAvatar(av.id, av.cost)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${isOwned ? 'border-green-400 bg-green-50' : canAfford ? 'border-indigo-100 bg-white hover:border-indigo-500 hover:shadow-lg' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isOwned ? 'bg-green-200 text-green-700' : 'bg-indigo-100 text-indigo-500'}`}>{React.cloneElement(av.icon, { size: 32 })}</div>
                <div className="text-center"><div className="font-bold text-slate-700">{av.name}</div>{isOwned ? <div className="text-xs font-bold text-green-600 uppercase">Owned</div> : <div className="flex items-center justify-center gap-1 text-sm font-semibold text-amber-600"><Gem size={14} /> {av.cost}</div>}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};
