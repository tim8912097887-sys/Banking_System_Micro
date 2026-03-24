

export const successResponseMock = (respnseData: any,serviceName: string) => {
    const successResponse = {
                    state: "success",
                    error: null,
                    data: respnseData,
                    service: serviceName,
                    meta: {
                        timestamp: expect.any(String)
                    }
                }
    return successResponse;
}

export const errorResponseMock = (respnseData: any,serviceName: string) => {
    const errorResponse = {
                    state: "error",
                    error: respnseData,
                    data: null,
                    service: serviceName,
                    meta: {
                        timestamp: expect.any(String)
                    }
                }
    return errorResponse;
}