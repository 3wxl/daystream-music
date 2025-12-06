declare function debounce(fn: any, delay: number, immediate?: boolean): (...args: [any]) => void;
declare function throttle(fn: any, interval: number, leading?: boolean, trailing?: boolean): (...args: any[]) => void;
export { debounce, throttle };
