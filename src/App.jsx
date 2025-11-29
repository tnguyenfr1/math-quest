import React, { useState, useEffect, useRef } from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Brain, Shapes, Calculator, Sigma, CheckCircle, XCircle, ChevronRight, User, SkipForward, Save, Zap, Pencil, Eraser, X, ShoppingBag, Circle, BarChart, Crown, Smile, Gem } from 'lucide-react';

// --- VISUAL ASSETS GENERATOR ---
const renderVisual = (type, data) => {
  if (!data) return null;

  switch (type) {
    case 'pie_chart':
      // Using conic-gradient for the pie chart
      // data.num = numerator, data.den = denominator
      const deg = (data.num / data.den) * 360;
      return (
        <div className="flex flex-col items-center justify-center my-6 animate-float">
          <div 
            className="w-40 h-40 rounded-full border-4 border-indigo-600 shadow-xl relative"
            style={{ 
              background: `conic-gradient(#818cf8 0deg ${deg}deg, #e0e7ff ${deg}deg 360deg)` 
            }}
          >
            {/* Overlay lines to show segments (simplified for 2,3,4,6,8) */}
          </div>
          <p className="mt-4 text-slate-500 font-bold text-sm uppercase tracking-widest">Shaded Area</p>
        </div>
      );

    case 'fraction_bar':
      return (
        <div className="flex flex-col items-center justify-center my-8 w-full max-w-sm mx-auto animate-float">
          <div className="flex w-full h-16 border-4 border-indigo-600 rounded-xl overflow-hidden bg-indigo-50 shadow-lg">
            {Array.from({ length: data.den }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 border-r-2 border-indigo-200 last:border-r-0 ${i < data.num ? 'bg-indigo-400' : 'bg-transparent'}`}
              />
            ))}
          </div>
        </div>
      );

    case 'bar_graph':
      // data.labels = ['Apples', 'Bananas', ...], data.values = [10, 5, ...]
      const maxVal = Math.max(...data.values);
      return (
        <div className="my-6 w-full max-w-md mx-auto h-64 flex items-end justify-around gap-4 p-4 bg-white rounded-xl border-2 border-slate-100 shadow-inner">
          {data.values.map((val, i) => (
            <div key={i} className="flex flex-col items-center justify-end h-full w-full group">
              <div 
                className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg transition-all duration-1000 ease-out shadow-md group-hover:from-indigo-400 group-hover:to-purple-300 relative"
                style={{ height: `${(val / maxVal) * 80}%` }}
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
              </div>
              <span className="mt-2 text-xs font-bold text-slate-500 uppercase">{data.labels[i]}</span>
            </div>
          ))}
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

    case 'rect': 
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="220" height="180" viewBox="0 0 200 160" className="overflow-visible drop-shadow-xl">
            <rect x="20" y="20" width={data.w * 15} height={data.h * 15} fill="#f472b6" stroke="#be185d" strokeWidth="5" rx="8" />
            <text x={20 + (data.w * 15) / 2} y="15" textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="16" fontFamily="sans-serif">{data.w} cm</text>
            <text x={10} y={20 + (data.h * 15) / 2} textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="16" fontFamily="sans-serif" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>{data.h} cm</text>
          </svg>
        </div>
      );

    case 'circle':
      return (
        <div className="flex justify-center items-center my-6 h-48 animate-float">
          <svg width="180" height="180" viewBox="0 0 160 160" className="overflow-visible drop-shadow-xl">
            <circle cx="80" cy="80" r={data.r * 8} fill="#34d399" stroke="#059669" strokeWidth="5" />
            <line x1="80" y1="80" x2={80 + data.r * 8} y2="80" stroke="#065f46" strokeWidth="3" strokeDasharray="6" />
            <text x={80 + (data.r * 8) / 2} y="70" textAnchor="middle" fill="#065f46" fontWeight="bold" fontSize="16" fontFamily="sans-serif">r = {data.r} cm</text>
          </svg>
        </div>
      );

    case 'shape_pattern':
      const shapes = {
        'square': (c) => <div className={`w-12 h-12 ${c} rounded-lg shadow-md border-2 border-black/10`}></div>,
        'circle': (c) => <div className={`w-12 h-12 ${c} rounded-full shadow-md border-2 border-black/10`}></div>,
        'triangle': (c) => <div className={`w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[48px] ${c.replace('bg-', 'border-b-')} drop-shadow-md`}></div>,
        '?': () => <div className="w-12 h-12 bg-white border-4 border-dashed border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xl animate-pulse">?</div>
      };
      return (
        <div className="flex gap-4 justify-center items-center my-8 p-6 bg-white/50 rounded-2xl border-2 border-indigo-100 shadow-inner">
          {data.sequence.map((item, i) => (
            <div key={i} className="transform transition-transform hover:scale-110 duration-200">
              {shapes[item.shape] ? shapes[item.shape](item.color) : shapes['?']()}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

// --- CURRICULUM-BASED QUESTION GENERATOR ---
const generateQuestion = (grade, topic, level) => {
  let q = { question: "", options: [], correct: 0, explanation: "", visualType: null, visualData: null };
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const createOptions = (correctVal, type = 'number', format = null) => {
    let opts = new Set([correctVal]);
    let maxAttempts = 50;
    while (opts.size < 4 && maxAttempts > 0) {
      maxAttempts--;
      let val;
      if (type === 'text') {
        const vocab = format || ['Triangle', 'Square', 'Pentagon', 'Hexagon', 'Octagon'];
        val = vocab[getRandomInt(0, vocab.length - 1)];
      } else {
         let noise = getRandomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
         if (type === 'algebra') noise = getRandomInt(1, 10);
         val = correctVal + noise;
         // Prevent negatives only for simple arithmetic in lower grades
         if (grade < 7 && type !== 'algebra' && val < 0) val = 0; 
      }
      // For simplified fractions, ensure denominator is > 0
      if (val !== correctVal) opts.add(val);
    }
    if (opts.size < 4 && type === 'text') {
        const vocab = format || ['A', 'B', 'C', 'D'];
        vocab.forEach(v => { if(v !== correctVal) opts.add(v); });
    }
    const shuffled = Array.from(opts).slice(0, 4).sort(() => Math.random() - 0.5);
    return { options: shuffled, correctIndex: shuffled.indexOf(correctVal) };
  };

  if (topic === 'Fractions') {
    // NEW TOPIC: FRACTIONS
    const den = [2, 3, 4, 5, 6, 8, 10][getRandomInt(0, 6)];
    const num = getRandomInt(1, den - 1);
    
    if (grade <= 4) {
      // Visual Identification
      const isPie = Math.random() > 0.5;
      q.visualType = isPie ? 'pie_chart' : 'fraction_bar';
      q.visualData = { num, den };
      q.question = "What fraction is shaded?";
      
      const correctStr = `${num}/${den}`;
      // Generate option strings
      let opts = new Set([correctStr]);
      while (opts.size < 4) {
        const n = getRandomInt(1, den-1);
        const d = [2,3,4,5,6,8,10][getRandomInt(0,6)];
        if(n<d) opts.add(`${n}/${d}`);
      }
      q.options = Array.from(opts).sort(() => Math.random() - 0.5);
      q.correct = q.options.indexOf(correctStr);
      q.explanation = `Count the shaded parts (${num}) and the total parts (${den}).`;
    } else {
      // Comparison or Simple Math
      const type = Math.random() > 0.5 ? 'compare' : 'add';
      if (type === 'compare') {
         let num2 = getRandomInt(1, den-1);
         if (num === num2) { num2 === den-1 ? num2-- : num2++; } // ensure diff
         
         q.visualType = 'fraction_bar'; // Show one of them? Or just text. Let's show text mostly for upper grades
         q.question = `Which is larger: ${num}/${den} or ${num2}/${den}?`;
         q.options = [`${num}/${den}`, `${num2}/${den}`, "Equal", "Impossible"];
         const larger = num > num2 ? `${num}/${den}` : `${num2}/${den}`;
         q.correct = q.options.indexOf(larger);
         q.explanation = `Since the denominators are the same, compare the numerators: ${Math.max(num, num2)} > ${Math.min(num, num2)}.`;
      } else {
         // Addition with same denominator
         const num2 = getRandomInt(1, den - num); // ensure sum <= 1 roughly
         q.question = `${num}/${den} + ${num2}/${den} = ?`;
         const ansNum = num + num2;
         const ansStr = `${ansNum}/${den}`;
         
         let opts = new Set([ansStr]);
         while(opts.size < 4) {
           let n = getRandomInt(1, den);
           if(n !== ansNum) opts.add(`${n}/${den}`);
         }
         q.options = Array.from(opts).sort();
         q.correct = q.options.indexOf(ansStr);
         q.explanation = `Keep the denominator (${den}) and add the numerators: ${num} + ${num2} = ${ansNum}.`;
      }
    }
  }

  else if (topic === 'Data') {
    // NEW TOPIC: DATA
    const items = ['Apples', 'Bananas', 'Cherries', 'Dates'];
    const values = items.map(() => getRandomInt(2, 15));
    q.visualType = 'bar_graph';
    q.visualData = { labels: items, values: values };
    
    if (grade <= 4) {
       // Read Graph
       const targetIdx = getRandomInt(0, 3);
       q.question = `How many ${items[targetIdx]} are there?`;
       const ans = values[targetIdx];
       // FIX: Call createOptions once
       const generated = createOptions(ans);
       q.options = generated.options;
       q.correct = generated.correctIndex;
       q.explanation = `Look at the bar for ${items[targetIdx]} and read the height value.`;
    } else {
       // Compare or Total
       const isSum = Math.random() > 0.5;
       if (isSum) {
         q.question = "How many items in total?";
         const sum = values.reduce((a,b)=>a+b,0);
         const generated = createOptions(sum);
         q.options = generated.options;
         q.correct = generated.correctIndex;
         q.explanation = `Add up all the bar values: ${values.join(' + ')} = ${sum}.`;
       } else {
         const targetIdx = getRandomInt(0, 3);
         const targetIdx2 = (targetIdx + 1) % 4;
         // q.question = `How many more ${items[targetIdx]} than ${items[targetIdx2]}?`;
         const diff = values[targetIdx] - values[targetIdx2];
         // Trick: diff can be negative or positive, let's phrase "Difference between..."
         q.question = `What is the difference between ${items[targetIdx]} and ${items[targetIdx2]}?`;
         const ans = Math.abs(diff);
         const generated = createOptions(ans);
         q.options = generated.options;
         q.correct = generated.correctIndex;
         q.explanation = `Subtract the smaller value from the larger one: |${values[targetIdx]} - ${values[targetIdx2]}| = ${ans}.`;
       }
    }
  }

  else if (topic === 'Geometry') {
    if (grade <= 3) {
      const shapes = [{ name: 'Triangle', sides: 3 }, { name: 'Quadrilateral', sides: 4 }, { name: 'Pentagon', sides: 5 }, { name: 'Hexagon', sides: 6 }];
      const target = shapes[getRandomInt(0, shapes.length - 1)];
      q.visualType = 'polygon';
      q.visualData = { shape: target.name };
      q.question = Math.random() < 0.5 ? "What is the name of this shape?" : "How many sides does this shape have?";
      if (q.question.includes('name')) {
        const { options, correctIndex } = createOptions(target.name, 'text', shapes.map(s => s.name));
        q.options = options; q.correct = correctIndex;
        q.explanation = `A shape with ${target.sides} sides is called a ${target.name}.`;
      } else {
        const { options, correctIndex } = createOptions(target.sides);
        q.options = options; q.correct = correctIndex;
        q.explanation = `Count the straight lines. This ${target.name} has ${target.sides} sides.`;
      }
    } else if (grade <= 6) {
      const w = getRandomInt(3, 10); const h = getRandomInt(3, 10);
      const isArea = Math.random() > 0.5;
      q.visualType = 'rect'; q.visualData = { w, h };
      q.question = isArea ? "Calculate the Area." : "Calculate the Perimeter.";
      const ans = isArea ? w * h : 2 * (w + h);
      const { options, correctIndex } = createOptions(ans);
      q.options = options; q.correct = correctIndex;
      q.explanation = isArea ? `Area = Length × Width` : `Perimeter = Add all sides`;
    } else {
      const r = getRandomInt(2, 10); const isArea = Math.random() > 0.5;
      q.visualType = 'circle'; q.visualData = { r };
      q.question = isArea ? `Area of the circle? (Use π ≈ 3.14)` : `Circumference? (Use π ≈ 3.14)`;
      const ans = isArea ? Math.floor(3.14 * r * r) : Math.floor(2 * 3.14 * r);
      q.options = [ans, ans + 10, ans - 5, ans + 25].sort(() => Math.random() - 0.5);
      q.correct = q.options.indexOf(ans);
      q.explanation = isArea ? `Area = π × r²` : `Circumference = 2 × π × r`;
    }
  }
  
  // Re-using existing logic for Mental Math, Algebra, Patterns but compacted
  else if (topic === 'Mental Math') {
     const a = getRandomInt(5,20), b=getRandomInt(2,10);
     q.question = `${a} + ${b} = ?`;
     let generated = createOptions(a+b);
     q.options = generated.options; q.correct = generated.correctIndex;
     q.explanation = "Simple addition.";
     if (grade >= 5) { 
        q.question = `${a} × ${b} = ?`; 
        generated = createOptions(a*b);
        q.options = generated.options; q.correct = generated.correctIndex; 
     }
  }
  else if (topic === 'Algebra') {
      const x = getRandomInt(2, 10); const add = getRandomInt(1, 10);
      q.question = `Solve: x + ${add} = ${x+add}`;
      const generated = createOptions(x);
      q.options = generated.options; q.correct = generated.correctIndex;
      q.explanation = "Subtract to solve.";
  }
  else if (topic === 'Patterns') {
      const start = getRandomInt(2,10); const step = getRandomInt(2,5);
      q.question = `${start}, ${start+step}, ${start+step*2}, ...`;
      const generated = createOptions(start+step*3);
      q.options = generated.options; q.correct = generated.correctIndex;
      q.explanation = `Pattern is +${step}`;
  }

  return q;
};


// --- WHITEBOARD COMPONENT ---
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
    context.lineWidth = 4;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm cursor-crosshair touch-none">
       <canvas
         onMouseDown={startDrawing}
         onMouseUp={finishDrawing}
         onMouseMove={draw}
         ref={canvasRef}
       />
       <div className="absolute top-4 right-4 flex gap-2">
         <button onClick={clearCanvas} className="bg-white p-3 rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-red-500">
           <Eraser size={24} />
         </button>
         <button onClick={onClose} className="bg-indigo-600 p-3 rounded-full shadow-lg text-white hover:bg-indigo-700">
           <X size={24} />
         </button>
       </div>
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold opacity-80 pointer-events-none">
         Scratchpad Active
       </div>
    </div>
  );
};

// --- SHOP COMPONENT ---
const Shop = ({ coins, onClose, unlockAvatar, unlocked }) => {
  const avatars = [
    { id: 'default', icon: <User />, name: 'Student', cost: 0 },
    { id: 'fast', icon: <Zap />, name: 'Speedy', cost: 100 },
    { id: 'royal', icon: <Crown />, name: 'Royal', cost: 500 },
    { id: 'happy', icon: <Smile />, name: 'Happy', cost: 50 },
    { id: 'star', icon: <Star />, name: 'Star', cost: 250 },
    { id: 'rich', icon: <Gem />, name: 'Rich', cost: 1000 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-bounce-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 mb-2">Avatar Shop</h2>
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
            <Gem className="text-amber-500 fill-amber-500" size={20} />
            <span className="font-bold text-amber-800 text-lg">{coins} Coins</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {avatars.map((av) => {
            const isOwned = unlocked.includes(av.id);
            const canAfford = coins >= av.cost;
            return (
              <button 
                key={av.id}
                disabled={isOwned ? false : !canAfford}
                onClick={() => !isOwned && canAfford && unlockAvatar(av.id, av.cost)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                  isOwned 
                    ? 'border-green-400 bg-green-50' 
                    : canAfford 
                      ? 'border-indigo-100 bg-white hover:border-indigo-500 hover:shadow-lg' 
                      : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isOwned ? 'bg-green-200 text-green-700' : 'bg-indigo-100 text-indigo-500'}`}>
                  {React.cloneElement(av.icon, { size: 32 })}
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-700">{av.name}</div>
                  {isOwned ? (
                    <div className="text-xs font-bold text-green-600 uppercase">Owned</div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-sm font-semibold text-amber-600">
                      <Gem size={14} /> {av.cost}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [gameState, setGameState] = useState('loading'); 
  const [user, setUser] = useState("");
  const [grade, setGrade] = useState(3);
  const [topic, setTopic] = useState("");
  
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0); // New Currency
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Shop State
  const [unlockedAvatars, setUnlockedAvatars] = useState(['default']);
  const [currentAvatar, setCurrentAvatar] = useState('default');
  const [showShop, setShowShop] = useState(false);
  
  // Whiteboard State
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  const [currentQ, setCurrentQ] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const [selectedOption, setSelectedOption] = useState(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('mathquest_v2_save');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user || "");
      setScore(parsed.score || 0);
      setCoins(parsed.coins || 0);
      setUnlockedAvatars(parsed.unlockedAvatars || ['default']);
      setStreak(parsed.streak || 0);
      setLevel(parsed.level || 1);
      setGrade(parsed.grade || 3);
      if (parsed.user) setGameState('grade_select');
      else setGameState('intro');
    } else {
      setGameState('intro');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mathquest_v2_save', JSON.stringify({
        user, score, coins, unlockedAvatars, streak, level, grade
      }));
    }
  }, [user, score, coins, unlockedAvatars, streak, level, grade]);

  const unlockAvatar = (id, cost) => {
    if (coins >= cost) {
      setCoins(c => c - cost);
      setUnlockedAvatars([...unlockedAvatars, id]);
    }
  };

  const startGame = (selectedTopic) => {
    setTopic(selectedTopic);
    setGameState('playing');
    loadQuestion(grade, selectedTopic, level);
  };

  const loadQuestion = (g, t, l) => {
    setFeedback(null);
    setSelectedOption(null);
    const newQ = generateQuestion(g, t, l);
    setCurrentQ(newQ);
  };

  const handleAnswer = (index) => {
    if (feedback) return; 
    setSelectedOption(index);
    
    if (index === currentQ.correct) {
      setFeedback('correct');
      setScore(s => s + 100 + (streak * 10));
      setCoins(c => c + 10); // Earn coins
      setStreak(s => s + 1);
      if (streak > 0 && streak % 3 === 0) setLevel(l => l + 1);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  const nextQuestion = () => loadQuestion(grade, topic, level);
  const skipQuestion = () => { setStreak(0); loadQuestion(grade, topic, level); };

  // --- RENDERING HELPER ---
  // Replaced PageWrapper component with a function to maintain stable DOM structure during re-renders
  const renderPage = (content) => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-sans p-6 flex flex-col items-center justify-center">
      {content}
      {showWhiteboard && <Whiteboard onClose={() => setShowWhiteboard(false)} />}
      {showShop && <Shop coins={coins} onClose={() => setShowShop(false)} unlockAvatar={unlockAvatar} unlocked={unlockedAvatars} />}
    </div>
  );

  if (gameState === 'loading') return <div className="min-h-screen flex items-center justify-center text-indigo-400 font-bold text-xl">Loading MathQuest...</div>;

  if (gameState === 'intro') {
    return renderPage(
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-xl border border-white/50 text-center animate-fade-in-up">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition-transform">
          <Brain className="text-white w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">MathQuest</h1>
        <p className="text-slate-500 mb-8 font-medium text-lg">Adventure Awaits!</p>
        <div className="text-left mb-8">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">What is your name?</label>
          <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Type your name..." className="w-full pl-4 pr-4 py-4 bg-indigo-50/50 border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-xl font-bold text-indigo-900" onKeyPress={(e) => e.key === 'Enter' && user.trim() && setGameState('grade_select')} />
        </div>
        <button disabled={!user.trim()} onClick={() => setGameState('grade_select')} className={`w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all transform border-b-4 active:border-b-0 active:translate-y-1 ${user.trim() ? 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-600' : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'}`}>Start Adventure <ArrowRight size={24} /></button>
      </div>
    );
  }

  if (gameState === 'grade_select') {
    return renderPage(
      <div className="max-w-4xl w-full">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-slate-800">Hi, <span className="text-indigo-600">{user}</span>! 👋</h2>
            <p className="text-slate-500 font-medium">Choose your grade to begin.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/60 p-2 rounded-2xl backdrop-blur-sm border border-white/50">
             <button onClick={() => setShowShop(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-xl hover:bg-amber-200 transition-colors">
               <Gem className="text-amber-600" size={20} />
               <span className="font-black text-amber-800">{coins}</span>
             </button>
             <div className="h-8 w-px bg-slate-200"></div>
             <div className="px-4 text-center">
               <div className="text-xs text-slate-400 font-bold uppercase">Score</div>
               <div className="font-black text-indigo-600 text-xl">{score}</div>
             </div>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[3, 4, 5, 6, 7, 8].map((g) => (
            <button key={g} onClick={() => { setGrade(g); setGameState('topic_select'); }} className={`group relative p-8 rounded-3xl border-b-8 transition-all transform active:scale-95 hover:-translate-y-2 active:translate-y-0 active:border-b-0 duration-200 text-center ${grade === g ? 'bg-indigo-500 border-indigo-700 text-white shadow-indigo-500/40 shadow-xl' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-xl'}`}>
              <div className={`text-5xl font-black mb-2 ${grade === g ? 'text-white' : 'text-indigo-100 group-hover:text-indigo-500'}`}>{g}</div>
              <div className={`text-xl font-bold ${grade === g ? 'text-indigo-100' : 'text-slate-600'}`}>Grade {g}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'topic_select') {
    const topics = [
      { id: 'Mental Math', icon: <Calculator />, color: 'from-emerald-400 to-teal-500', desc: 'Arithmetic & Integers' },
      { id: 'Fractions', icon: <Circle />, color: 'from-cyan-400 to-blue-500', desc: 'Pies & Bars' },
      { id: 'Algebra', icon: <Sigma />, color: 'from-rose-400 to-pink-500', desc: 'Solving Equations' },
      { id: 'Geometry', icon: <Shapes />, color: 'from-blue-400 to-indigo-500', desc: 'Shapes & Measures' },
      { id: 'Data', icon: <BarChart />, color: 'from-violet-400 to-purple-500', desc: 'Graphs & Stats' },
      { id: 'Patterns', icon: <Brain />, color: 'from-amber-400 to-orange-500', desc: 'Logic & Sequences' },
    ];

    return renderPage(
      <div className="max-w-4xl w-full">
        <button onClick={() => setGameState('grade_select')} className="text-slate-400 hover:text-indigo-600 mb-8 flex items-center gap-2 font-bold transition-colors"><ArrowRight className="rotate-180" size={20} /> Back to Grades</button>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Pick a Topic</h2>
        <p className="text-slate-500 mb-10 text-lg">Curriculum adapted for <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Grade {grade}</span>.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t) => (
            <button key={t.id} onClick={() => startGame(t.id)} className="bg-white p-6 rounded-3xl border-b-8 border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 active:border-b-0 flex flex-col items-center text-center gap-4 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${t.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>{React.cloneElement(t.icon, { size: 32, strokeWidth: 2.5 })}</div>
              <div><h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-700 transition-colors">{t.id}</h3><p className="text-slate-400 font-medium text-sm">{t.desc}</p></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // GAME SCREEN
  return renderPage(
    <div className="w-full h-full flex flex-col">
      <div className="bg-white/80 backdrop-blur-md border-b border-white/50 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setGameState('topic_select')} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl group transition-colors" title="Exit"><RotateCcw size={20} className="text-slate-500 group-hover:text-slate-700" /></button>
          <div className="hidden md:block">
            <h2 className="font-black text-slate-800 text-lg leading-tight">{topic}</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider"><span>Grade {grade}</span><span className="w-1 h-1 rounded-full bg-slate-300"></span><span>Level {level}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowWhiteboard(true)} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors" title="Open Scratchpad"><Pencil size={20}/></button>
          <div className="flex items-center gap-2 bg-amber-100/50 px-4 py-2 rounded-2xl border-2 border-amber-100">
             <Gem className="text-amber-500 fill-amber-500" size={20} />
             <span className="font-bold text-amber-700">{coins}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-5xl mx-auto">
        <div className="w-full max-w-3xl mb-6 flex items-center gap-3">
           <span className="text-xs font-bold text-indigo-400 uppercase">Level {level}</span>
           <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500" style={{ width: `${Math.min((streak % 5) * 20, 100)}%` }}></div>
           </div>
           <Zap size={16} className={`${streak > 0 && streak % 5 === 0 ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
        </div>

        <div className="w-full bg-white rounded-[2rem] shadow-2xl border-4 border-white overflow-hidden relative max-w-3xl">
          <div className="bg-slate-50 p-8 text-center border-b border-slate-100 min-h-[240px] flex flex-col items-center justify-center relative">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px]"></div>
             {currentQ && currentQ.visualType ? (
               <div className="relative z-10 w-full">
                 <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-2">{currentQ.question}</h3>
                 {renderVisual(currentQ.visualType, currentQ.visualData)}
               </div>
             ) : (
               <h3 className="relative z-10 text-4xl md:text-6xl font-black text-indigo-900 tracking-tight">{currentQ ? currentQ.question : "Loading..."}</h3>
             )}
          </div>
          
          <div className="p-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ && currentQ.options.map((opt, idx) => (
                <button key={idx} disabled={feedback !== null} onClick={() => handleAnswer(idx)} className={`relative p-5 rounded-2xl text-xl font-bold border-b-[6px] transition-all transform active:border-b-0 active:translate-y-[6px] flex items-center justify-center min-h-[80px] ${feedback === null ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-lg' : feedback === 'correct' && idx === currentQ.correct ? 'bg-emerald-500 border-emerald-700 text-white' : feedback === 'incorrect' && idx === selectedOption ? 'bg-rose-500 border-rose-700 text-white' : idx === currentQ.correct ? 'bg-emerald-100 border-emerald-300 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                  {opt}
                </button>
              ))}
            </div>
            {!feedback && (
              <div className="mt-8 flex justify-center">
                <button onClick={skipQuestion} className="text-slate-400 hover:text-indigo-500 font-bold text-sm flex items-center gap-2 transition-colors px-4 py-2 rounded-full hover:bg-indigo-50">Too hard? Skip <SkipForward size={16} /></button>
              </div>
            )}
          </div>
        </div>

        {feedback && (
          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 flex justify-center pointer-events-none z-50">
            <div className={`pointer-events-auto max-w-2xl w-full rounded-3xl p-6 shadow-2xl border-4 animate-bounce-in flex flex-col md:flex-row items-center gap-6 ${feedback === 'correct' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-rose-100'}`}>
               <div className={`p-4 rounded-full flex-shrink-0 ${feedback === 'correct' ? 'bg-emerald-100' : 'bg-rose-100'}`}>{feedback === 'correct' ? <CheckCircle className="text-emerald-600 w-8 h-8" /> : <XCircle className="text-rose-600 w-8 h-8" />}</div>
               <div className="flex-1 text-center md:text-left">
                 <h3 className={`text-2xl font-black mb-1 ${feedback === 'correct' ? 'text-emerald-800' : 'text-rose-800'}`}>{feedback === 'correct' ? "Awesome!" : "Nice Try!"}</h3>
                 <p className="text-slate-600 font-medium leading-relaxed">{feedback === 'correct' ? "You got it right. Keep going!" : currentQ.explanation}</p>
               </div>
               <button onClick={nextQuestion} className={`px-8 py-4 rounded-2xl font-black text-white text-lg shadow-lg hover:scale-105 transition-transform border-b-4 active:border-b-0 active:translate-y-1 ${feedback === 'correct' ? 'bg-emerald-500 border-emerald-700 hover:bg-emerald-600' : 'bg-rose-500 border-rose-700 hover:bg-rose-600'}`}>Next <ArrowRight className="inline ml-1" size={24} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
