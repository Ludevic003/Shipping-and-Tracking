/**
 * Diagnostic Logger Utility
 * Used to track operations, data payloads, and errors throughout the application.
 */

export const logStep = (stepName, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔵 [STEP] ${stepName}`);
  if (data) {
    console.log(`   ↳ Data:`, data);
  }
};

export const logFormData = (formData, context = 'Form Data') => {
  const timestamp = new Date().toISOString();
  const dataObj = {};
  
  if (formData instanceof FormData) {
    for (let [key, value] of formData.entries()) {
      // Don't log full file contents, just metadata
      if (value instanceof File) {
        dataObj[key] = `File: ${value.name} (${value.size} bytes, ${value.type})`;
      } else {
        dataObj[key] = value;
      }
    }
  } else if (typeof formData === 'object' && formData !== null) {
    Object.assign(dataObj, formData);
  } else {
    dataObj.value = formData;
  }

  console.log(`[${timestamp}] 🟡 [DATA] ${context}:`, dataObj);
};

export const logResponse = (response, context = 'API Response') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🟢 [SUCCESS] ${context}:`, response);
};

export const logError = (error, context = 'Operation Failed') => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] 🔴 [ERROR] ${context}`);
  
  if (error.response) {
    console.error(`   ↳ Status:`, error.response.status);
    console.error(`   ↳ Data:`, error.response.data);
  } else {
    console.error(`   ↳ Message:`, error.message || error);
  }
  
  if (error.stack) {
    console.error(`   ↳ Stack:`, error.stack);
  }
};