// This script prevents any Sentry initialization with invalid DSN values
(function() {
  // Override any global Sentry object that might exist or be created later
  Object.defineProperty(window, 'Sentry', {
    configurable: true,
    enumerable: true,
    get: function() {
      return window.__realSentry || {};
    },
    set: function(val) {
      // Store the real Sentry object
      window.__realSentry = val;
      
      // Make sure init is overridden
      if (val && typeof val === 'object') {
        const originalInit = val.init;
        
        val.init = function(options) {
          // Check if the DSN is invalid (specifically 'a')
          if (options && (options.dsn === 'a' || options.dsn === '' || !options.dsn)) {
            console.warn('Prevented Sentry initialization with invalid DSN');
            return {};
          }
          
          // If original init exists and the DSN is valid, call it
          if (originalInit && typeof originalInit === 'function') {
            return originalInit.apply(this, arguments);
          }
        };
      }
      
      return val;
    }
  });
})(); 