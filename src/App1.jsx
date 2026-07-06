import { useState, useEffect } from 'react';

export default function QuizGame() {
  // --- 1. STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Selections state tracking
  const [sliderIndex, setSliderIndex] = useState(1); 
  const [selectedConcerns, setSelectedConcerns] = useState([]); 
  const [finalSelections, setFinalSelections] = useState({ skinType: "", concerns: [], budget: "" });

  // TRACKS UNLOCKED MYSTERY BOXES
  const [unlockedSteps, setUnlockedSteps] = useState([]); 

  // --- 2. QUIZ DATA ---
  const questions = [
    { 
      text: "What is your skin type?", 
      options: ["Dry", "Combination", "Oily"] 
    },
    { 
      text: "What are your skin concerns? (Select up to 2)", 
      options: ["Oils", "Dryness", "Acne", "Redness", "Sensitivity", "Hyperpigmentation", "Aging"] 
    },
    { 
      text: "What is your preferred budget tier for a product?", 
      options: ["Low ($5-$20)", "Mid ($20-$50)", "High ($50-$100)"] 
    }
  ];

  // --- 3. DYNAMIC PROGRESS CALCULATION ---
  const progressPercent = (currentQuestion / questions.length) * 100;

  // --- 4. DATA FETCHING ---
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading skincare data:", error);
      }
    }
    loadProducts();
  }, []);

  // --- 5. SELECTION HANDLERS ---
  const handleSliderNext = () => {
    const selectedSkin = questions[0].options[sliderIndex];
    setFinalSelections(prev => ({ ...prev, skinType: selectedSkin }));
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleConcernCheckboxChange = (concern) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      if (selectedConcerns.length < 2) {
        setSelectedConcerns([...selectedConcerns, concern]);
      }
    }
  };

  const handleConcernNext = () => {
    setFinalSelections(prev => ({ ...prev, concerns: selectedConcerns }));
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleBudgetAnswer = (selectedOption) => {
    let selectedBudget = "Mid";
    if (selectedOption.includes("Low")) selectedBudget = "Low";
    if (selectedOption.includes("High")) selectedBudget = "High";

    setFinalSelections(prev => {
      const updated = { ...prev, budget: selectedBudget };
      return updated;
    });
    setQuizComplete(true);
  };

  const handleUnlockStep = (step) => {
    if (!unlockedSteps.includes(step)) {
      setUnlockedSteps([...unlockedSteps, step]);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSliderIndex(1);
    setSelectedConcerns([]);
    setFinalSelections({ skinType: "", concerns: [], budget: "" });
    setUnlockedSteps([]); 
    setQuizComplete(false);
  };

  // --- 6. LOGIC FILTER ENGINE ---
  const getBaumannRoutine = (skinType, concerns, budget) => {
    if (!products.length) return { cleanser: null, serum: null, moisturizer: null };

    const budgetMatched = products.filter(p => p.budgetTier === budget);

    const skinTypeMatched = budgetMatched.filter(p => {
      if (skinType === "Dry") return p.baumannTraits.includes("Dry");
      if (skinType === "Oily") return p.baumannTraits.includes("Oily");
      if (skinType === "Combination") return p.baumannTraits.includes("Dry") || p.baumannTraits.includes("Oily");
      return true;
    });

    const cleansers = skinTypeMatched.filter(p => p.category === 'Cleanser');
    const serums = skinTypeMatched.filter(p => p.category === 'Serum');
    const moisturizers = skinTypeMatched.filter(p => p.category === 'Moisturizer');

    const findBestMatch = (pool) => {
      if (concerns.length === 0) return pool[0];
      const concernMatch = pool.find(p => 
        p.skinConcerns && p.skinConcerns.some(c => concerns.includes(c))
      );
      return concernMatch || pool[0]; 
    };

    return {
      cleanser: findBestMatch(cleansers),
      brand: 'skincare',
      serum: findBestMatch(serums),
      moisturizer: findBestMatch(moisturizers)
    };
  };

  // --- 7. RENDER SCREEN: RECOMMENDATIONS RESULTS ---
  if (quizComplete) {
    const exactSkin = finalSelections.skinType || questions[0].options[sliderIndex];
    const exactConcerns = finalSelections.concerns;
    const exactBudget = finalSelections.budget || "Mid";

    const routine = getBaumannRoutine(exactSkin, exactConcerns, exactBudget);

    const boxBaseStyle = {
      border: '2px dashed #3182ce',
      background: '#ebf8ff',
      padding: '40px 20px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const productCardStyle = {
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'white',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    };

    const handleImageError = (e) => {
      e.target.style.display = 'none'; 
      const fallbackText = document.createElement('div');
      fallbackText.innerText = '✨🧴✨\n(Image Asset Loading)';
      // FIX: Changed .styleText to .cssText to register layout rules natively
      fallbackText.style.cssText = 'margin: 20px 0; font-size: 1.1rem; color: #718096; white-space: pre-line; font-weight: bold;';
      e.target.parentNode.insertBefore(fallbackText, e.target.nextSibling);
    };

    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '10px', height: '8px', marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ width: '100%', background: '#48bb78', height: '100%' }} />
        </div>

        <h2 style={{ color: '#1a202c', marginBottom: '5px' }}>Tap Boxes to Reveal Routine</h2>
        <p style={{ color: '#666', marginTop: '0' }}>
          {exactSkin} Skin | Targets: {exactConcerns.join(', ') || 'None'} | {exactBudget} Budget
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', margin: '30px 0' }}>
          
          {/* STEP 1: CLEANSER */}
          {!unlockedSteps.includes('cleanser') ? (
            <div onClick={() => handleUnlockStep('cleanser')} style={boxBaseStyle}>
              <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎁</span>
              <h3 style={{ margin: 0, color: '#2b6cb0' }}>Reveal Step 1: Cleanser</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: '5px 0 0 0' }}>Tap to unlock mystery item</p>
            </div>
          ) : routine.cleanser ? (
            <div style={productCardStyle}>
              <span style={{ fontSize: '0.8rem', background: '#e2e8f0', color: '#1a202c', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Step 1: Cleanser Unlocked! 🔓</span>
              <img 
                src={routine.cleanser.image} 
                alt={routine.cleanser.name} 
                onError={handleImageError}
                style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '15px 0' }} 
              />
              <h3 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>{routine.cleanser.brand} - {routine.cleanser.name}</h3>
              <p style={{ fontWeight: 'bold', color: '#2b6cb0', margin: 0 }}>${routine.cleanser.price.toFixed(2)}</p>
            </div>
          ) : <p style={{ color: '#1a202c' }}>No cleanser found.</p>}

          {/* STEP 2: SERUM */}
          {!unlockedSteps.includes('serum') ? (
            <div onClick={() => handleUnlockStep('serum')} style={boxBaseStyle}>
              <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎁</span>
              <h3 style={{ margin: 0, color: '#2b6cb0' }}>Reveal Step 2: Serum</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: '5px 0 0 0' }}>Tap to unlock mystery item</p>
            </div>
          ) : routine.serum ? (
            <div style={productCardStyle}>
              <span style={{ fontSize: '0.8rem', background: '#e2e8f0', color: '#1a202c', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Step 2: Serum Unlocked! 🔓</span>
              <img 
                src={routine.serum.image} 
                alt={routine.serum.name} 
                onError={handleImageError}
                style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '15px 0' }} 
              />
              <h3 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>{routine.serum.brand} - {routine.serum.name}</h3>
              <p style={{ fontWeight: 'bold', color: '#2b6cb0', margin: 0 }}>${routine.serum.price.toFixed(2)}</p>
            </div>
          ) : <p style={{ color: '#1a202c' }}>No serum found.</p>}

          {/* STEP 3: MOISTURIZER */}
          {!unlockedSteps.includes('moisturizer') ? (
            <div onClick={() => handleUnlockStep('moisturizer')} style={boxBaseStyle}>
              <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎁</span>
              <h3 style={{ margin: 0, color: '#2b6cb0' }}>Reveal Step 3: Moisturizer</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a5568', margin: '5px 0 0 0' }}>Tap to unlock mystery item</p>
            </div>
          ) : routine.moisturizer ? (
            <div style={productCardStyle}>
              <span style={{ fontSize: '0.8rem', background: '#e2e8f0', color: '#1a202c', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Step 3: Moisturizer Unlocked! 🔓</span>
              <img 
                src={routine.moisturizer.image} 
                alt={routine.moisturizer.name} 
                onError={handleImageError}
                style={{ width: '120px', height: '120px', objectFit: 'contain', margin: '15px 0' }} 
              />
              <h3 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>{routine.moisturizer.brand} - {routine.moisturizer.name}</h3>
              <p style={{ fontWeight: 'bold', color: '#2b6cb0', margin: 0 }}>${routine.moisturizer.price.toFixed(2)}</p>
            </div>
          ) : <p style={{ color: '#1a202c' }}>No moisturizer found.</p>}

        </div>

        <button onClick={handleReset} style={{ padding: '10px 20px', cursor: 'pointer', color: '#1a202c', background: 'white', border: '1px solid #cbd5e0', borderRadius: '6px' }}>
          Retake Quiz
        </button>
      </div>
    );
  }

  // --- 8. RENDER SCREEN: GAMEPLAY QUESTIONS ---
  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #eee', borderRadius: '12px', background: 'white' }}>
      
      <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '10px', height: '8px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, background: '#3182ce', height: '100%', transition: 'width 0.4s ease' }} />
      </div>

      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Question {currentQuestion + 1} of {questions.length}</span>
      <h2 style={{ margin: '10px 0 30px 0', color: '#1a202c' }}>{questions[currentQuestion].text}</h2>

      {currentQuestion === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="1" 
            value={sliderIndex} 
            onChange={(e) => setSliderIndex(parseInt(e.target.value))} 
            style={{ width: '80%', maxWidth: '300px', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '1.2rem', color: '#4a5568', minHeight: '30px' }}>
            Current choice: <strong>{questions[0].options[sliderIndex]}</strong>
          </div>
          <button onClick={handleSliderNext} style={{ marginTop: '10px', padding: '10px 30px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Next Question
          </button>
        </div>
      ) : currentQuestion === 1 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', gap: '10px', textAlign: 'left', maxWidth: '300px', margin: '0 auto' }}>
            {questions[1].options.map(option => {
              const isChecked = selectedConcerns.includes(option);
              const isDisabled = !isChecked && selectedConcerns.length >= 2;
              return (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', color: isDisabled ? '#cbd5e0' : '#1a202c', cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
                  <input type="checkbox" checked={isChecked} disabled={isDisabled} onChange={() => handleConcernCheckboxChange(option)} style={{ width: '18px', height: '18px', cursor: isDisabled ? 'not-allowed' : 'pointer' }} />
                  {option}
                </label>
              );
            })}
          </div>
          <button onClick={handleConcernNext} style={{ marginTop: '15px', padding: '10px 30px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Next Question
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions[currentQuestion].options.map(option => (
            <button key={option} onClick={() => handleBudgetAnswer(option)} style={{ padding: '12px', fontSize: '1rem', border: '1px solid #cbd5e0', borderRadius: '6px', background: 'white', color: '#1a202c', cursor: 'pointer' }}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}