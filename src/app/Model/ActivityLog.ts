export class ActivityLog {
    constructor(
        public userId: string,
        public email: string,
        public role: string,
        public action: string,
        public timestamp: Date
    ) {}
}