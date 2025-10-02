export class ApiResponse<T> {
    constructor(
        public status: number,
        public data: T | null,
        public message: string
    ) {}
}
