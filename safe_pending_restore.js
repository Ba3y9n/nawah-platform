const fs = require('fs');

// 1. Update batches/new/page.tsx
let batchCode = fs.readFileSync('src/app/pit-management/batches/new/page.tsx', 'utf-8');

const oldBatchSubmit = `        if (typeof window !== 'undefined') {
          try {
            // Save basic form fields if needed
            localStorage.setItem('nawah_pending_action', 'new_batch');
          } catch(e) {}
        }`;

const newBatchSubmit = `        if (typeof window !== 'undefined') {
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
        }`;

batchCode = batchCode.replace(oldBatchSubmit, newBatchSubmit);

const batchRestoreEffect = `
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

batchCode = batchCode.replace(
  'const availableCities = SAUDI_CITIES.filter(c => c.region_id === selectedRegionId);',
  batchRestoreEffect + '\n  const availableCities = SAUDI_CITIES.filter(c => c.region_id === selectedRegionId);'
);

fs.writeFileSync('src/app/pit-management/batches/new/page.tsx', batchCode, 'utf-8');

// 2. Update experiments/new/page.tsx
let expCode = fs.readFileSync('src/app/pit-management/experiments/new/page.tsx', 'utf-8');

const oldExpSubmit = `        if (typeof window !== 'undefined') {
          try {
            // Save basic form fields if needed
            localStorage.setItem('nawah_pending_action', 'new_experiment');
          } catch(e) {}
        }`;

const newExpSubmit = `        if (typeof window !== 'undefined') {
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
        }`;

expCode = expCode.replace(oldExpSubmit, newExpSubmit);

const expRestoreEffect = `
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

expCode = expCode.replace(
  'const selectedBatch = batches.find(b => b.id === selectedBatchId);',
  expRestoreEffect + '\n  const selectedBatch = batches.find(b => b.id === selectedBatchId);'
);

fs.writeFileSync('src/app/pit-management/experiments/new/page.tsx', expCode, 'utf-8');

console.log('Cleanly updated pending restoration in both files');
