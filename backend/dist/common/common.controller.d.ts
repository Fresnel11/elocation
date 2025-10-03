import { AdminService } from '../admin/admin.service';
export declare class CommonController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getPublicSettings(): Promise<import("../admin/entities/system-setting.entity").SystemSetting[]>;
}
