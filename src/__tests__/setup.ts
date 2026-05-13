import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Tự động dọn dẹp DOM sau mỗi ca test để tránh rò rỉ dữ liệu giữa các test
afterEach(() => {
  cleanup();
});
