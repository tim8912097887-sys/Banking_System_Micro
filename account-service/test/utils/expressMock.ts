import { jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';

export const createMockRequest = (overrides: Partial<Request>) => {
    const req = {
        params: {},
        body: {},
        query: {},
        user: null,
        validData: null,
        ...overrides
    } as unknown as Request;
    return req;
}

export const createMockResponse = () => {
    const res = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
    } as unknown as Response;

    return res;
}

export const createMockNext = () => jest.fn() as unknown as NextFunction;


