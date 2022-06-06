export default interface IAdministrator {
    administratorId: number;
    username: string;
    passwordHash: string|null;
    createdAt: string;
    isActive: boolean;
}
