export const pdf = async (_buffer: Buffer, _options?: Record<string, unknown>) => {
    return {
        getPage: async (_page: number) => Buffer.from([]),
    };
};
