const fs = require('fs');

let code = fs.readFileSync('src/app/pit-management/experiments/new/page.tsx', 'utf-8');

// Update pending action save on submit
code = code.replace(
  /\/\/ Save form state to local storage to persist after login[\s\S]*?localStorage\.setItem\('nawah_pending_action', 'new_experiment'\);[\s\S]*?\}\s*catch\(e\) \{\}/,
  `// Save form state to local storage to persist after login
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nawah_pending_action', 'new_experiment');
            localStorage.setItem('nawah_pending_experiment_data', JSON.stringify({
              selectedBatchId,
              objective,
              quantityUsed,
              processingMethod,
              duration,
              observations,
              result,
              status
            }));
          } catch(e) {}
        }`
);

// Add useEffect to restore pending action state on mount
if (!code.includes('nawah_pending_experiment_data')) {
  const useEffectRestore = `
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const pending = localStorage.getItem('nawah_pending_experiment_data');
        if (pending) {
          const data = JSON.parse(pending);
          if (data.selectedBatchId) setSelectedBatchId(data.selectedBatchId);
          if (data.objective) setObjective(data.objective);
          if (data.quantityUsed) setQuantityUsed(data.quantityUsed);
          if (data.processingMethod) setProcessingMethod(data.processingMethod);
          if (data.duration) setDuration(data.duration);
          if (data.observations) setObservations(data.observations);
          if (data.result) setResult(data.result);
          if (data.status) setStatus(data.status);
          localStorage.removeItem('nawah_pending_experiment_data');
          localStorage.removeItem('nawah_pending_action');
        }
      } catch(e) {}
    }
  }, []);
`;
  code = code.replace(/useEffect\(\(\) => \{\s*async function loadBatches\(\)/, useEffectRestore + '\n  useEffect(() => {\n    async function loadBatches()');
}

fs.writeFileSync('src/app/pit-management/experiments/new/page.tsx', code, 'utf-8');
console.log('Added pending experiment restore');
