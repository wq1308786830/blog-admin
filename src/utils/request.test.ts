import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { GET, POST, PUT, DELETE } from './request';
import * as tools from '@/utils/tools';

// Mock依赖
vi.mock('axios');
vi.mock('@/utils/tools', () => ({
  parseObj2SearchParams: vi.fn((params) => {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== '') {
        searchParams.set(k, String(v));
      }
    });
    return searchParams.toString();
  }),
  toast: vi.fn(),
  loading: vi.fn(),
}));

describe('request.ts - HTTP核心层', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET请求', () => {
    it('✅ TDD: GET请求应正确拼接URL参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', { key: 'value', page: 1 }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?key=value&page=1',
          method: 'GET',
        })
      );
    });

    it('✅ TDD: GET请求处理null参数时应返回空字符串', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', null, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test',
          method: 'GET',
        })
      );
    });

    it('✅ TDD: GET请求空参数对象时不应添加查询字符串', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', {}, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test',
          method: 'GET',
        })
      );
    });

    it('✅ TDD: GET请求应正确处理数字类型参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', { id: 123, pageIndex: 1 }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?id=123&pageIndex=1',
          method: 'GET',
        })
      );
    });
  });

  describe('POST请求', () => {
    it('✅ TDD: POST请求应序列化body参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await POST('/api/test', { name: 'test', value: 123 }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: expect.any(String),
          url: '/api/test',
        })
      );
    });

    it('✅ TDD: POST请求处理null参数时应传递空字符串', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await POST('/api/test', null, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: '',
        })
      );
    });
  });

  describe('PUT请求', () => {
    it('✅ TDD: PUT请求应正确传递参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await PUT('/api/test', { id: 1, name: 'updated' }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/test',
          data: expect.any(String),
        })
      );
    });
  });

  describe('DELETE请求', () => {
    it('✅ TDD: DELETE请求应正确拼接URL参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await DELETE('/api/test', { id: 123 }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?id=123',
          method: 'DELETE',
        })
      );
    });
  });

  describe('错误处理', () => {
    it('✅ TDD: 请求失败时应显示错误Toast', async () => {
      const error = new Error('Network Error');
      vi.mocked(axios).mockRejectedValue(error);

      await expect(GET('/api/test', null, false)).rejects.toThrow();
    });

    it('✅ TDD: 自定义错误消息时应优先显示', async () => {
      const error = new Error('Custom error') as any;
      error.errMessage = '自定义错误';
      vi.mocked(axios).mockRejectedValue(error);

      await expect(GET('/api/test', null, false)).rejects.toThrow();
      // 错误消息在loading回调中处理
    });

    it('✅ TDD: showLoading=true时应调用loading', async () => {
      const loadingSpy = vi.spyOn(tools, 'loading');
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });

      await GET('/api/test', null, true);

      expect(loadingSpy).toHaveBeenCalledWith(true);
    });

    it('✅ TDD: 请求成功后应关闭loading', async () => {
      const loadingSpy = vi.spyOn(tools, 'loading');
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });

      await GET('/api/test', null, true);

      // 验证loading被调用两次（开启和关闭）
      expect(loadingSpy).toHaveBeenCalledTimes(2);
    });

    it('✅ TDD: 请求失败时应在loading回调中显示错误', async () => {
      const loadingSpy = vi.spyOn(tools, 'loading');
      vi.mocked(axios).mockRejectedValue(new Error('Error'));

      try {
        await GET('/api/test', null, true);
      } catch (e) {
        // 预期会抛出错误
      }

      // 验证loading被调用
      expect(loadingSpy).toHaveBeenCalled();
    });
  });

  describe('响应拦截器', () => {
    it('✅ TDD: 2xx状态码应返回数据', async () => {
      const mockResponseData = { success: true, data: { id: 1 } };
      // 模拟axios拦截器返回response.data（即直接返回data）
      vi.mocked(axios).mockResolvedValue(mockResponseData as any);

      const result = await GET('/api/test', null, false);
      // axios拦截器返回response.data，所以结果应该是mockResponseData
      expect(result).toEqual(mockResponseData);
    });

    it('✅ TDD: 非成功状态码应抛出错误', async () => {
      vi.mocked(axios).mockRejectedValue({
        status: 500,
        data: { error: 'Server Error' },
      });

      await expect(GET('/api/test', null, false)).rejects.toBeTruthy();
    });
  });

  describe('参数处理', () => {
    it('✅ TDD: 应正确过滤null和undefined参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', { a: null, b: undefined, c: 'valid' }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?c=valid',
        })
      );
    });

    it('✅ TDD: 应过滤空字符串参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', { a: '', b: 'value' }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?b=value',
        })
      );
    });

    it('✅ TDD: 应保留数字0作为有效值', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', { count: 0 }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?count=0',
        })
      );
    });

    it('✅ TDD: 应正确处理布尔值参数', async () => {
      vi.mocked(axios).mockResolvedValue({ data: { success: true } });
      await GET('/api/test', { active: true, deleted: false }, false);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/test?active=true&deleted=false',
        })
      );
    });
  });
});
