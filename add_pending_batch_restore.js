const fs = require('fs');

let code = fs.readFileSync('src/app/pit-management/batches/new/page.tsx', 'utf-8');

// Update pending action save on submit
code = code.replace(
  /\/\/ Save form state to local storage to persist after login[\s\S]*?localStorage\.setItem\('nawah_pending_action', 'new_batch'\);[\s\S]*?\}\s*catch\(e\) \{\}/,
  `// Save form state to local storage to persist after login
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('nawah_pending_action', 'new_batch');
            localStorage.setItem('nawah_pending_batch_data', JSON.stringify({
              sourceName,
              quantity,
              dateType,
              cleaningStatus,
              dryingStatus,
              moisture,
              storageMethod,
              notes
            }));
          } catch(e) {}
        }`
);

// Add useEffect to restore pending action state on mount
if (!code.includes('nawah_pending_batch_data')) {
  const useEffectRestore = `
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const pending = localStorage.getItem('nawah_pending_batch_data');
        if (pending) {
          const data = JSON.parse(pending);
          if (data.sourceName) setSourceName(data.sourceName);
          if (data.quantity) setQuantity(data.quantity);
          if (data.dateType) setDateType(data.dateType);
          if (data.cleaningStatus) setCleaningStatus(data.cleaningStatus);
          if (data.dryingStatus) setDryingStatus(data.dryingStatus);
          if (data.moisture) setMoisture(data.moisture);
          if (data.storageMethod) setStorageMethod(data.storageMethod);
          if (data.notes) setNotes(data.notes);
          localStorage.removeItem('nawah_pending_batch_data');
          localStorage.removeItem('nawah_pending_action');
        }
      } catch(e) {}
    }
  }, []);
`;
  code = code.replace(/const availableCities = SAUDI_CITIES\.filter/, useEffectRestore + '\n  const availableCities = SAUDI_CITIES.filter');
}

fs.writeFileSync('src/app/pit-management/batches/new/page.tsx', code, 'utf-8');
console.log('Added pending batch restore');
