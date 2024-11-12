export interface HttpClient {
    get<T>(url: string, config?: any): Promise<T>;
}