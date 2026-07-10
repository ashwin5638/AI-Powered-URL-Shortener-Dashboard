import api from "./axios";
import type { ApiResponse, Link, LinkAnalytics } from "../types";

export const getLinks = (params?: { page?: number; limit?: number; search?: string }) =>
  api.get<ApiResponse<Link[]>>("/links", { params });

export const getLink = (id: string) =>
  api.get<ApiResponse<Link>>(`/links/${id}`);

export const getLinkAnalytics = (id: string) =>
  api.get<ApiResponse<LinkAnalytics>>(`/links/${id}/analytics`);

export const createLink = (data: {
  title: string;
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string | null;
}) => api.post<ApiResponse<Link>>("/links", data);

export const updateLink = (
  id: string,
  data: {
    title?: string;
    originalUrl?: string;
    customAlias?: string;
    expiresAt?: string | null;
  }
) => api.put<ApiResponse<Link>>(`/links/${id}`, data);

export const deleteLink = (id: string) =>
  api.delete<ApiResponse<null>>(`/links/${id}`);

export const toggleStatus = (id: string) =>
  api.patch<ApiResponse<Link>>(`/links/${id}/status`);

export const generateSuggestion = (data: { title: string; url: string }) =>
  api.post<ApiResponse<string | null>>("/links/generate-suggestion", data);
