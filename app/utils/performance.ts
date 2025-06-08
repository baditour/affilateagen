import React from 'react';
import { InteractionManager, Platform } from 'react-native';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private startTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.startTimes.set(label, Date.now());
  }

  endTimer(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`Timer '${label}' was not started`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.metrics.set(label, duration);
    this.startTimes.delete(label);

    if (__DEV__) {
      console.log(`⏱️ ${label}: ${duration}ms`);
    }

    return duration;
  }

  getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Lazy loading utility for components
export function createLazyComponent<T>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(() => {
    return new Promise((resolve) => {
      InteractionManager.runAfterInteractions(() => {
        importFunc().then(resolve);
      });
    });
  });
}

// Image optimization utilities
export const ImageOptimizer = {
  // Get optimized image URL based on device capabilities
  getOptimizedImageUrl(
    baseUrl: string,
    width: number,
    height: number,
    quality = 80
  ): string {
    const pixelRatio = Platform.select({
      ios: 2,
      android: 2,
      default: 1,
    });

    const optimizedWidth = Math.round(width * pixelRatio);
    const optimizedHeight = Math.round(height * pixelRatio);

    // This would typically integrate with a CDN service like Cloudinary
    return `${baseUrl}?w=${optimizedWidth}&h=${optimizedHeight}&q=${quality}&f=auto`;
  },

  // Preload critical images (React Native compatible)
  preloadImages(urls: string[]): Promise<void[]> {
    const promises = urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        // In React Native, we would use Image.prefetch or similar
        // For now, we'll just resolve immediately
        setTimeout(() => resolve(), 100);
      });
    });

    return Promise.all(promises);
  },
};

// Memory management utilities
export const MemoryManager = {
  // Clean up unused data
  cleanup(): void {
    if (__DEV__) {
      console.log('🧹 Running memory cleanup...');
    }

    // Clear performance metrics older than 5 minutes
    const monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();

    // Force garbage collection in development (if available)
    if (__DEV__ && typeof global !== 'undefined' && (global as any).gc) {
      (global as any).gc();
    }
  },

  // Monitor memory usage (development only)
  logMemoryUsage(): void {
    if (__DEV__ && typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      console.log('📊 Memory Usage:', {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      });
    } else if (__DEV__) {
      console.log('📊 Memory monitoring not available in this environment');
    }
  },
};

// Bundle size optimization utilities
export const BundleOptimizer = {
  // Dynamically import modules to reduce initial bundle size
  async loadModule<T>(modulePath: string): Promise<T> {
    try {
      const module = await import(modulePath);
      return module.default || module;
    } catch (error) {
      console.error(`Failed to load module: ${modulePath}`, error);
      throw error;
    }
  },

  // Code splitting utility
  createAsyncComponent<T>(
    loader: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) {
    const LazyComponent = React.lazy(loader);

    return (props: any) =>
      React.createElement(
        React.Suspense,
        { fallback: fallback ? React.createElement(fallback) : null },
        React.createElement(LazyComponent, props)
      );
  },
};

// Network optimization utilities
export const NetworkOptimizer = {
  // Batch multiple API requests
  batchRequests<T>(
    requests: (() => Promise<T>)[],
    batchSize = 3
  ): Promise<T[]> {
    const batches: (() => Promise<T>)[][] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      batches.push(requests.slice(i, i + batchSize));
    }

    return batches.reduce(async (acc, batch) => {
      const results = await acc;
      const batchResults = await Promise.all(batch.map(request => request()));
      return [...results, ...batchResults];
    }, Promise.resolve([] as T[]));
  },

  // Request deduplication
  createRequestDeduplicator<T>() {
    const pendingRequests = new Map<string, Promise<T>>();

    return (key: string, requestFn: () => Promise<T>): Promise<T> => {
      if (pendingRequests.has(key)) {
        return pendingRequests.get(key)!;
      }

      const promise = requestFn().finally(() => {
        pendingRequests.delete(key);
      });

      pendingRequests.set(key, promise);
      return promise;
    };
  },
};

// Performance hooks (commented out to avoid JSX issues in .ts file)
// These should be moved to a separate .tsx file if needed
/*
export function usePerformanceTimer(label: string) {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.startTimer(label);
    return () => {
      monitor.endTimer(label);
    };
  }, [label, monitor]);
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
*/

// Export performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();
